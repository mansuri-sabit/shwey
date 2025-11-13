/**
 * Express Server for Exotel Voicebot Caller
 * Deploy on Render as a Web Service
 */

import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import { ExotelVoicebotCaller } from './index.js';
import dotenv from 'dotenv';
import { ttsService } from './utils/ttsService.js';
import { audioConverter } from './utils/audioConverter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server for WebSocket
const server = http.createServer(app);

// WebSocket Server for Voicebot
// Supports multiple paths for flexibility
const wss = new WebSocketServer({ 
  server,
  verifyClient: verifyWebSocketClient  // Authentication middleware
});

// Session management
const activeSessions = new Map(); // callId -> session data

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Exotel Voicebot Caller',
    message: 'Service is running. Use POST /call to initiate a call.'
  });
});

// Health check for Render
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

/**
 * Make a call endpoint
 * POST /call
 * Body: { "to": "+9324606985", "from": "optional" }
 */
app.post('/call', async (req, res) => {
  try {
    const { to, from } = req.body;
    
    // Default number if not provided
    const targetNumber = to || '+9324606985';
    
    // Validate configuration
    const config = {
      apiKey: process.env.EXOTEL_API_KEY,
      apiToken: process.env.EXOTEL_API_TOKEN,
      sid: process.env.EXOTEL_SID,
      subdomain: process.env.EXOTEL_SUBDOMAIN || 'api.exotel.com',
      appId: process.env.EXOTEL_APP_ID,
      callerId: process.env.EXOTEL_CALLER_ID
    };

    // Check required config
    if (!config.apiKey || !config.apiToken || !config.sid || !config.appId || !config.callerId) {
      return res.status(400).json({
        success: false,
        error: 'Missing Exotel configuration. Please set environment variables.',
        required: ['EXOTEL_API_KEY', 'EXOTEL_API_TOKEN', 'EXOTEL_SID', 'EXOTEL_APP_ID', 'EXOTEL_CALLER_ID']
      });
    }

    // Validate phone number
    if (!targetNumber || !targetNumber.startsWith('+')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number. Must start with + (e.g., +919324606985)'
      });
    }

    // Ensure To number is different from CallerId
    if (targetNumber.replace(/[^0-9]/g, '') === config.callerId.replace(/[^0-9]/g, '')) {
      return res.status(400).json({
        success: false,
        error: 'Target number cannot be same as CallerId. Please provide a different number to call.'
      });
    }

    // Initialize caller and make call
    // Note: For tracking, you can pass a callLogId as third parameter (customField)
    const caller = new ExotelVoicebotCaller(config);
    const callLogId = req.body.callLogId || null; // Optional: for call tracking
    const result = await caller.makeCall(targetNumber, from, callLogId);

    if (result.success) {
      res.json({
        success: true,
        message: `Call initiated successfully to ${targetNumber}`,
        callSid: result.callSid,
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: `Failed to initiate call to ${targetNumber}`,
        error: result.error,
        status: result.status
      });
    }
  } catch (error) {
    console.error('Error in /call endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Voicebot Connect Endpoint - Entry point for Exotel Voicebot Applet
 * Matches backendRef pattern: /api/v1/exotel/voice/connect
 * 
 * Exotel calls this when a call is initiated (both inbound and outbound)
 * Returns WebSocket URL for real-time audio connection
 * 
 * GET/POST /voicebot/connect or /api/v1/exotel/voice/connect
 * Query/Body params: CallSid, CallFrom, CallTo, Direction, CustomField, etc.
 */
app.get('/voicebot/connect', handleVoicebotConnect);
app.post('/voicebot/connect', handleVoicebotConnect);
app.get('/api/v1/exotel/voice/connect', handleVoicebotConnect);
app.post('/api/v1/exotel/voice/connect', handleVoicebotConnect);

function handleVoicebotConnect(req, res) {
  try {
    // Parse webhook data (Exotel sends as query params for GET, body for POST)
    const webhookData = req.method === 'GET' ? req.query : req.body;
    
    const callSid = webhookData.CallSid || webhookData.call_id || `call_${Date.now()}`;
    const callFrom = webhookData.CallFrom || webhookData.from;
    const callTo = webhookData.CallTo || webhookData.to;
    const direction = webhookData.Direction || webhookData.direction || 'unknown';
    const customField = webhookData.CustomField || webhookData.customField; // Contains callLogId for outbound calls
    
    console.log(`📞 Voicebot connect webhook received`);
    console.log(`   Method: ${req.method}`);
    console.log(`   CallSid: ${callSid}`);
    console.log(`   From: ${callFrom}`);
    console.log(`   To: ${callTo}`);
    console.log(`   Direction: ${direction}`);
    if (customField) {
      console.log(`   CustomField: ${customField} (likely callLogId for outbound)`);
    }
    
    // Determine base URL for WebSocket
    const baseUrl = process.env.WEBHOOK_BASE_URL || 
                    process.env.RENDER_EXTERNAL_URL || 
                    `https://kkbk-xjhf.onrender.com`;
    
    // Convert to WebSocket URL (matches backendRef pattern)
    const wsProtocol = baseUrl.startsWith('https') ? 'wss' : 'ws';
    const wsHost = baseUrl.replace(/^https?:\/\//, '');
    
    // Use CustomField (callLogId) if available, otherwise use CallSid
    const callIdentifier = customField || callSid;
    // Exotel WebSocket endpoint - supports both /voicebot/ws and /voice-stream paths
    const wsPath = process.env.WS_PATH || '/voicebot/ws';
    const websocketUrl = `${wsProtocol}://${wsHost}${wsPath}?call_id=${callIdentifier}`;
    
    // Return JSON response with WebSocket URL (matches backendRef pattern)
    const response = {
      url: websocketUrl  // Exotel expects "url" key for dynamic endpoints
    };
    
    console.log(`   Returning WebSocket URL: ${websocketUrl}`);
    console.log(`   Response:`, JSON.stringify(response, null, 2));
    
    res.set('Content-Type', 'application/json');
    res.status(200).json(response);
  } catch (error) {
    console.error('❌ Error handling voicebot connect:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Verify WebSocket client (Authentication)
 * Exotel Voicebot connections to /voicebot/ws do NOT require Authorization header
 * Other WebSocket clients can be protected with Authorization if EXOTEL_WS_TOKEN is set
 */
function verifyWebSocketClient(info) {
  const { req } = info;
  
  // Parse the request URL to get the path
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  
  // Determine the expected WebSocket path for Exotel Voicebot
  const voicebotWsPath = process.env.WS_PATH || '/voicebot/ws';
  const isExotelVoicebot = path === voicebotWsPath;
  
  // Exotel Voicebot connections do NOT require Authorization header
  if (isExotelVoicebot) {
    console.log(`🔓 Exotel Voicebot WebSocket connection (path: ${path}) - Authentication bypassed`);
    return true; // Accept connection without auth
  }
  
  // For other WebSocket paths, apply authentication if token is configured
  const expectedToken = process.env.EXOTEL_WS_TOKEN;
  const authHeader = req.headers.authorization;
  
  if (expectedToken) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn(`⚠️  WebSocket connection rejected: Missing Authorization header (path: ${path})`);
      return false;
    }
    
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    if (token !== expectedToken) {
      console.warn(`⚠️  WebSocket connection rejected: Invalid token (path: ${path})`);
      return false;
    }
    
    console.log(`✅ WebSocket authentication successful (path: ${path})`);
  }
  
  return true; // Accept connection
}

/**
 * Exotel WebSocket Message Format
 * Based on backendRef implementation
 * 
 * @typedef {Object} ExotelWebSocketMessage
 * @property {'start'|'media'|'stop'|'mark'} event - Event type
 * @property {string} [stream_sid] - Stream identifier (snake_case)
 * @property {string} [sequence_number] - Sequence number
 * @property {string} [streamSid] - Stream identifier (camelCase, backward compat)
 * @property {string} [callSid] - Call identifier
 * @property {Object} [mark] - Mark event data
 * @property {string} mark.name - Mark name
 * @property {Object} [media] - Media event data
 * @property {'inbound'|'outbound'} [media.track] - Audio track direction
 * @property {string} media.chunk - Chunk identifier
 * @property {string} media.timestamp - Timestamp
 * @property {string} media.payload - Base64 encoded PCM audio (16-bit, 8kHz, mono)
 * @property {Object} [stop] - Stop event data
 * @property {string} stop.call_sid - Call identifier
 * @property {string} stop.account_sid - Account identifier
 * @property {string} stop.reason - Stop reason
 */

/**
 * Voice Session Data
 */
class VoiceSession {
  constructor(callId, streamSid = null) {
    this.callId = callId;
    this.streamSid = streamSid;
    this.sequenceNumber = 0;
    this.connectedAt = new Date();
    this.lastActivity = new Date();
    this.audioBuffer = [];
    this.isActive = true;
    this.greetingSent = false; // Track if greeting has been sent
  }
}

/**
 * WebSocket Server for Voicebot
 * Handles Exotel's streaming protocol
 */
wss.on('connection', (ws, request) => {
  // Parse query parameters from URL
  const url = new URL(request.url, `http://${request.headers.host}`);
  const path = url.pathname;
  const callId = url.searchParams.get('call_id') || 
                 url.searchParams.get('callSid') || 
                 url.searchParams.get('callLogId') ||
                 `call_${Date.now()}`;
  
  const streamSid = url.searchParams.get('stream_sid') || null;
  
  console.log(`📞 New Exotel WebSocket connection`);
  console.log(`   Path: ${path}`);
  console.log(`   Call ID: ${callId}`);
  console.log(`   Stream SID: ${streamSid || 'pending'}`);
  console.log(`   Remote: ${request.socket.remoteAddress}`);
  console.log(`   User-Agent: ${request.headers['user-agent'] || 'unknown'}`);
  console.log(`   Origin: ${request.headers['origin'] || 'none'}`);
  
  // Create session
  const session = new VoiceSession(callId, streamSid);
  activeSessions.set(callId, session);
  
  // Handle incoming messages from Exotel
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      session.lastActivity = new Date();
      
      const eventType = message.event || 'unknown';
      console.log(`📨 [${callId}] Received Exotel event: ${eventType}`);
      
      // Log event details for debugging (first few events only to avoid spam)
      if (session.sequenceNumber < 5) {
        if (eventType === 'start') {
          console.log(`   Event details:`, JSON.stringify({
            stream_sid: message.stream_sid || message.streamSid,
            callSid: message.callSid
          }, null, 2));
        } else if (eventType === 'media') {
          const hasPayload = !!(message.media && message.media.payload);
          console.log(`   Event details:`, JSON.stringify({
            stream_sid: message.stream_sid || message.streamSid,
            sequence_number: message.sequence_number,
            has_audio_payload: hasPayload,
            track: message.media?.track
          }, null, 2));
        } else if (eventType === 'stop') {
          console.log(`   Event details:`, JSON.stringify({
            reason: message.stop?.reason,
            call_sid: message.stop?.call_sid
          }, null, 2));
        }
      }
      
      // Handle different event types
      switch (eventType) {
        case 'start':
          handleStartEvent(ws, session, message);
          break;
        case 'media':
          handleMediaEvent(ws, session, message);
          break;
        case 'stop':
          handleStopEvent(ws, session, message);
          break;
        case 'mark':
          handleMarkEvent(ws, session, message);
          break;
        default:
          console.warn(`⚠️  [${callId}] Unknown event type: ${eventType}`);
          console.warn(`   Full message:`, JSON.stringify(message, null, 2));
      }
    } catch (error) {
      console.error(`❌ [${callId}] Error parsing WebSocket message:`, error);
      console.error(`   Error message: ${error.message}`);
      console.error(`   Raw data (first 200 chars): ${data.toString().substring(0, 200)}`);
    }
  });

  // Handle connection close
  ws.on('close', (code, reason) => {
    console.log(`🔌 [${callId}] WebSocket connection closed`);
    console.log(`   Close code: ${code}`);
    console.log(`   Close reason: ${reason.toString() || 'none'}`);
    console.log(`   Session duration: ${Math.round((new Date() - session.connectedAt) / 1000)}s`);
    cleanupSession(callId);
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error(`❌ [${callId}] WebSocket error:`, error);
    console.error(`   Error message: ${error.message}`);
    console.error(`   Error stack: ${error.stack}`);
    cleanupSession(callId);
  });
  
  // Store WebSocket in session for sending audio
  session.ws = ws;
  
  // Don't send greeting immediately - wait for start event or first media event
  // Exotel needs to send stream_sid first before we can send audio
  console.log(`⏳ [${callId}] Waiting for Exotel to send stream_sid before sending greeting...`);
});

/**
 * Handle "start" event from Exotel
 * Note: Voicebot may not send "start" event, stream_sid comes in first "media" event
 */
function handleStartEvent(ws, session, message) {
  console.log(`🎬 Start event received for Call ${session.callId}`);
  console.log(`   Full message:`, JSON.stringify(message, null, 2));
  
  // Store stream_sid if provided
  if (message.stream_sid || message.streamSid) {
    session.streamSid = message.stream_sid || message.streamSid;
    console.log(`   ✅ Stream SID captured: ${session.streamSid}`);
  }
  
  // Store call_sid if provided
  if (message.callSid) {
    console.log(`   Call SID: ${message.callSid}`);
  }
  
  // Session is now active
  session.isActive = true;
  
  // Send greeting now that we have stream_sid
  if (!session.greetingSent && session.streamSid) {
    console.log(`   🚀 Triggering greeting synthesis with stream_sid: ${session.streamSid}`);
    synthesizeAndStreamGreeting(ws, session).catch(error => {
      console.error(`❌ Error synthesizing greeting for Call ${session.callId}:`, error);
    });
  } else if (!session.streamSid) {
    console.log(`   ⚠️  Start event received but no stream_sid found`);
  }
}

/**
 * Handle "media" event from Exotel
 * Contains base64-encoded PCM audio (16-bit, 8kHz, mono, little-endian)
 */
function handleMediaEvent(ws, session, message) {
  if (!message.media || !message.media.payload) {
    console.warn(`⚠️  Media event received but no payload for Call ${session.callId}`);
    return;
  }
  
  // Store stream_sid from first media event (Voicebot doesn't always send "start")
  if (!session.streamSid && (message.stream_sid || message.streamSid)) {
    session.streamSid = message.stream_sid || message.streamSid;
    console.log(`   ✅ Stream SID captured from media event: ${session.streamSid}`);
    
    // If greeting hasn't been sent yet and we now have stream_sid, send it
    if (!session.greetingSent) {
      console.log(`   🚀 Triggering greeting synthesis with stream_sid: ${session.streamSid}`);
      synthesizeAndStreamGreeting(ws, session).catch(error => {
        console.error(`❌ Error synthesizing greeting for Call ${session.callId}:`, error);
      });
    }
  }
  
  // Skip outbound track (audio we're sending)
  if (message.media.track === 'outbound') {
    return; // This is our own audio being echoed back
  }
  
  // Decode base64 audio payload
  try {
    const audioChunk = Buffer.from(message.media.payload, 'base64');
    
    // Log audio chunk info (first few chunks only to avoid spam)
    if (session.sequenceNumber < 3) {
      console.log(`🎤 Audio chunk received: ${audioChunk.length} bytes (PCM 16-bit, 8kHz)`);
    }
    
    // Accumulate audio for processing
    session.audioBuffer.push(audioChunk);
    
    // TODO: Process audio here
    // Options:
    // 1. Send to Speech-to-Text service (Deepgram, Google, etc.)
    // 2. Send to AI for processing
    // 3. Save to file for later processing
    
    // Example: Echo back (for testing - remove in production)
    // sendAudioChunkToExotel(ws, session, audioChunk);
    
  } catch (error) {
    console.error(`❌ Error decoding audio payload for Call ${session.callId}:`, error);
  }
}

/**
 * Handle "stop" event from Exotel
 * Call is ending, cleanup resources
 */
function handleStopEvent(ws, session, message) {
  console.log(`🛑 Stop event received for Call ${session.callId}`);
  
  if (message.stop) {
    console.log(`   Reason: ${message.stop.reason}`);
    console.log(`   Call SID: ${message.stop.call_sid}`);
  }
  
  // Mark session as inactive
  session.isActive = false;
  
  // Process any remaining audio in buffer
  if (session.audioBuffer.length > 0) {
    console.log(`   Processing ${session.audioBuffer.length} remaining audio chunks`);
    // TODO: Process final audio chunks
  }
  
  // Cleanup session
  cleanupSession(session.callId);
  
  // Close WebSocket gracefully
  ws.close(1000, 'Call ended');
}

/**
 * Handle "mark" event from Exotel
 * Used for synchronization markers
 */
function handleMarkEvent(ws, session, message) {
  if (message.mark) {
    console.log(`📍 Mark event received: ${message.mark.name}`);
    // Handle synchronization markers if needed
  }
}

/**
 * Send audio chunk to Exotel
 * Format: 16-bit PCM, 8kHz, mono, base64 encoded
 * Chunk size: 3200 bytes (100ms at 8kHz) or 320 bytes (20ms)
 * 
 * Message format as per Exotel specification:
 * {
 *   "event": "media",
 *   "stream_sid": "<streamSid>",
 *   "sequence_number": "<incrementing number>",
 *   "media": {
 *     "payload": "<base64 chunk>"
 *   }
 * }
 */
function sendAudioChunkToExotel(ws, session, audioChunk) {
  if (!session.isActive || ws.readyState !== 1) {
    console.warn(`⚠️  [${session.callId}] Cannot send chunk - Active: ${session.isActive}, WS State: ${ws.readyState}`);
    return; // Session closed or WebSocket not ready
  }
  
  try {
    const payload = audioChunk.toString('base64');
    const streamSid = session.streamSid || session.callId;
    
    if (!streamSid) {
      console.error(`❌ [${session.callId}] Cannot send chunk - stream_sid is missing!`);
      return;
    }
    
    // Format as per Exotel specification
    const message = {
      event: 'media',
      stream_sid: streamSid,
      sequence_number: session.sequenceNumber.toString(),
      media: {
        payload: payload
      }
    };
    
    ws.send(JSON.stringify(message));
    
    // Log first few chunks for debugging
    if (session.sequenceNumber < 3) {
      console.log(`   📤 [${session.callId}] Sent chunk ${session.sequenceNumber}: ${audioChunk.length} bytes (payload: ${payload.substring(0, 20)}...)`);
    }
    
    session.sequenceNumber++;
    
  } catch (error) {
    console.error(`❌ [${session.callId}] Error sending audio chunk to Exotel:`, error);
    console.error(`   Error details:`, error.message);
  }
}

/**
 * Send audio buffer to Exotel in chunks
 * Splits large audio into 3200-byte chunks (100ms at 8kHz, 16-bit)
 */
function sendAudioToExotel(ws, session, audioBuffer) {
  if (!session.isActive || ws.readyState !== 1) {
    return;
  }
  
  const chunkSize = 3200; // 100ms chunks (3200 bytes = 1600 samples × 2 bytes)
  const totalChunks = Math.ceil(audioBuffer.length / chunkSize);
  
  console.log(`📤 Sending ${totalChunks} audio chunks to Exotel (${audioBuffer.length} bytes total)`);
  
  for (let i = 0; i < audioBuffer.length; i += chunkSize) {
    // Check WebSocket state before each chunk
    if (ws.readyState !== 1) {
      console.warn(`⚠️  WebSocket closed, stopping audio transmission`);
      break;
    }
    
    const chunk = audioBuffer.slice(i, Math.min(i + chunkSize, audioBuffer.length));
    sendAudioChunkToExotel(ws, session, chunk);
    
    // Small delay to prevent overwhelming (optional, can remove for lower latency)
    // await new Promise(resolve => setTimeout(resolve, 10));
  }
}

/**
 * Synthesize greeting text and stream to Exotel
 * Called immediately when WebSocket opens
 */
async function synthesizeAndStreamGreeting(ws, session) {
  // Prevent duplicate greetings
  if (session.greetingSent) {
    console.log(`⚠️  Greeting already sent for Call ${session.callId}, skipping`);
    return;
  }

  // Wait for stream_sid if we don't have it yet
  // We'll retry when stream_sid is available
  if (!session.streamSid) {
    console.log(`⏳ Waiting for stream_sid before sending greeting for Call ${session.callId}`);
    return;
  }

  // Check WebSocket is ready
  if (ws.readyState !== 1) {
    console.log(`⚠️  WebSocket not ready (state: ${ws.readyState}) for Call ${session.callId}, waiting...`);
    return;
  }

  // Mark as sent to prevent duplicates (do this early to prevent race conditions)
  session.greetingSent = true;

  try {
    // Get greeting text from environment or use default
    const greetingText = process.env.GREETING_TEXT || 
                        'Hello! Thank you for calling. How can I help you today?';
    
    console.log(`🎙️ [${session.callId}] Starting greeting synthesis...`);
    console.log(`   Text: "${greetingText}"`);
    console.log(`   Stream SID: ${session.streamSid}`);
    console.log(`   WebSocket State: ${ws.readyState}`);

    // Step 1: Call TTS API
    console.log(`   Step 1: Calling TTS API...`);
    const audioBuffer = await ttsService.synthesize(greetingText);
    console.log(`✅ [${session.callId}] TTS synthesis complete: ${audioBuffer.length} bytes`);

    // Step 2: Convert to PCM (16-bit, 8kHz, mono)
    console.log(`   Step 2: Converting audio to PCM...`);
    const pcmBuffer = await audioConverter.convertToPCM(audioBuffer);
    console.log(`✅ [${session.callId}] Audio converted to PCM: ${pcmBuffer.length} bytes`);

    // Verify WebSocket is still ready before streaming
    if (ws.readyState !== 1) {
      throw new Error(`WebSocket closed during processing (state: ${ws.readyState})`);
    }

    // Step 3: Stream PCM to Exotel in 3200-byte chunks
    console.log(`   Step 3: Streaming audio to Exotel...`);
    await streamPCMToExotel(ws, session, pcmBuffer);

    // Step 4: Send mark event to signal completion
    console.log(`   Step 4: Sending mark event...`);
    sendMarkEvent(ws, session, 'greeting_done');
    
    console.log(`✅ [${session.callId}] Greeting audio streamed successfully!`);
  } catch (error) {
    console.error(`❌ [${session.callId}] Error in greeting synthesis/streaming:`, error);
    console.error(`   Error message: ${error.message}`);
    console.error(`   Error stack: ${error.stack}`);
    
    // Reset flag so we can retry if needed
    session.greetingSent = false;
    
    // Don't throw - log and continue (call can still proceed)
    // throw error;
  }
}

/**
 * Stream PCM audio to Exotel in 3200-byte chunks
 */
async function streamPCMToExotel(ws, session, pcmBuffer) {
  if (!session.isActive || ws.readyState !== 1) {
    throw new Error(`WebSocket not ready for streaming. Active: ${session.isActive}, State: ${ws.readyState}`);
  }

  if (!pcmBuffer || pcmBuffer.length === 0) {
    throw new Error('PCM buffer is empty');
  }

  const chunkSize = 3200; // 100ms chunks at 8kHz, 16-bit, mono
  const chunks = audioConverter.chunkPCM(pcmBuffer, chunkSize);
  
  console.log(`📤 [${session.callId}] Streaming ${chunks.length} chunks (${pcmBuffer.length} bytes total) to Exotel`);
  console.log(`   Stream SID: ${session.streamSid}`);
  console.log(`   Starting sequence number: ${session.sequenceNumber}`);

  let chunksSent = 0;
  // Send chunks sequentially
  for (let i = 0; i < chunks.length; i++) {
    // Check WebSocket state before each chunk
    if (ws.readyState !== 1) {
      console.warn(`⚠️  [${session.callId}] WebSocket closed (state: ${ws.readyState}), stopping audio transmission at chunk ${i}/${chunks.length}`);
      break;
    }

    const chunk = chunks[i];
    sendAudioChunkToExotel(ws, session, chunk);
    chunksSent++;
    
    // Small delay to prevent overwhelming (optional, can remove for lower latency)
    // For 100ms chunks, we could wait ~100ms, but streaming immediately is fine
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  console.log(`✅ [${session.callId}] Sent ${chunksSent}/${chunks.length} chunks. Final sequence number: ${session.sequenceNumber}`);
}

/**
 * Send mark event to Exotel
 */
function sendMarkEvent(ws, session, markName) {
  if (!session.isActive || ws.readyState !== 1) {
    return;
  }

  try {
    const streamSid = session.streamSid || session.callId;
    
    const message = {
      event: 'mark',
      stream_sid: streamSid,
      mark: {
        name: markName
      }
    };
    
    ws.send(JSON.stringify(message));
    console.log(`📍 Mark event sent: ${markName} for Call ${session.callId}`);
  } catch (error) {
    console.error(`❌ Error sending mark event for Call ${session.callId}:`, error);
  }
}

/**
 * Cleanup session resources
 */
function cleanupSession(callId) {
  const session = activeSessions.get(callId);
  if (session) {
    console.log(`🧹 Cleaning up session for Call ${callId}`);
    session.isActive = false;
    session.audioBuffer = []; // Clear buffer
    activeSessions.delete(callId);
  }
}

/**
 * Get active sessions (for monitoring/debugging)
 */
app.get('/voicebot/sessions', (req, res) => {
  const sessions = Array.from(activeSessions.entries()).map(([callId, session]) => ({
    callId: session.callId,
    streamSid: session.streamSid,
    connectedAt: session.connectedAt,
    lastActivity: session.lastActivity,
    sequenceNumber: session.sequenceNumber,
    isActive: session.isActive,
    audioChunksBuffered: session.audioBuffer.length
  }));
  
  res.json({
    total: sessions.length,
    sessions
  });
});

/**
 * Get call status (if needed in future)
 * GET /call/:callSid
 */
app.get('/call/:callSid', async (req, res) => {
  res.json({
    message: 'Call status endpoint - implement as needed',
    callSid: req.params.callSid
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Exotel Voicebot Caller Server running on port ${PORT}`);
  console.log(`📞 POST /call to initiate a call`);
  console.log(`❤️  GET /health for health check`);
  console.log(`🔌 WebSocket Server: ws://localhost:${PORT}/voicebot/ws`);
  console.log(`📡 Voicebot Connect: http://localhost:${PORT}/api/v1/exotel/voice/connect`);
  console.log(`📊 Active Sessions: http://localhost:${PORT}/voicebot/sessions`);
  
  const voicebotWsPath = process.env.WS_PATH || '/voicebot/ws';
  if (process.env.EXOTEL_WS_TOKEN) {
    console.log(`🔐 WebSocket authentication: ENABLED`);
    console.log(`   Exotel Voicebot path (${voicebotWsPath}): Authentication BYPASSED`);
    console.log(`   Other WebSocket paths: Authentication REQUIRED (Bearer token)`);
  } else {
    console.log(`⚠️  WebSocket authentication: DISABLED (set EXOTEL_WS_TOKEN to enable for non-Voicebot paths)`);
    console.log(`   Exotel Voicebot path (${voicebotWsPath}): Always accessible (no auth required)`);
  }
  
  console.log(`\n💡 For local testing with ngrok:`);
  console.log(`   ngrok http ${PORT}`);
  console.log(`   Then use the ngrok HTTPS URL as WEBHOOK_BASE_URL`);
});

export default app;

