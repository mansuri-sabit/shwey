/**
 * TTS Service Utility
 * Supports multiple TTS providers: OpenAI, Google, or simple fallback
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class TTSService {
  constructor() {
    this.provider = process.env.TTS_PROVIDER || 'openai'; // 'openai', 'google', 'elevenlabs', 'deepgram'
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.googleApiKey = process.env.GOOGLE_TTS_API_KEY;
    this.elevenlabsApiKey = process.env.ELEVENLABS_API_KEY;
    this.deepgramApiKey = process.env.DEEPGRAM_API_KEY;
  }

  /**
   * Synthesize text to speech
   * Returns audio buffer (MP3 or WAV format depending on provider)
   * 
   * @param {string} text - Text to synthesize
   * @param {string} voice - Voice ID (provider-specific)
   * @returns {Promise<Buffer>} - Audio buffer
   */
  async synthesize(text, voice = null) {
    console.log(`🎙️ TTS synthesis using ${this.provider}:`, { textLength: text.length, voice });

    // Check if provider is configured
    if (this.provider.toLowerCase() === 'openai' && !this.openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured. Please set it in environment variables.');
    }
    if (this.provider.toLowerCase() === 'google' && !this.googleApiKey) {
      throw new Error('GOOGLE_TTS_API_KEY not configured. Please set it in environment variables.');
    }
    if (this.provider.toLowerCase() === 'elevenlabs' && !this.elevenlabsApiKey) {
      throw new Error('ELEVENLABS_API_KEY not configured. Please set it in environment variables.');
    }
    if (this.provider.toLowerCase() === 'deepgram' && !this.deepgramApiKey) {
      throw new Error('DEEPGRAM_API_KEY not configured. Please set it in environment variables.');
    }

    switch (this.provider.toLowerCase()) {
      case 'openai':
        return await this.synthesizeOpenAI(text, voice);
      case 'google':
        return await this.synthesizeGoogle(text, voice);
      case 'elevenlabs':
        return await this.synthesizeElevenLabs(text, voice);
      case 'deepgram':
        return await this.synthesizeDeepgram(text, voice);
      default:
        throw new Error(`Unsupported TTS provider: ${this.provider}. Supported: openai, google, elevenlabs, deepgram`);
    }
  }

  /**
   * OpenAI TTS (text-to-speech-1 model)
   * Returns MP3 format
   */
  async synthesizeOpenAI(text, voice = 'alloy') {
    if (!this.openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    const selectedVoice = voice && validVoices.includes(voice) ? voice : 'alloy';

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/audio/speech',
        {
          model: 'tts-1', // Fast model, use 'tts-1-hd' for higher quality
          input: text,
          voice: selectedVoice,
          response_format: 'mp3',
          speed: 1.0
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      return Buffer.from(response.data);
    } catch (error) {
      console.error('OpenAI TTS error:', error.response?.data || error.message);
      throw new Error(`OpenAI TTS failed: ${error.message}`);
    }
  }

  /**
   * Google Cloud Text-to-Speech
   * Returns MP3 format
   */
  async synthesizeGoogle(text, voice = 'en-US-Standard-B') {
    if (!this.googleApiKey) {
      throw new Error('GOOGLE_TTS_API_KEY not configured');
    }

    try {
      const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.googleApiKey}`,
        {
          input: { text },
          voice: {
            languageCode: 'en-US',
            name: voice,
            ssmlGender: 'NEUTRAL'
          },
          audioConfig: {
            audioEncoding: 'MP3',
            sampleRateHertz: 24000
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Google returns base64 encoded audio
      return Buffer.from(response.data.audioContent, 'base64');
    } catch (error) {
      console.error('Google TTS error:', error.response?.data || error.message);
      throw new Error(`Google TTS failed: ${error.message}`);
    }
  }

  /**
   * ElevenLabs TTS
   * Returns MP3 format
   */
  async synthesizeElevenLabs(text, voice = 'EXAVITQu4vr4xnSDxMaL') {
    if (!this.elevenlabsApiKey) {
      throw new Error('ELEVENLABS_API_KEY not configured');
    }

    try {
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
        {
          text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.elevenlabsApiKey
          },
          responseType: 'arraybuffer'
        }
      );

      return Buffer.from(response.data);
    } catch (error) {
      console.error('ElevenLabs TTS error:', error.response?.data || error.message);
      throw new Error(`ElevenLabs TTS failed: ${error.message}`);
    }
  }

  /**
   * Deepgram TTS (Aura)
   * Returns PCM format (already 8kHz, 16-bit, mono)
   */
  async synthesizeDeepgram(text, voice = 'aura-asteria-en') {
    if (!this.deepgramApiKey) {
      throw new Error('DEEPGRAM_API_KEY not configured');
    }

    try {
      // Deepgram uses WebSocket for streaming, but we'll use HTTP API for simplicity
      // Note: Deepgram's HTTP API might not be available, this is a placeholder
      // For production, use the Deepgram SDK with WebSocket streaming
      throw new Error('Deepgram HTTP API not implemented. Use Deepgram SDK for WebSocket streaming.');
    } catch (error) {
      console.error('Deepgram TTS error:', error.message);
      throw error;
    }
  }
}

export const ttsService = new TTSService();

