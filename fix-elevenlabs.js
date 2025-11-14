/**
 * Fix ElevenLabs API Issues
 * This script helps diagnose and fix ElevenLabs API problems
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';

async function diagnoseElevenLabs() {
  console.log('\n🔍 Diagnosing ElevenLabs API Issue...\n');
  
  if (!API_KEY) {
    console.error('❌ ELEVENLABS_API_KEY not found in .env file');
    return;
  }

  console.log('📋 Configuration:');
  console.log(`   API Key: ${API_KEY.substring(0, 20)}...${API_KEY.substring(API_KEY.length - 10)}`);
  console.log(`   Voice ID: ${VOICE_ID}\n`);

  // Test 1: Check API key validity by getting user info
  console.log('🧪 Test 1: Checking API Key Validity...');
  try {
    const userResponse = await axios.get('https://api.elevenlabs.io/v1/user', {
      headers: {
        'xi-api-key': API_KEY
      }
    });
    console.log('✅ API Key is valid!');
    console.log(`   User: ${userResponse.data.first_name || 'Unknown'}`);
    console.log(`   Subscription: ${userResponse.data.subscription?.tier || 'Free'}\n`);
  } catch (error) {
    console.error('❌ API Key is INVALID or expired!');
    console.error(`   Error: ${error.response?.data?.detail?.message || error.message}`);
    console.error('\n💡 Solution: Generate a new API key from https://www.elevenlabs.io\n');
    return;
  }

  // Test 2: List available voices
  console.log('🧪 Test 2: Checking Available Voices...');
  try {
    const voicesResponse = await axios.get('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': API_KEY
      }
    });
    
    const voices = voicesResponse.data.voices || [];
    console.log(`✅ Found ${voices.length} available voices\n`);
    
    // Check if current voice ID exists
    const currentVoice = voices.find(v => v.voice_id === VOICE_ID);
    if (currentVoice) {
      console.log(`✅ Voice ID "${VOICE_ID}" is available!`);
      console.log(`   Name: ${currentVoice.name}`);
    } else {
      console.log(`❌ Voice ID "${VOICE_ID}" is NOT available in your account!`);
      console.log('\n📋 Available Voices:');
      voices.slice(0, 5).forEach(voice => {
        console.log(`   - ${voice.name} (ID: ${voice.voice_id})`);
      });
      console.log('\n💡 Solution: Use one of the available voice IDs from above\n');
    }
  } catch (error) {
    console.error('❌ Error fetching voices:', error.response?.data || error.message);
  }

  // Test 3: Try TTS with current voice
  console.log('\n🧪 Test 3: Testing TTS with Current Voice...');
  try {
    const ttsResponse = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text: 'Test',
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
          'xi-api-key': API_KEY
        },
        responseType: 'arraybuffer',
        validateStatus: () => true // Don't throw on error
      }
    );

    if (ttsResponse.status === 200) {
      console.log('✅ TTS Test Successful!');
      console.log(`   Audio Size: ${ttsResponse.data.byteLength} bytes\n`);
    } else {
      console.error(`❌ TTS Test Failed (Status: ${ttsResponse.status})`);
      const errorData = JSON.parse(Buffer.from(ttsResponse.data).toString());
      console.error(`   Error: ${errorData.detail?.message || JSON.stringify(errorData)}`);
      
      if (errorData.detail?.status === 'missing_permissions') {
        console.error('\n💡 Solution: This voice is not available with your API key.');
        console.error('   Try using a default voice like: EXAVITQu4vr4xnSDxMaL');
      }
    }
  } catch (error) {
    console.error('❌ TTS Test Error:', error.message);
    if (error.response) {
      const errorData = error.response.data;
      if (Buffer.isBuffer(errorData)) {
        try {
          const parsed = JSON.parse(errorData.toString());
          console.error(`   Details: ${parsed.detail?.message || JSON.stringify(parsed)}`);
        } catch (e) {
          console.error(`   Raw Error: ${errorData.toString().substring(0, 200)}`);
        }
      }
    }
  }

  // Recommendations
  console.log('\n📝 Recommendations:');
  console.log('1. If API key is invalid: Generate new key from ElevenLabs dashboard');
  console.log('2. If voice not available: Use default voice EXAVITQu4vr4xnSDxMaL');
  console.log('3. Check account credits: Free tier has limited characters');
  console.log('4. Verify voice ID: Use voices from your account only\n');
}

diagnoseElevenLabs();


