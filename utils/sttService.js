/**
 * Speech-to-Text Service
 * Converts audio to text using OpenAI Whisper API
 */

import axios from 'axios';
import dotenv from 'dotenv';
import FormData from 'form-data';

dotenv.config();

class STTService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
  }

  /**
   * Convert audio buffer to text
   * @param {Buffer} audioBuffer - PCM audio buffer (16-bit, 8kHz, mono)
   * @returns {Promise<string>} - Transcribed text
   */
  async transcribe(audioBuffer) {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    try {
      // Convert PCM to WAV format for OpenAI Whisper
      const wavBuffer = this.pcmToWav(audioBuffer);

      const formData = new FormData();
      // Create a readable stream from buffer
      const audioStream = Readable.from(wavBuffer);
      formData.append('file', audioStream, {
        filename: 'audio.wav',
        contentType: 'audio/wav',
        knownLength: wavBuffer.length
      });
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');

      const response = await axios.post(
        `${this.baseURL}/audio/transcriptions`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            ...formData.getHeaders()
          }
        }
      );

      return response.data.text.trim();
    } catch (error) {
      console.error('STT error:', error.response?.data || error.message);
      throw new Error(`Speech-to-text failed: ${error.message}`);
    }
  }

  /**
   * Convert PCM buffer to WAV format
   * @param {Buffer} pcmBuffer - PCM audio buffer
   * @returns {Buffer} - WAV format buffer
   */
  pcmToWav(pcmBuffer) {
    const sampleRate = 8000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * bitsPerSample / 8;
    const blockAlign = numChannels * bitsPerSample / 8;
    const dataSize = pcmBuffer.length;
    const fileSize = 36 + dataSize;

    const wavBuffer = Buffer.alloc(44 + dataSize);
    
    // WAV header
    wavBuffer.write('RIFF', 0);
    wavBuffer.writeUInt32LE(fileSize, 4);
    wavBuffer.write('WAVE', 8);
    wavBuffer.write('fmt ', 12);
    wavBuffer.writeUInt32LE(16, 16); // fmt chunk size
    wavBuffer.writeUInt16LE(1, 20); // audio format (PCM)
    wavBuffer.writeUInt16LE(numChannels, 22);
    wavBuffer.writeUInt32LE(sampleRate, 24);
    wavBuffer.writeUInt32LE(byteRate, 28);
    wavBuffer.writeUInt16LE(blockAlign, 32);
    wavBuffer.writeUInt16LE(bitsPerSample, 34);
    wavBuffer.write('data', 36);
    wavBuffer.writeUInt32LE(dataSize, 40);
    
    // Copy PCM data
    pcmBuffer.copy(wavBuffer, 44);

    return wavBuffer;
  }
}

export const sttService = new STTService();

