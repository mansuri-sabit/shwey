# 🚀 Quick Voice Fix - Call पर Voice कैसे आएगी

## ❌ Current Problem

Call send हो रही है, लेकिन voice नहीं आ रही।

## ✅ Solution (3 Simple Steps)

### Step 1: FFmpeg Install करें (CRITICAL)

FFmpeg audio conversion के लिए **required** है।

#### Windows (Easiest - Chocolatey के साथ):

```powershell
# PowerShell को Administrator के रूप में खोलें
# Right-click → "Run as Administrator"

# Chocolatey install करें (अगर नहीं है):
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# FFmpeg install करें:
choco install ffmpeg -y

# Verify:
ffmpeg -version
```

#### या Manual Installation:

1. Download: https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip
2. Extract to `C:\ffmpeg`
3. System Properties → Environment Variables → PATH में add करें: `C:\ffmpeg\bin`
4. Terminal restart करें
5. Verify: `ffmpeg -version`

---

### Step 2: .env File Check करें

आपका `.env` file में ये होना चाहिए:

```env
# TTS Provider (ElevenLabs या OpenAI)
TTS_PROVIDER=elevenlabs  # ✅ Already set

# ElevenLabs API Key
ELEVENLABS_API_KEY=sk_af6c2894a563cb2d82e82af46eae5d8c420ef5ae2d738f4d  # ✅ Already set
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL  # ✅ Already set

# OpenAI (STT और AI के लिए)
OPENAI_API_KEY=sk-proj-...  # ✅ Already set
```

**✅ आपका configuration सही है!** ElevenLabs TTS use हो रहा है।

---

### Step 3: Server Restart करें

```powershell
# Current server stop करें (Ctrl+C)
# फिर start करें:
npm start
```

---

## 🧪 Test करें

### 1. FFmpeg Verify:
```powershell
ffmpeg -version
```
Output दिखना चाहिए (version info)

### 2. Server Logs Check करें:
Call send करने के बाद, server logs में देखें:

```
✅ TTS synthesis complete: XXXX bytes
✅ Audio converted to PCM: XXXX bytes
📤 Streaming X chunks to Exotel
```

अगर errors दिख रहे हैं, तो logs share करें।

---

## 🔍 Troubleshooting

### Error: "ffmpeg not found"
**Fix:** FFmpeg install करें (Step 1)

### Error: "ELEVENLABS_API_KEY not configured"
**Fix:** `.env` file में `ELEVENLABS_API_KEY` check करें

### Error: "Audio conversion failed"
**Fix:** FFmpeg install करें और PATH में add करें

### Call पर voice नहीं आ रही
**Check:**
1. Server logs में errors देखें
2. FFmpeg installed है या नहीं verify करें
3. WebSocket connection successful है या नहीं check करें

---

## 📋 Complete Flow

```
1. Call connects
   ↓
2. Greeting synthesis (ElevenLabs TTS)
   ↓
3. Audio conversion (FFmpeg: MP3 → PCM)
   ↓
4. Stream to Exotel (WebSocket)
   ↓
5. User hears greeting! 🎉

6. User asks question
   ↓
7. STT (OpenAI Whisper: Audio → Text)
   ↓
8. AI Answer (OpenAI GPT: Question → Answer)
   ↓
9. TTS (ElevenLabs: Text → Audio)
   ↓
10. Audio conversion (FFmpeg: MP3 → PCM)
   ↓
11. Stream to Exotel
   ↓
12. User hears answer! 🎉
```

---

## ✅ Final Checklist

- [ ] FFmpeg installed (`ffmpeg -version` works)
- [ ] `.env` file में `TTS_PROVIDER=elevenlabs` set है
- [ ] `.env` file में `ELEVENLABS_API_KEY` set है
- [ ] Server restarted है
- [ ] Test call send करके verify करें

---

## 🚀 Quick Commands

```powershell
# 1. FFmpeg install (Administrator PowerShell)
choco install ffmpeg -y

# 2. Verify
ffmpeg -version

# 3. Server restart
npm start

# 4. Test call
# Browser में जाकर call send करें
```

---

**FFmpeg install करने के बाद, call पर voice आनी चाहिए! 🎉**

