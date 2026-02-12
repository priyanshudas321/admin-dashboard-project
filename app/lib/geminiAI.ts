import { GoogleGenerativeAI } from '@google/generative-ai';

// This reads from environment variables - NEVER hardcode API keys
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function summarizeWithGemini(text: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Truncate text to avoid token limits if necessary, though simpler here
    const prompt = `Please summarize this YouTube video transcript in 3-5 bullet points:
    
    ${text.substring(0, 5000)}
    
    Summary:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate summary with AI');
  }
}
