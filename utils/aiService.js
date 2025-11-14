/**
 * AI Service for Q&A based on PDF content
 * Uses OpenAI API to answer questions based on PDF context
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    this.baseURL = 'https://api.openai.com/v1';
  }

  /**
   * Answer question based on PDF content
   * @param {string} question - User's question
   * @param {string} pdfContent - PDF text content
   * @returns {Promise<string>} - AI-generated answer
   */
  async answerQuestion(question, pdfContent) {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Truncate PDF content if too long (keep last 3000 chars for context)
    const context = pdfContent.length > 3000 
      ? pdfContent.substring(pdfContent.length - 3000)
      : pdfContent;

    const systemPrompt = `You are a helpful assistant that answers questions based on the provided PDF document content. 
Answer questions accurately using only the information from the PDF. 
If the answer is not in the PDF, say "I don't have that information in the document."
Keep answers concise and clear (2-3 sentences maximum).`;

    const userPrompt = `PDF Content:
${context}

Question: ${question}

Answer:`;

    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 150,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const answer = response.data.choices[0].message.content.trim();
      return answer;
    } catch (error) {
      console.error('OpenAI API error:', error.response?.data || error.message);
      throw new Error(`AI service failed: ${error.message}`);
    }
  }

  /**
   * Generate a greeting based on PDF content
   * @param {string} pdfContent - PDF text content
   * @returns {Promise<string>} - Greeting message
   */
  async generateGreeting(pdfContent) {
    const summary = pdfContent.substring(0, 500);
    
    const prompt = `Based on this document summary, create a brief, friendly greeting (1-2 sentences):
${summary}

Greeting:`;

    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            { role: 'user', content: prompt }
          ],
          max_tokens: 50,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      // Fallback to default greeting
      return 'Hello! Thank you for calling. How can I help you today?';
    }
  }
}

export const aiService = new AIService();

