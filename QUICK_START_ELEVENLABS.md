# 🚀 Quick Start: ElevenLabs Integration

## ⚡ Fast Setup (5 Minutes)

### Step 1: ElevenLabs API Key लें
1. https://www.elevenlabs.io पर sign up करें
2. Dashboard → Profile → API Keys
3. "Create API Key" click करें
4. API Key copy करें

### Step 2: `.env` File बनाएं

Project root में `.env` file बनाएं:

```env
TTS_PROVIDER=elevenlabs
ELEVENLABS_API_KEY=your_api_key_here
GREETING_TEXT=Hello! Thank you for calling. How can I help you today?
```

**Important:** अपनी Exotel credentials भी `.env` में add करें (अगर पहले से नहीं हैं)।

### Step 3: Server Start करें

```powershell
npm start
```

### Step 4: Test Call Send करें

```powershell
node send-call.js +919324606985
```

## ✅ Done!

अगर सब कुछ सही है, तो:
- Call connect होगी
- ElevenLabs से greeting generate होगी
- User को greeting सुनाई देगी

## 🔍 Check Logs

Server logs में आपको दिखना चाहिए:
```
🎙️ TTS synthesis using elevenlabs: { textLength: 45, voice: 'EXAVITQu4vr4xnSDxMaL' }
✅ TTS synthesis complete: xxxx bytes
```

## ❌ अगर Error आए

1. **"ELEVENLABS_API_KEY not configured"**
   → `.env` file में API key add करें और server restart करें

2. **"ElevenLabs TTS failed"**
   → API key सही है या नहीं check करें
   → ElevenLabs account में credits check करें

3. **Greeting नहीं आ रही**
   → Server logs check करें
   → `GREETING_TEXT` environment variable set है या नहीं

## 📖 Detailed Guide

पूरी detailed guide के लिए `ELEVENLABS_SETUP_GUIDE.md` देखें।


