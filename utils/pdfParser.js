/**
 * PDF Parser Utility
 * Extracts text content from PDF files
 */

// pdf-parse uses CommonJS, so we need to import it differently
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParseModule = require('pdf-parse');
// pdf-parse exports an object, the class is in PDFParse property
const PDFParse = pdfParseModule.PDFParse;

class PDFParser {
  /**
   * Parse PDF buffer and extract text
   * @param {Buffer} pdfBuffer - PDF file buffer
   * @returns {Promise<Object>} - Parsed PDF data with text content
   */
  async parsePDF(pdfBuffer) {
    try {
      // Create PDFParse instance with buffer
      const pdfInstance = new PDFParse({ data: pdfBuffer });
      
      // Get text content
      const textData = await pdfInstance.getText();
      
      // Get info/metadata
      const infoData = await pdfInstance.getInfo();
      
      return {
        text: textData.text,
        numPages: textData.total,
        info: infoData.info,
        metadata: infoData.metadata,
        textLength: textData.text.length
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

