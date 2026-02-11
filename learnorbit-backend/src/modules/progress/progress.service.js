// src/modules/progress/progress.service.js
const progressRepo = require('./progress.repository');
const lessonRepo = require('../lessons/lesson.repository');
const enrollmentRepo = require('../enrollments/enrollment.repository');
const logger = require('../../utils/logger');

class ProgressService {
  /**
   * Mark progress for a lesson
   * @param {number} userId 
   * @param {number} lessonId 
   * @param {number} watchPercentage 
   */
  async markProgress(userId, lessonId, watchPercentage) {
    if (typeof watchPercentage !== 'number' || watchPercentage < 0 || watchPercentage > 100) {
      throw { status: 400, message: 'watch_percentage must be a number between 0 and 100' };
    }

    const completed = watchPercentage >= 90;

    // Ensure lesson exists
    const lesson = await lessonRepo.findById(lessonId);
    if (!lesson) {
      throw { status: 404, message: 'Lesson not found' };
    }

    // Ensure enrollment
    const enrollmentStatus = await enrollmentRepo.getStatus(userId, lesson.course_id);
    if (enrollmentStatus !== 'active') {
      throw { status: 403, message: 'Access denied: Active enrollment required' };
    }

    await progressRepo.upsert(userId, lessonId, completed, watchPercentage);

    return {
      success: true,
      completed,
      watchPercentage
    };
  }

  /**
   * Get course progress summary
   * @param {number} userId 
   * @param {number} courseId 
   */
  async getCourseProgress(userId, courseId) {
    // Return: { completedLessons: [ids], percentage: number, resumeLessonId: number }

    // 1. Get all lessons with progress
    const lessons = await progressRepo.getCourseProgress(userId, courseId);

    if (!lessons.length) {
      return {
        completedLessons: [],
        percentage: 0,
        resumeLessonId: null
      };
    }

    const totalLessons = lessons.length;
    const completedLessonIds = [];
    let resumeLessonId = null;

    // 2. Aggregate data
    lessons.forEach(lesson => {
      if (lesson.completed) {
        completedLessonIds.push(lesson.lesson_id);
      }
    });

    // 3. Find resume lesson (first incomplete)
    // Lessons are ordered by order_index
    const firstIncomplete = lessons.find(l => !l.completed);

    if (firstIncomplete) {
      resumeLessonId = firstIncomplete.lesson_id;
    } else {
      // All complete -> last lesson
      resumeLessonId = lessons[lessons.length - 1].lesson_id;
    }

    const percentage = Math.round((completedLessonIds.length / totalLessons) * 100);

    return {
      completedLessons: completedLessonIds,
      percentage,
      resumeLessonId
    };
  }
}

module.exports = new ProgressService();
