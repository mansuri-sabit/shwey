/**
 * Test TTS and Audio Conversion
 * Run: node test-tts.js
 */

import { ttsService } from './utils/ttsService.js';
import { audioConverter } from './utils/audioConverter.js';
import dotenv from 'dotenv';

dotenv.config();

async function testTTS() {
  console.log('🧪 Testing TTS and Audio Conversion...\n');
  
  try {
    // Test 1: TTS Synthesis
    console.log('Step 1: Testing TTS synthesis...');
    const testText = 'Hello, this is a test message.';
    const audioBuffer = await ttsService.synthesize(testText);
    console.log(`✅ TTS synthesis successful: ${audioBuffer.length} bytes\n`);
    
    // Test 2: Audio Conversion
    console.log('Step 2: Testing audio conversion to PCM...');
    const pcmBuffer = await audioConverter.convertToPCM(audioBuffer);
    console.log(`✅ Audio conversion successful: ${pcmBuffer.length} bytes\n`);
    
    console.log('✅ All tests passed! TTS and audio conversion are working.\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('   Error details:', error);
    
    if (error.message.includes('ffmpeg')) {
      console.error('\n💡 Fix: Install FFmpeg');
      console.error('   Windows: choco install ffmpeg -y');
    }
    
    if (error.message.includes('ELEVENLABS')) {
      console.error('\n💡 Fix: Set ELEVENLABS_API_KEY in .env file');
    }
    
    if (error.message.includes('OPENAI')) {
      console.error('\n💡 Fix: Set OPENAI_API_KEY in .env file');
    }
    
    process.exit(1);
  }
}

testTTS();

