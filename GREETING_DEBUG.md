# 🔍 Greeting Debug Guide

## ❌ Problem

Call connect हो रही है लेकिन greeting सुनाई नहीं दे रही।

---

## ✅ Diagnostic Steps

### Step 1: Server Logs Check करें

Call send करने के बाद, server logs में ये check करें:

#### A. Webhook Received?
```
📞 Voicebot connect webhook received
   Method: GET
   CallSid: xxxxx
```

#### B. WebSocket Connected?
```
🔌 WebSocket connection established for Call: xxxxx
```

#### C. Stream SID Received?
```
✅ Stream SID captured: xxxxx
```

#### D. Greeting Synthesis Started?
```
🎙️ Starting greeting synthesis...
   Step 1: Calling TTS API...
```

#### E. TTS Complete?
```
✅ TTS synthesis complete: XXXX bytes
```

#### F. Audio Conversion Complete?
```
✅ Audio converted to PCM: XXXX bytes
```

#### G. Audio Streaming?
```
📤 Streaming X chunks to Exotel
```

#### H. Errors?
```
❌ Error in greeting synthesis/streaming: ...
```

---

### Step 2: Common Issues & Fixes

#### Issue 1: Webhook Not Received

**Symptoms:**
- Server logs में "Voicebot connect webhook received" नहीं दिख रहा

**Fix:**
- Exotel Dashboard में webhook URL verify करें
- ngrok running है या नहीं check करें
- Webhook URL format: `https://your-ngrok-url/api/v1/exotel/voice/connect`

---

#### Issue 2: TTS API Error

**Symptoms:**
- "TTS synthesis complete" नहीं दिख रहा
- "TTS error" या "ElevenLabs TTS failed" दिख रहा

**Fix:**
- `.env` file में `ELEVENLABS_API_KEY` verify करें
- ElevenLabs API key valid है या नहीं check करें
- TTS_PROVIDER=elevenlabs set है या नहीं check करें

---

#### Issue 3: Audio Conversion Failed

**Symptoms:**
- "Audio converted to PCM" नहीं दिख रहा
- "ffmpeg not found" या "Audio conversion failed" error

**Fix:**
- FFmpeg installed है या नहीं: `ffmpeg -version`
- FFmpeg PATH में है या नहीं check करें

---

#### Issue 4: WebSocket Not Ready

**Symptoms:**
- "WebSocket not ready" error
- "WebSocket closed during processing" error

**Fix:**
- Server running है या नहीं check करें
- ngrok URL सही है या नहीं verify करें
- Exotel webhook URL सही है या नहीं check करें

---

#### Issue 5: Stream SID Not Received

**Symptoms:**
- "Waiting for stream_sid" message
- "Stream SID captured" नहीं दिख रहा

**Fix:**
- Call properly connect हो रही है या नहीं check करें
- Exotel Voicebot Applet properly configured है या नहीं verify करें

---

## 🧪 Test Commands

### 1. Check FFmpeg:
```powershell
ffmpeg -version
```

### 2. Check Server Running:
```powershell
curl http://localhost:3000/health
```

### 3. Check ngrok Running:
```powershell
curl http://localhost:4040/api/tunnels
```

### 4. Test TTS (Manual):
```javascript
// test-tts.js
import { ttsService } from './utils/ttsService.js';
import { audioConverter } from './utils/audioConverter.js';

async function test() {
  try {
    console.log('Testing TTS...');
    const audio = await ttsService.synthesize('Hello, this is a test.');
    console.log('✅ TTS:', audio.length, 'bytes');
    
    console.log('Converting to PCM...');
    const pcm = await audioConverter.convertToPCM(audio);
    console.log('✅ PCM:', pcm.length, 'bytes');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
```

Run:
```powershell
node test-tts.js
```

---

## 📋 Checklist

- [ ] Server running (`npm start`)
- [ ] ngrok running (`.\ngrok.exe http 3000`)
- [ ] Exotel webhook URL set (Dashboard में)
- [ ] FFmpeg installed (`ffmpeg -version`)
- [ ] ELEVENLABS_API_KEY set (`.env` file में)
- [ ] TTS_PROVIDER=elevenlabs set (`.env` file में)
- [ ] Server logs में webhook received
- [ ] Server logs में WebSocket connected
- [ ] Server logs में stream SID captured
- [ ] Server logs में greeting synthesis started
- [ ] Server logs में TTS complete
- [ ] Server logs में audio conversion complete
- [ ] Server logs में audio streaming

---

## 🔧 Quick Fixes

### Fix 1: Restart Everything

```powershell
# 1. Stop server (Ctrl+C)
# 2. Stop ngrok (Ctrl+C)
# 3. Start ngrok:
.\ngrok.exe http 3000

# 4. Start server (new terminal):
npm start

# 5. Test call again
```

### Fix 2: Check Environment Variables

```powershell
# .env file check करें:
Get-Content .env | Select-String "ELEVENLABS|TTS_PROVIDER"
```

### Fix 3: Test TTS Manually

```powershell
# test-tts.js file create करें (ऊपर देखें)
node test-tts.js
```

---

## 📞 Next Steps

1. **Server logs share करें** - Call send करने के बाद की logs
2. **Errors identify करें** - ऊपर दिए गए symptoms से match करें
3. **Fix apply करें** - Corresponding fix use करें
4. **Test again** - Call send करके verify करें

---

**Server logs share करें ताकि exact issue identify कर सकें! 🔍**

