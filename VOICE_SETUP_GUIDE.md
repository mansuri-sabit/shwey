# 🎙️ Voice Setup Guide - Call पर Voice कैसे आएगी

## 📋 Overview

Call पर voice आने के लिए ये components चाहिए:

1. **TTS (Text-to-Speech)** - Text को audio में convert करने के लिए
2. **STT (Speech-to-Text)** - User की voice को text में convert करने के लिए
3. **AI Service** - Questions के answers देने के लिए
4. **Audio Converter** - Audio को Exotel format (16-bit, 8kHz, mono PCM) में convert करने के लिए
5. **FFmpeg** - Audio conversion के लिए (required)

---

## 🔧 Step 1: TTS Provider Setup

### Option A: OpenAI TTS (Recommended - आसान)

**Advantages:**
- ✅ Same API key (OPENAI_API_KEY) use होगा
- ✅ Fast और reliable
- ✅ Good quality voices

**Setup:**
1. `.env` file में add करें:
```env
TTS_PROVIDER=openai
OPENAI_API_KEY=sk-proj-... (already set)
```

2. **Voices available:**
   - `alloy` (default)
   - `echo`
   - `fable`
   - `onyx`
   - `nova`
   - `shimmer`

---

### Option B: ElevenLabs TTS (Better quality, separate API key needed)

**Advantages:**
- ✅ Very natural voices
- ✅ Multiple languages

**Setup:**
1. ElevenLabs account बनाएं: https://elevenlabs.io
2. API key generate करें
3. `.env` file में add करें:
```env
TTS_PROVIDER=elevenlabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL  # Default voice
```

---

## 🔧 Step 2: FFmpeg Installation (CRITICAL)

FFmpeg audio conversion के लिए **required** है।

### Windows (PowerShell as Administrator):

```powershell
# Chocolatey use करें (अगर installed है)
choco install ffmpeg

# या direct download:
# https://ffmpeg.org/download.html
# Download करें और PATH में add करें
```

### Manual Installation (Windows):

1. Download FFmpeg: https://www.gyan.dev/ffmpeg/builds/
2. Extract to `C:\ffmpeg`
3. Add to PATH:
   - System Properties → Environment Variables
   - Add `C:\ffmpeg\bin` to PATH
4. Restart terminal और verify:
   ```powershell
   ffmpeg -version
   ```

### macOS:
```bash
brew install ffmpeg
```

### Linux:
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

---

## 🔧 Step 3: Environment Variables Check

`.env` file में ये variables होने चाहिए:

```env
# TTS Configuration
TTS_PROVIDER=openai  # या 'elevenlabs'

# OpenAI (TTS + STT + AI के लिए)
OPENAI_API_KEY=sk-proj-...

# ElevenLabs (अगर TTS_PROVIDER=elevenlabs है)
ELEVENLABS_API_KEY=your_key_here
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL

# Exotel Configuration (already set)
EXOTEL_API_KEY=...
EXOTEL_API_TOKEN=...
EXOTEL_SID=...
EXOTEL_APP_ID=...
EXOTEL_CALLER_ID=...
```

---

## 🔧 Step 4: Code Flow Verification

### Greeting Flow:
```
1. Call connects
   ↓
2. synthesizeAndStreamGreeting() called
   ↓
3. ttsService.synthesize(greetingText) → OpenAI/ElevenLabs API
   ↓
4. audioConverter.convertToPCM(audioBuffer) → FFmpeg conversion
   ↓
5. streamPCMToExotel(ws, session, pcmBuffer) → Send to Exotel
   ↓
6. User hears greeting! 🎉
```

### Question-Answer Flow:
```
1. User speaks
   ↓
2. handleMediaEvent() receives audio
   ↓
3. processUserSpeech() called
   ↓
4. sttService.transcribe(audio) → OpenAI Whisper API
   ↓
5. aiService.answerQuestion(question, pdfContent) → OpenAI GPT
   ↓
6. ttsService.synthesize(answer) → OpenAI/ElevenLabs TTS
   ↓
7. audioConverter.convertToPCM(audioBuffer) → FFmpeg conversion
   ↓
8. streamPCMToExotel(ws, session, pcmBuffer) → Send to Exotel
   ↓
9. User hears answer! 🎉
```

---

## 🧪 Step 5: Testing

### Test TTS:
```javascript
// Test file: test-tts.js
import { ttsService } from './utils/ttsService.js';
import { audioConverter } from './utils/audioConverter.js';
import { writeFileSync } from 'fs';

async function test() {
  try {
    console.log('Testing TTS...');
    const audio = await ttsService.synthesize('Hello, this is a test message.');
    console.log('✅ TTS successful:', audio.length, 'bytes');
    
    console.log('Converting to PCM...');
    const pcm = await audioConverter.convertToPCM(audio);
    console.log('✅ PCM conversion successful:', pcm.length, 'bytes');
    
    // Save to file for testing
    writeFileSync('test-output.pcm', pcm);
    console.log('✅ Saved to test-output.pcm');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
```

Run:
```bash
node test-tts.js
```

---

## 🐛 Troubleshooting

### Issue 1: "ffmpeg not found"
**Solution:** FFmpeg install करें (Step 2 देखें)

### Issue 2: "OPENAI_API_KEY not configured"
**Solution:** `.env` file में `OPENAI_API_KEY` set करें

### Issue 3: "TTS_PROVIDER mismatch"
**Solution:** 
- अगर `TTS_PROVIDER=openai` है, तो `OPENAI_API_KEY` चाहिए
- अगर `TTS_PROVIDER=elevenlabs` है, तो `ELEVENLABS_API_KEY` चाहिए

### Issue 4: "No voice on call"
**Check:**
1. Server logs में errors check करें
2. WebSocket connection verify करें
3. `stream_sid` received हो रहा है या नहीं
4. TTS API call successful है या नहीं

---

## 📝 Quick Fix Commands

### Change TTS Provider to OpenAI:
```powershell
# .env file edit करें
# TTS_PROVIDER=openai add करें
```

### Install FFmpeg (Windows):
```powershell
# Chocolatey के साथ
choco install ffmpeg

# Verify
ffmpeg -version
```

### Restart Server:
```powershell
# Stop current server
# Ctrl+C या process kill करें

# Start again
npm start
```

---

## ✅ Final Checklist

- [ ] FFmpeg installed और PATH में है
- [ ] `TTS_PROVIDER` set है (openai या elevenlabs)
- [ ] Corresponding API key set है
- [ ] Server restarted है
- [ ] Test call send करके verify करें

---

## 🚀 Next Steps

1. **FFmpeg install करें** (Step 2)
2. **TTS_PROVIDER set करें** (Step 1)
3. **Server restart करें**
4. **Test call send करें**
5. **Logs check करें** - errors देखें

---

**अगर सब कुछ setup है, तो call पर voice आनी चाहिए! 🎉**

