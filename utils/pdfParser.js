/**
 * PDF Parser Utility
 * Extracts text content from PDF files
 */

// pdf-parse uses CommonJS, so we need to import it differently
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

class PDFParser {
  /**
   * Parse PDF buffer and extract text
   * @param {Buffer} pdfBuffer - PDF file buffer
   * @returns {Promise<Object>} - Parsed PDF data with text content
   */
  async parsePDF(pdfBuffer) {
    try {
      const data = await pdfParse(pdfBuffer);
      
      return {
        text: data.text,
        numPages: data.numpages,
        info: data.info,
        metadata: data.metadata,
        textLength: data.text.length
      };
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }

  /**
   * Extract text from PDF buffer
   * @param {Buffer} pdfBuffer - PDF file buffer
   * @returns {Promise<string>} - Extracted text content
   */
  async extractText(pdfBuffer) {
    const parsed = await this.parsePDF(pdfBuffer);
    return parsed.text;
  }

  /**
   * Clean and format extracted text
   * @param {string} text - Raw extracted text
   * @returns {string} - Cleaned text
   */
  cleanText(text) {
    // Remove excessive whitespace
    let cleaned = text.replace(/\s+/g, ' ');
    
    // Remove special characters but keep basic punctuation
    cleaned = cleaned.replace(/[^\w\s.,!?;:()\-'"]/g, '');
    
    // Trim
    cleaned = cleaned.trim();
    
    return cleaned;
  }
}

export const pdfParser = new PDFParser();

