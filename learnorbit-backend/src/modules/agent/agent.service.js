// src/modules/agent/agent.service.js
const agentRepo = require('./agent.repository');
const logger = require('../../utils/logger');

/**
 * Agent Service – Processes user questions and generates intelligent responses
 * about LearnOrbit courses using keyword matching and database context.
 */
class AgentService {
    /**
     * Process a user question and return a contextual response.
     * @param {string} question - The user's question
     * @param {object|null} user - The authenticated user (optional)
     * @returns {object} - { answer, sources, suggestions }
     */
    async processQuestion(question, user = null) {
        const q = question.toLowerCase().trim();

        try {
            // Detect intent from the question
            const intent = this.detectIntent(q);
            logger.info(`Agent intent detected: ${intent}`, { question: q });

            switch (intent) {
                case 'list_courses':
                    return await this.handleListCourses();

                case 'search_course':
                    return await this.handleSearchCourse(q);

                case 'course_detail':
                    return await this.handleCourseDetail(q);

                case 'course_lessons':
                    return await this.handleCourseLessons(q);

                case 'my_enrollments':
                    return await this.handleMyEnrollments(user);

                case 'my_progress':
                    return await this.handleMyProgress(q, user);

                case 'how_to_enroll':
                    return this.handleHowToEnroll();

                case 'greeting':
                    return this.handleGreeting(user);

                case 'help':
                    return this.handleHelp();

                default:
                    return await this.handleGeneral(q);
            }
        } catch (error) {
            logger.error(`Agent error: ${error.message}`, { error: error.stack });
            return {
                answer: "I'm sorry, I encountered an error while processing your question. Please try again in a moment.",
                sources: [],
                suggestions: ['Show all courses', 'Help'],
            };
        }
    }

    /**
     * Detect the user's intent from the question.
     */
    detectIntent(q) {
        // Greeting patterns
        if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening))\b/.test(q)) {
            return 'greeting';
        }

        // Help
        if (/^(help|what can you do|what do you do|commands|menu)\b/.test(q)) {
            return 'help';
        }

        // List all courses
        if (
            /(show|list|all|available|what)\s*(all\s*)?(courses|programs|classes)/i.test(q) ||
            /what courses/i.test(q) ||
            q === 'courses'
        ) {
            return 'list_courses';
        }

        // My enrollments
        if (/(my|enrolled|enrollment|my courses|what am i|am i enrolled)/i.test(q)) {
            return 'my_enrollments';
        }

        // My progress
        if (/(my progress|how (am i|far)|completion|completed|percentage)/i.test(q)) {
            return 'my_progress';
        }

        // How to enroll
        if (/(how to|how do i|how can i)\s*(enroll|enrol|register|sign up|join)/i.test(q)) {
            return 'how_to_enroll';
        }

        // Course lessons (what's inside a course)
        if (/(lesson|module|content|syllabus|curriculum|what('s| is) (inside|in|covered))/i.test(q)) {
            return 'course_lessons';
        }

        // Course detail
        if (/(tell me about|details|describe|info|information|about)\s*(the\s*)?(course)?/i.test(q)) {
            return 'course_detail';
        }

        // Search / find a specific course
        if (/(find|search|look|any course|is there|do you have)/i.test(q)) {
            return 'search_course';
        }

        return 'general';
    }

    // ─── Intent Handlers ───────────────────────────────

    async handleListCourses() {
        const courses = await agentRepo.getAllCoursesWithMeta();

        if (!courses.length) {
            return {
                answer: "There are no published courses available at the moment. Check back soon! 🚀",
                sources: [],
                suggestions: ['How to enroll', 'Help'],
            };
        }

        let answer = `📚 **Here are the available courses on LearnOrbit:**\n\n`;
        courses.forEach((c, i) => {
            const lessons = parseInt(c.lesson_count) || 0;
            answer += `**${i + 1}. ${c.title}**\n`;
            if (c.description) {
                answer += `   ${c.description.substring(0, 120)}${c.description.length > 120 ? '...' : ''}\n`;
            }
            answer += `   📖 ${lessons} lesson${lessons !== 1 ? 's' : ''}\n\n`;
        });

        answer += `\nWant to know more about a specific course? Just ask! 😊`;

        return {
            answer,
            sources: courses.map(c => ({ id: c.id, title: c.title })),
            suggestions: [
                courses[0] ? `Tell me about ${courses[0].title}` : null,
                'How to enroll',
                'Help',
            ].filter(Boolean),
        };
    }

    async handleSearchCourse(q) {
        // Extract potential keywords from the question
        const stopWords = ['find', 'search', 'look', 'for', 'any', 'course', 'courses', 'about', 'on', 'in', 'the', 'a', 'is', 'there', 'do', 'you', 'have', 'related', 'to'];
        const keywords = q.split(/\s+/).filter(w => !stopWords.includes(w) && w.length > 2);

        if (!keywords.length) {
            return await this.handleListCourses();
        }

        // Search for each keyword and combine results
        const resultMap = new Map();
        for (const kw of keywords) {
            const results = await agentRepo.searchCourses(kw);
            results.forEach(c => resultMap.set(c.id, c));
        }

        const courses = Array.from(resultMap.values());

        if (!courses.length) {
            return {
                answer: `🔍 I couldn't find any courses matching "${keywords.join(' ')}". Here's what you can try:\n\n• Ask me to **show all courses** to see everything available\n• Try different keywords\n• Contact support for more help`,
                sources: [],
                suggestions: ['Show all courses', 'Help'],
            };
        }

        let answer = `🔍 **Found ${courses.length} course${courses.length !== 1 ? 's' : ''} matching your search:**\n\n`;
        courses.forEach((c, i) => {
            answer += `**${i + 1}. ${c.title}**\n`;
            if (c.description) {
                answer += `   ${c.description.substring(0, 120)}${c.description.length > 120 ? '...' : ''}\n`;
            }
            answer += `   📖 ${parseInt(c.lesson_count) || 0} lessons\n\n`;
        });

        return {
            answer,
            sources: courses.map(c => ({ id: c.id, title: c.title })),
            suggestions: [
                courses[0] ? `Tell me about ${courses[0].title}` : null,
                'Show all courses',
                'How to enroll',
            ].filter(Boolean),
        };
    }

    async handleCourseDetail(q) {
        // Try to find a course name in the question
        const courses = await agentRepo.getAllCoursesWithMeta();
        const match = this.findBestCourseMatch(q, courses);

        if (!match) {
            return {
                answer: "I'd love to tell you about a specific course! Could you mention the course name? Or ask me to **show all courses** to see what's available.",
                sources: [],
                suggestions: ['Show all courses', 'Help'],
            };
        }

        const course = await agentRepo.getCourseById(match.id);
        const lessons = await agentRepo.getLessonsByCourse(match.id);

        let answer = `📘 **${course.title}**\n\n`;

        if (course.description) {
            answer += `${course.description}\n\n`;
        }

        answer += `📊 **Course Details:**\n`;
        answer += `• **Lessons:** ${lessons.length}\n`;

        if (course.start_date) {
            answer += `• **Start Date:** ${new Date(course.start_date).toLocaleDateString()}\n`;
        }
        if (course.end_date) {
            answer += `• **End Date:** ${new Date(course.end_date).toLocaleDateString()}\n`;
        }

        if (lessons.length > 0) {
            answer += `\n📖 **Lesson Overview:**\n`;
            lessons.slice(0, 8).forEach((l, i) => {
                const typeIcon = { video: '🎥', text: '📝', pdf: '📄', link: '🔗' }[l.type] || '📌';
                answer += `${i + 1}. ${typeIcon} ${l.title}\n`;
            });
            if (lessons.length > 8) {
                answer += `... and ${lessons.length - 8} more lessons\n`;
            }
        }

        return {
            answer,
            sources: [{ id: course.id, title: course.title }],
            suggestions: [
                `What lessons are in ${course.title}`,
                'How to enroll',
                'Show all courses',
            ],
        };
    }

    async handleCourseLessons(q) {
        const courses = await agentRepo.getAllCoursesWithMeta();
        const match = this.findBestCourseMatch(q, courses);

        if (!match) {
            return {
                answer: "Which course would you like to see the lessons for? Please mention the course name, or ask me to **show all courses** first.",
                sources: [],
                suggestions: ['Show all courses'],
            };
        }

        const lessons = await agentRepo.getLessonsByCourse(match.id);

        if (!lessons.length) {
            return {
                answer: `The course **"${match.title}"** doesn't have any lessons published yet. Check back soon! 🔜`,
                sources: [{ id: match.id, title: match.title }],
                suggestions: ['Show all courses', 'Help'],
            };
        }

        let answer = `📖 **Lessons in "${match.title}":**\n\n`;
        lessons.forEach((l, i) => {
            const typeIcon = { video: '🎥', text: '📝', pdf: '📄', link: '🔗' }[l.type] || '📌';
            answer += `**${i + 1}. ${typeIcon} ${l.title}** _(${l.type})_\n`;
        });

        answer += `\nTotal: **${lessons.length} lesson${lessons.length !== 1 ? 's' : ''}** 🎯`;

        return {
            answer,
            sources: [{ id: match.id, title: match.title }],
            suggestions: [
                `Tell me about ${match.title}`,
                'How to enroll',
                'Show all courses',
            ],
        };
    }

    async handleMyEnrollments(user) {
        if (!user) {
            return {
                answer: "You need to be logged in for me to check your enrollments. Please log in and try again! 🔐",
                sources: [],
                suggestions: ['Show all courses', 'How to enroll'],
            };
        }

        const enrollments = await agentRepo.getUserEnrollments(user.id);

        if (!enrollments.length) {
            return {
                answer: "You haven't enrolled in any courses yet. Browse our courses and start learning! 🚀",
                sources: [],
                suggestions: ['Show all courses', 'How to enroll'],
            };
        }

        let answer = `📋 **Your Enrollments:**\n\n`;
        enrollments.forEach((e, i) => {
            const statusIcon = {
                active: '✅',
                pending: '⏳',
                cancelled: '❌',
                completed: '🎉',
            }[e.status] || '📌';
            answer += `**${i + 1}. ${e.course_title}** ${statusIcon} _${e.status}_\n`;
            answer += `   Enrolled: ${new Date(e.enrolled_at).toLocaleDateString()}\n\n`;
        });

        return {
            answer,
            sources: enrollments.map(e => ({ id: e.course_id, title: e.course_title })),
            suggestions: [
                'My progress',
                'Show all courses',
                enrollments[0] ? `Tell me about ${enrollments[0].course_title}` : null,
            ].filter(Boolean),
        };
    }

    async handleMyProgress(q, user) {
        if (!user) {
            return {
                answer: "You need to be logged in for me to check your progress. Please log in and try again! 🔐",
                sources: [],
                suggestions: ['Show all courses', 'How to enroll'],
            };
        }

        // Try to find a specific course in the question
        const enrollments = await agentRepo.getUserEnrollments(user.id);
        if (!enrollments.length) {
            return {
                answer: "You're not enrolled in any courses yet, so there's no progress to show. Start learning today! 🚀",
                sources: [],
                suggestions: ['Show all courses', 'How to enroll'],
            };
        }

        const courses = await agentRepo.getAllCoursesWithMeta();
        const match = this.findBestCourseMatch(q, courses);

        if (match) {
            // Show progress for a specific course
            const progress = await agentRepo.getUserProgress(user.id, match.id);
            const total = progress.length;
            const completed = progress.filter(p => p.completed).length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

            let answer = `📊 **Your Progress in "${match.title}":**\n\n`;
            answer += `• Completed: **${completed}/${total}** lessons\n`;
            answer += `• Progress: **${pct}%** ${pct === 100 ? '🎉' : pct >= 50 ? '💪' : '📖'}\n\n`;

            if (progress.length) {
                answer += `**Lesson Breakdown:**\n`;
                progress.forEach((p, i) => {
                    answer += `${p.completed ? '✅' : '⬜'} ${p.lesson_title}\n`;
                });
            }

            return {
                answer,
                sources: [{ id: match.id, title: match.title }],
                suggestions: ['My enrollments', 'Show all courses'],
            };
        }

        // Show overview for all enrollments
        let answer = `📊 **Your Learning Overview:**\n\n`;
        for (const e of enrollments) {
            const progress = await agentRepo.getUserProgress(user.id, e.course_id);
            const total = progress.length;
            const completed = progress.filter(p => p.completed).length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

            const bar = this.progressBar(pct);
            answer += `**${e.course_title}**\n`;
            answer += `${bar} ${pct}%  (${completed}/${total} lessons)\n\n`;
        }

        return {
            answer,
            sources: enrollments.map(e => ({ id: e.course_id, title: e.course_title })),
            suggestions: [
                enrollments[0] ? `My progress in ${enrollments[0].course_title}` : null,
                'Show all courses',
            ].filter(Boolean),
        };
    }

    handleHowToEnroll() {
        const answer = `🎓 **How to Enroll in a Course:**\n\n` +
            `1. **Browse Courses** – Go to the Courses page to view all available courses\n` +
            `2. **Select a Course** – Click on a course to see its details and lessons\n` +
            `3. **Click Enroll** – Hit the "Enroll" button on the course page\n` +
            `4. **Wait for Approval** – Your enrollment may require admin approval\n` +
            `5. **Start Learning!** – Once approved, access all course lessons\n\n` +
            `💡 *Tip: You can track your progress in your dashboard after enrollment.*`;

        return {
            answer,
            sources: [],
            suggestions: ['Show all courses', 'My enrollments', 'Help'],
        };
    }

    handleGreeting(user) {
        const name = user?.name ? ` ${user.name}` : '';
        const answer = `👋 **Hello${name}!** Welcome to LearnOrbit Assistant!\n\n` +
            `I can help you with:\n` +
            `• 📚 Browse and search courses\n` +
            `• 📖 View course details and lessons\n` +
            `• 📋 Check your enrollments\n` +
            `• 📊 Track your learning progress\n\n` +
            `What would you like to know?`;

        return {
            answer,
            sources: [],
            suggestions: ['Show all courses', 'My enrollments', 'How to enroll'],
        };
    }

    handleHelp() {
        const answer = `🤖 **LearnOrbit Assistant – What I Can Do:**\n\n` +
            `📚 **"Show all courses"** – View every available course\n` +
            `🔍 **"Find courses about [topic]"** – Search by keyword\n` +
            `📘 **"Tell me about [course name]"** – Get course details & syllabus\n` +
            `📖 **"What lessons are in [course]"** – See the full lesson list\n` +
            `📋 **"My enrollments"** – View courses you're enrolled in\n` +
            `📊 **"My progress"** – Check your learning progress\n` +
            `🎓 **"How to enroll"** – Step-by-step enrollment guide\n\n` +
            `Just type your question naturally – I'll do my best to help! 😊`;

        return {
            answer,
            sources: [],
            suggestions: ['Show all courses', 'My enrollments', 'How to enroll'],
        };
    }

    async handleGeneral(q) {
        // Try searching courses as a fallback
        const courses = await agentRepo.getAllCoursesWithMeta();
        const match = this.findBestCourseMatch(q, courses);

        if (match) {
            return await this.handleCourseDetail(q);
        }

        // Try keyword search
        const words = q.split(/\s+/).filter(w => w.length > 3);
        for (const word of words) {
            const results = await agentRepo.searchCourses(word);
            if (results.length) {
                let answer = `I found some courses that might be related to your question:\n\n`;
                results.slice(0, 3).forEach((c, i) => {
                    answer += `**${i + 1}. ${c.title}**\n`;
                    if (c.description) {
                        answer += `   ${c.description.substring(0, 100)}...\n\n`;
                    }
                });
                answer += `Would you like to know more about any of these?`;

                return {
                    answer,
                    sources: results.slice(0, 3).map(c => ({ id: c.id, title: c.title })),
                    suggestions: [
                        results[0] ? `Tell me about ${results[0].title}` : null,
                        'Show all courses',
                        'Help',
                    ].filter(Boolean),
                };
            }
        }

        return {
            answer: "I'm not sure I understand that question. I'm best at helping with LearnOrbit courses! Try asking me to:\n\n" +
                "• **Show all courses**\n• **Find courses about [topic]**\n• **Tell me about [course name]**\n• Type **help** for a full list of things I can do! 😊",
            sources: [],
            suggestions: ['Show all courses', 'Help', 'How to enroll'],
        };
    }

    // ─── Utilities ────────────────────────────────────

    /**
     * Find the best matching course name in a query.
     */
    findBestCourseMatch(query, courses) {
        let bestMatch = null;
        let bestScore = 0;

        for (const course of courses) {
            const title = course.title.toLowerCase();
            const words = title.split(/\s+/);

            // Exact title match
            if (query.includes(title)) {
                return course;
            }

            // Word-level matching
            let matchedWords = 0;
            for (const word of words) {
                if (word.length > 2 && query.includes(word)) {
                    matchedWords++;
                }
            }

            const score = words.length > 0 ? matchedWords / words.length : 0;
            if (score > bestScore && score >= 0.4) {
                bestScore = score;
                bestMatch = course;
            }
        }

        return bestMatch;
    }

    /**
     * Generate a simple text progress bar.
     */
    progressBar(percentage) {
        const filled = Math.round(percentage / 10);
        const empty = 10 - filled;
        return '█'.repeat(filled) + '░'.repeat(empty);
    }
}

module.exports = new AgentService();
