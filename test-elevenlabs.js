/**
 * Test ElevenLabs TTS Integration
 * Usage: node test-elevenlabs.js
 * 
 * यह script ElevenLabs API connection test करती है
 */

import { ttsService } from './utils/ttsService.js';
import { audioConverter } from './utils/audioConverter.js';
import dotenv from 'dotenv';

dotenv.config();

async function testElevenLabs() {
  console.log('\n🧪 Testing ElevenLabs TTS Integration...\n');

  // Check environment variables
  console.log('📋 Configuration Check:');
  console.log(`   TTS Provider: ${process.env.TTS_PROVIDER || 'not set (default: openai)'}`);
  console.log(`   ElevenLabs API Key: ${process.env.ELEVENLABS_API_KEY ? '✅ Set' : '❌ Not Set'}`);
  console.log(`   ElevenLabs Voice ID: ${process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL (default)'}`);
  console.log(`   Greeting Text: ${process.env.GREETING_TEXT || 'not set'}\n`);

  // Validate configuration
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error('❌ Error: ELEVENLABS_API_KEY not set in environment variables!');
    console.error('\n📝 Please add to .env file:');
    console.error('   ELEVENLABS_API_KEY=your_api_key_here');
    console.error('   TTS_PROVIDER=elevenlabs');
    process.exit(1);
  }

  if (process.env.TTS_PROVIDER?.toLowerCase() !== 'elevenlabs') {
    console.warn('⚠️  Warning: TTS_PROVIDER is not set to "elevenlabs"');
    console.warn('   Current value:', process.env.TTS_PROVIDER || 'not set');
    console.warn('   Please set TTS_PROVIDER=elevenlabs in .env file\n');
  }

  // Test text
  const testText = process.env.GREETING_TEXT || 'Hello! This is a test of ElevenLabs text to speech.';

  try {
    console.log('🎙️ Step 1: Testing TTS Synthesis...');
    console.log(`   Text: "${testText}"`);
    console.log(`   Provider: ${ttsService.provider}`);
    
    const startTime = Date.now();
    const audioBuffer = await ttsService.synthesize(testText);
    const duration = Date.now() - startTime;

    console.log(`✅ TTS Synthesis Successful!`);
    console.log(`   Audio Size: ${audioBuffer.length} bytes`);
    console.log(`   Duration: ${duration}ms\n`);

    console.log('🔄 Step 2: Testing Audio Conversion to PCM...');
    const pcmStartTime = Date.now();
    const pcmBuffer = await audioConverter.convertToPCM(audioBuffer);
    const pcmDuration = Date.now() - pcmStartTime;

    console.log(`✅ Audio Conversion Successful!`);
    console.log(`   PCM Size: ${pcmBuffer.length} bytes`);
    console.log(`   Duration: ${pcmDuration}ms`);
    console.log(`   Format: 16-bit, 8kHz, mono PCM\n`);

    // Calculate audio duration
    const sampleRate = 8000; // 8kHz
    const bytesPerSample = 2; // 16-bit = 2 bytes
    const audioDurationSeconds = pcmBuffer.length / (sampleRate * bytesPerSample);
    console.log(`📊 Audio Statistics:`);
    console.log(`   Estimated Duration: ${audioDurationSeconds.toFixed(2)} seconds`);
    console.log(`   Sample Rate: ${sampleRate} Hz`);
    console.log(`   Bit Depth: 16-bit`);
    console.log(`   Channels: Mono (1)`);

    console.log('\n✅ All tests passed! ElevenLabs integration is working correctly.');
    console.log('\n💡 Next Steps:');
    console.log('   1. Make sure server is running: npm start');
    console.log('   2. Send a test call: node send-call.js +919324606985');
    console.log('   3. Check server logs to see greeting being sent\n');

  } catch (error) {
    console.error('\n❌ Test Failed!');
    console.error(`   Error: ${error.message}`);
    
    if (error.message.includes('ELEVENLABS_API_KEY')) {
      console.error('\n📝 Solution:');
      console.error('   1. Get API key from https://www.elevenlabs.io');
      console.error('   2. Add to .env file: ELEVENLABS_API_KEY=your_key');
      console.error('   3. Add to .env file: TTS_PROVIDER=elevenlabs');
    } else if (error.message.includes('ffmpeg')) {
      console.error('\n📝 Solution:');
      console.error('   Install ffmpeg:');
      console.error('   - Windows: choco install ffmpeg');
      console.error('   - macOS: brew install ffmpeg');
      console.error('   - Linux: apt-get install ffmpeg');
    } else {
      console.error('\n📝 Check:');
      console.error('   - Internet connection');
      console.error('   - ElevenLabs API key is valid');
      console.error('   - ElevenLabs account has credits');
    }
    
    process.exit(1);
  }
}

// Run test
testElevenLabs();


