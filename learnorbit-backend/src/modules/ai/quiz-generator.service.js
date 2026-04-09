const { GoogleGenAI, Type } = require('@google/genai');

class QuizGeneratorService {
  async generateQuiz(lessonText) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY is not configured, using mock quiz data.');
        return {
          questions: [
            {
              question: "What is the main topic of this lesson?",
              options: [
                "Option A",
                "Option B",
                "Option C",
                "Option D"
              ],
              answer: "Option A",
              explanation: "This is a mock explanation because no API key was provided."
            }
          ]
        };
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Generate 5 multiple choice questions based on the following lesson.

Return structured JSON with:
* question
* 4 options
* correct answer (this must exactly match one of the options)
* explanation

Lesson Content: ${lessonText}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    answer: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  },
                  required: ["question", "options", "answer", "explanation"]
                }
              }
            },
            required: ["questions"]
          }
        }
      });
      
      const jsonResponse = JSON.parse(response.text);
      return jsonResponse;
    } catch (error) {
      console.error('Error in QuizGeneratorService.generateQuiz:', error);
      throw error;
    }
  }
}

module.exports = new QuizGeneratorService();
