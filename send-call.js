/**
 * Simple script to send a call via Exotel
 * Usage: node send-call.js <phone_number>
 * Example: node send-call.js +919324606985
 */

import { ExotelVoicebotCaller } from './index.js';
import dotenv from 'dotenv';

dotenv.config();

// Get phone number from command line argument
const phoneNumber = process.argv[2];

if (!phoneNumber) {
  console.error('❌ Error: Phone number is required!');
  console.error('\nUsage: node send-call.js <phone_number>');
  console.error('Example: node send-call.js +919324606985');
  process.exit(1);
}

// Validate phone number format
if (!phoneNumber.startsWith('+')) {
  console.error('❌ Error: Phone number must start with + (e.g., +919324606985)');
  process.exit(1);
}

// Configuration from environment variables
const config = {
  apiKey: process.env.EXOTEL_API_KEY,
  apiToken: process.env.EXOTEL_API_TOKEN,
  sid: process.env.EXOTEL_SID,
  subdomain: process.env.EXOTEL_SUBDOMAIN || 'api.exotel.com',
  appId: process.env.EXOTEL_APP_ID,
  callerId: process.env.EXOTEL_CALLER_ID
};

// Validate configuration
if (!config.apiKey || !config.apiToken || !config.sid || !config.appId || !config.callerId) {
  console.error('❌ Error: Missing Exotel configuration!');
  console.error('\nPlease set the following environment variables:');
  console.error('   - EXOTEL_API_KEY');
  console.error('   - EXOTEL_API_TOKEN');
  console.error('   - EXOTEL_SID');
  console.error('   - EXOTEL_APP_ID');
  console.error('   - EXOTEL_CALLER_ID');
  console.error('\nOptional:');
  console.error('   - EXOTEL_SUBDOMAIN (default: api.exotel.com)');
  process.exit(1);
}

// Send the call
async function sendCall() {
  try {
    console.log(`\n📞 Initiating call to ${phoneNumber}...`);
    console.log(`   Using Exotel Voicebot Applet: ${config.appId}`);
    console.log(`   Caller ID: ${config.callerId}`);
    console.log(`   Server URL: https://kkbk-xjhf.onrender.com/api/v1/exotel/voice/connect\n`);
    
    const caller = new ExotelVoicebotCaller(config);
    const result = await caller.makeCall(phoneNumber);
    
    if (result.success) {
      console.log(`\n✅ Call successfully initiated to ${phoneNumber}`);
      console.log(`   Call SID: ${result.callSid}`);
      console.log(`\n📋 Call Details:`, JSON.stringify(result.data, null, 2));
    } else {
      console.error(`\n❌ Failed to initiate call to ${phoneNumber}`);
      console.error(`   Error:`, result.error);
      if (result.status) {
        console.error(`   Status: ${result.status}`);
      }
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

sendCall();

