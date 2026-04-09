const { GoogleGenAI, Type } = require('@google/genai');

class AiService {
  async generateCourseOutline(topic) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        // Fallback mock mode if no api key is provided, for smooth user testing
        console.warn('GEMINI_API_KEY is not configured, using mock data.');
        return {
          title: topic,
          modules: [
            {
              moduleTitle: "Introduction to " + topic,
              lessons: [
                "What is " + topic,
                "Types and Applications",
                "Real World Examples"
              ]
            },
            {
              moduleTitle: "Core Concepts",
              lessons: [
                "Basic Principles",
                "Intermediate Techniques",
                "Advanced Strategies"
              ]
            }
          ]
        };
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Generate a structured course outline for the topic: "${topic}".
      Do not return markdown, just raw JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              modules: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    moduleTitle: { type: Type.STRING },
                    lessons: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  required: ["moduleTitle", "lessons"]
                }
              }
            },
            required: ["title", "modules"]
          }
        }
      });
      
      const jsonResponse = JSON.parse(response.text);
      return jsonResponse;
    } catch (error) {
      console.error('Error in AiService.generateCourseOutline:', error);
      throw error;
    }
  }

  async generateInsight(stats) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY is not configured, using mock data.');
        return {
          insight: `Enrollment has slowed this week and ${stats.inactiveCourses || 3} courses show no activity. Consider promoting them or updating their content.`
        };
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Analyze the following e-learning platform statistics and generate one useful insight for administrators.

Total Students: ${stats.totalStudents || 400}
New Enrollments This Week: ${stats.newEnrollments || 20}
Inactive Courses: ${stats.inactiveCourses || 3}
Dropout Rate: ${stats.dropoutRate || 15}%
Active Users: ${stats.activeUsers || 120}

Return a concise insight in one sentence. Do not return markdown, just raw JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              insight: { type: Type.STRING }
            },
            required: ["insight"]
          }
        }
      });
      
      const jsonResponse = JSON.parse(response.text);
      return jsonResponse;
    } catch (error) {
      console.error('Error in AiService.generateInsight:', error);
      throw error;
    }
  }
}

module.exports = new AiService();
