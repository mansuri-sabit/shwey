/**
 * Audio Conversion Utility
 * Converts MP3/WAV to 16-bit, 8kHz, mono PCM format (Exotel's preferred format)
 * 
 * Uses ffmpeg if available, otherwise falls back to Node.js libraries
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFileSync, unlinkSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';

const execAsync = promisify(exec);

class AudioConverter {
  constructor() {
    this.useFfmpeg = null; // Will be checked on first use
    this.tempDir = tmpdir();
  }

  /**
   * Check if ffmpeg is available
   */
  async checkFfmpeg() {
    if (this.useFfmpeg !== null) {
      return this.useFfmpeg;
    }

    try {
      await execAsync('ffmpeg -version');
      this.useFfmpeg = true;
      console.log('✅ ffmpeg found - will use for audio conversion');
      return true;
    } catch (error) {
      this.useFfmpeg = false;
      console.warn('⚠️  ffmpeg not found - will use Node.js fallback (may be slower)');
      return false;
    }
  }

  /**
   * Convert audio buffer to 16-bit, 8kHz, mono PCM
   * 
   * @param {Buffer} audioBuffer - Input audio (MP3, WAV, etc.)
   * @param {string} inputFormat - Input format ('mp3', 'wav', 'auto')
   * @returns {Promise<Buffer>} - PCM audio buffer (16-bit, 8kHz, mono)
   */
  async convertToPCM(audioBuffer, inputFormat = 'auto') {
    const hasFfmpeg = await this.checkFfmpeg();

    if (hasFfmpeg) {
      return await this.convertWithFfmpeg(audioBuffer, inputFormat);
    } else {
      // Fallback: Try to use Node.js libraries
      // For now, return error - user should install ffmpeg
      throw new Error(
        'ffmpeg not found. Please install ffmpeg:\n' +
        '  Windows: choco install ffmpeg\n' +
        '  macOS: brew install ffmpeg\n' +
        '  Linux: apt-get install ffmpeg\n' +
        '\nOr set FFMPEG_PATH environment variable to ffmpeg executable path.'
      );
    }
  }

  /**
   * Convert using ffmpeg (recommended)
   */
  async convertWithFfmpeg(audioBuffer, inputFormat = 'auto') {
    const inputFile = join(this.tempDir, `input_${randomBytes(8).toString('hex')}.${inputFormat === 'auto' ? 'mp3' : inputFormat}`);
    const outputFile = join(this.tempDir, `output_${randomBytes(8).toString('hex')}.pcm`);

    try {
      // Write input file
      writeFileSync(inputFile, audioBuffer);

      // Convert to PCM: 16-bit, 8kHz, mono
      // -f s16le: signed 16-bit little-endian PCM
      // -ar 8000: sample rate 8kHz
      // -ac 1: mono (1 channel)
      // -y: overwrite output file if exists
      // Note: ffmpeg auto-detects input format from file extension/content
      const ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
      const command = `${ffmpegPath} -i "${inputFile}" -f s16le -ar 8000 -ac 1 "${outputFile}" -y`;

      await execAsync(command);

      // Read output file
      const pcmBuffer = readFileSync(outputFile);

      // Cleanup
      try {
        unlinkSync(inputFile);
        unlinkSync(outputFile);
      } catch (cleanupError) {
        // Ignore cleanup errors
        console.warn('Warning: Could not clean up temp files:', cleanupError.message);
      }

      console.log(`✅ Audio converted: ${audioBuffer.length} bytes → ${pcmBuffer.length} bytes PCM (16-bit, 8kHz, mono)`);
      return pcmBuffer;
    } catch (error) {
      // Cleanup on error
      try {
        unlinkSync(inputFile);
        unlinkSync(outputFile);
      } catch (cleanupError) {
        // Ignore
      }

      console.error('❌ ffmpeg conversion error:', error.message);
      throw new Error(`Audio conversion failed: ${error.message}`);
    }
  }

  /**
   * Chunk PCM buffer into 3200-byte chunks (~100ms at 8kHz)
   * 
   * @param {Buffer} pcmBuffer - PCM audio buffer
   * @param {number} chunkSize - Chunk size in bytes (default: 3200)
   * @returns {Buffer[]} - Array of chunk buffers
   */
  chunkPCM(pcmBuffer, chunkSize = 3200) {
    const chunks = [];
    for (let i = 0; i < pcmBuffer.length; i += chunkSize) {
      chunks.push(pcmBuffer.slice(i, Math.min(i + chunkSize, pcmBuffer.length)));
    }
    return chunks;
  }
}

export const audioConverter = new AudioConverter();

