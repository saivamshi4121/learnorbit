// src/modules/lessons/lesson.service.js
const lessonRepo = require('./lesson.repository');
const courseRepo = require('../courses/course.repository');
const enrollmentRepo = require('../enrollments/enrollment.repository');
const logger = require('../../utils/logger');

class LessonService {
  // Helper to ensure instructor owns the course
  async _ensureInstructorOwnsCourse(instructorId, courseId) {
    const course = await courseRepo.findAnyById(courseId);
    if (!course) throw { status: 404, message: 'Course not found' };
    if (course.instructor_id !== instructorId) {
      throw { status: 403, message: 'Not authorized to modify this course' };
    }
    return course;
  }

  // Create lesson (instructor only)
  async create(instructorId, courseId, payload) {
    await this._ensureInstructorOwnsCourse(instructorId, courseId);
    // Validate required fields
    if (!payload.title || !payload.type) {
      throw { status: 400, message: 'Title and type are required' };
    }
    // Video provider detection and embed URL generation
    let provider = null;
    let embedUrl = null;
    if (payload.type === 'video') {
      const url = payload.content;
      if (!url || typeof url !== 'string') {
        throw { status: 400, message: 'Video content URL is required' };
      }
      if (!/^https?:\/\//i.test(url)) {
        throw { status: 400, message: 'Video URL must start with http/https' };
      }
      if (/^javascript:/i.test(url)) {
        throw { status: 400, message: 'Javascript URLs are not allowed' };
      }
      // Detect provider
      if (/youtube\.com\/.*[?&]v=([^&]+)/i.test(url) || /youtu\.be\/([^?&]+)/i.test(url)) {
        provider = 'youtube';
        const match = url.match(/(?:v=|\/)([\w-]{11})/);
        const videoId = match ? match[1] : null;
        if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (/vimeo\.com\/\d+/i.test(url)) {
        provider = 'vimeo';
        const match = url.match(/vimeo\.com\/(\d+)/);
        const videoId = match ? match[1] : null;
        if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`;
      } else if (/\.mp4(\?.*)?$/i.test(url)) {
        provider = 'mp4';
        embedUrl = url; // direct MP4 URL
      } else {
        provider = 'external';
        embedUrl = url;
      }
    }
    const lesson = {
      course_id: parseInt(courseId, 10),
      title: payload.title,
      type: payload.type,
      content: payload.content || null,
      provider,
      embed_url: embedUrl,
      order_index: payload.order_index !== undefined ? payload.order_index : 0,
    };
    const id = await lessonRepo.create(lesson);
    return { id };
  }

  // Update lesson (instructor only, verify ownership via lesson's course)
  async update(instructorId, lessonId, payload) {
    const lesson = await lessonRepo.findById(lessonId);
    if (!lesson) throw { status: 404, message: 'Lesson not found' };
    await this._ensureInstructorOwnsCourse(instructorId, lesson.course_id);
    // If type is video and content provided, re-validate and detect provider
    let provider = lesson.provider;
    let embedUrl = lesson.embed_url;
    if (payload.type === 'video' && payload.content) {
      const url = payload.content;
      if (!/^https?:\/\//i.test(url) || /^javascript:/i.test(url)) {
        throw { status: 400, message: 'Invalid video URL' };
      }
      if (/youtube\.com\/.*[?&]v=([^&]+)/i.test(url) || /youtu\.be\/([^?&]+)/i.test(url)) {
        provider = 'youtube';
        const match = url.match(/(?:v=|\/)([\w-]{11})/);
        const videoId = match ? match[1] : null;
        embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      } else if (/vimeo\.com\/\d+/i.test(url)) {
        provider = 'vimeo';
        const match = url.match(/vimeo\.com\/(\d+)/);
        const videoId = match ? match[1] : null;
        embedUrl = videoId ? `https://player.vimeo.com/video/${videoId}` : url;
      } else if (/\.mp4(\?.*)?$/i.test(url)) {
        provider = 'mp4';
        embedUrl = url;
      } else {
        provider = 'external';
        embedUrl = url;
      }
    }
    const updates = {
      title: payload.title,
      type: payload.type,
      content: payload.content,
      provider,
      embed_url: embedUrl,
      order_index: payload.order_index,
    };
    await lessonRepo.update(lessonId, updates);
    return { message: 'Lesson updated' };
  }



  // Delete lesson (instructor only)
  async delete(instructorId, lessonId) {
    const lesson = await lessonRepo.findById(lessonId);
    if (!lesson) throw { status: 404, message: 'Lesson not found' };
    await this._ensureInstructorOwnsCourse(instructorId, lesson.course_id);
    await lessonRepo.delete(lessonId);
    return { message: 'Lesson deleted' };
  }

  // Student access – list ordered lessons for a course if enrollment approved
  async listForStudent(studentId, courseId) {
    // Verify enrollment status
    const status = await enrollmentRepo.getStatus(studentId, courseId);
    if (!status) {
      throw { status: 403, message: 'Not enrolled in this course' };
    }
    if (status !== 'approved') {
      throw { status: 403, message: 'Enrollment not approved' };
    }
    // Return ordered lessons
    const lessons = await lessonRepo.findByCourseOrdered(courseId);
    return lessons;
  }

  // Instructor view – list all lessons for a course (ordered)
  async listForInstructor(instructorId, courseId) {
    await this._ensureInstructorOwnsCourse(instructorId, courseId);
    const lessons = await lessonRepo.findByCourseOrdered(courseId);
    return lessons;
  }
}

module.exports = new LessonService();
