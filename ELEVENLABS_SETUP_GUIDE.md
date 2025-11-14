# ElevenLabs API Integration Guide - Step by Step

## 📋 Overview
यह guide आपको ElevenLabs API को integrate करके greeting send करने में मदद करेगी।

## 🎯 Step 1: ElevenLabs Account बनाएं और API Key लें

### 1.1 ElevenLabs Account बनाएं
1. https://www.elevenlabs.io पर जाएं
2. "Sign Up" पर click करें
3. Account बनाएं (Free tier available)

### 1.2 API Key Generate करें
1. Login करने के बाद, Profile/Settings में जाएं
2. "API Keys" section में जाएं
3. "Create API Key" button click करें
4. API Key को copy करें (यह सिर्फ एक बार दिखेगी, save कर लें!)

**Example API Key format:** `abc123def456ghi789jkl012mno345pqr678`

### 1.3 Voice ID लें (Optional - Default voice use होगी)
1. ElevenLabs Dashboard में "Voices" section में जाएं
2. अपनी पसंद की voice select करें
3. Voice ID copy करें (जैसे: `EXAVITQu4vr4xnSDxMaL`)

**Popular Voice IDs:**
- `EXAVITQu4vr4xnSDxMaL` - Default (Bella)
- `21m00Tcm4TlvDq8ikWAM` - Rachel
- `AZnzlk1XvdvUeBnXmlld` - Domi
- `ErXwobaYiN019PkySvjV` - Antoni

---

## 🔧 Step 2: Environment Variables Setup करें

### 2.1 `.env` File बनाएं या Update करें

Project root में `.env` file बनाएं (अगर नहीं है):

```env
# TTS Provider - ElevenLabs use करने के लिए
TTS_PROVIDER=elevenlabs

# ElevenLabs API Key (Step 1.2 से)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Optional: Voice ID (अगर default voice नहीं चाहिए)
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL

# Greeting Text (जो greeting send होगी)
GREETING_TEXT=Hello! Thank you for calling. How can I help you today?

# Exotel Configuration (पहले से set होनी चाहिए)
EXOTEL_API_KEY=your_exotel_api_key
EXOTEL_API_TOKEN=your_exotel_api_token
EXOTEL_SID=your_exotel_sid
EXOTEL_APP_ID=your_app_id
EXOTEL_CALLER_ID=your_caller_id
```

### 2.2 Windows PowerShell में `.env` File बनाना

```powershell
# Project directory में जाएं
cd D:\KKBK-main

# .env file बनाएं (Notepad से)
notepad .env
```

फिर ऊपर दिए गए content को paste करें और अपनी values fill करें।

---

## 🎙️ Step 3: Code Verify करें

### 3.1 TTS Service Check करें

`utils/ttsService.js` file में ElevenLabs implementation already है:
- ✅ `synthesizeElevenLabs()` function implemented है
- ✅ Default voice: `EXAVITQu4vr4xnSDxMaL`
- ✅ Model: `eleven_turbo_v2_5` (fast और high quality)

### 3.2 Greeting Flow Check करें

`server.js` में greeting flow already setup है:
- ✅ `synthesizeAndStreamGreeting()` function call होता है
- ✅ TTS service automatically use होता है based on `TTS_PROVIDER`
- ✅ Audio convert होकर Exotel को stream होता है

---

## 🚀 Step 4: Test करें

### 4.1 Environment Variables Verify करें

```powershell
# PowerShell में check करें
node -e "require('dotenv').config(); console.log('TTS Provider:', process.env.TTS_PROVIDER); console.log('ElevenLabs Key:', process.env.ELEVENLABS_API_KEY ? 'Set' : 'Not Set');"
```

### 4.2 Server Start करें

```powershell
npm start
```

या development mode में:

```powershell
npm run dev
```

### 4.3 Test Call Send करें

```powershell
node send-call.js +919324606985
```

### 4.4 Logs Check करें

Server logs में आपको दिखना चाहिए:
```
🎙️ TTS synthesis using elevenlabs: { textLength: 45, voice: 'EXAVITQu4vr4xnSDxMaL' }
✅ [call_xxx] TTS synthesis complete: xxxx bytes
✅ [call_xxx] Audio converted to PCM: xxxx bytes
📤 [call_xxx] Streaming x chunks to Exotel
✅ [call_xxx] Greeting audio streamed successfully!
```

---

## 🔍 Step 5: Troubleshooting

### Problem 1: "ELEVENLABS_API_KEY not configured"
**Solution:**
- `.env` file में `ELEVENLABS_API_KEY` set करें
- Server restart करें

### Problem 2: "ElevenLabs TTS failed"
**Solution:**
- API key सही है या नहीं check करें
- ElevenLabs account में credits/usage check करें
- Internet connection check करें

### Problem 3: Greeting नहीं आ रही
**Solution:**
- Server logs check करें
- `GREETING_TEXT` environment variable set है या नहीं
- WebSocket connection properly establish हो रहा है या नहीं

### Problem 4: Audio quality issue
**Solution:**
- Voice ID change करके try करें
- Model change करें (`eleven_turbo_v2_5` से `eleven_multilingual_v2`)

---

## 📝 Step 6: Custom Voice Settings (Optional)

अगर आप voice settings customize करना चाहते हैं, `utils/ttsService.js` में `synthesizeElevenLabs()` function update करें:

```javascript
voice_settings: {
  stability: 0.5,        // 0.0 - 1.0 (higher = more stable)
  similarity_boost: 0.75, // 0.0 - 1.0 (higher = more similar to original)
  style: 0.0,            // 0.0 - 1.0 (higher = more expressive)
  use_speaker_boost: true // Better voice clarity
}
```

---

## ✅ Verification Checklist

- [ ] ElevenLabs account बना लिया
- [ ] API key generate कर लिया
- [ ] `.env` file में `TTS_PROVIDER=elevenlabs` set किया
- [ ] `.env` file में `ELEVENLABS_API_KEY` set किया
- [ ] `.env` file में `GREETING_TEXT` set किया
- [ ] Server restart किया
- [ ] Test call send किया
- [ ] Logs में ElevenLabs TTS success message दिखा
- [ ] Call में greeting audio सुनी

---

## 🎉 Success!

अगर सब कुछ सही है, तो:
1. Call connect होगी
2. ElevenLabs से greeting audio generate होगी
3. Audio Exotel को stream होगी
4. User को greeting सुनाई देगी

---

## 📞 Support

अगर कोई problem है:
1. Server logs check करें
2. ElevenLabs dashboard में API usage check करें
3. Exotel dashboard में call logs check करें

---

**Note:** ElevenLabs free tier में limited characters/month होते हैं। Production में paid plan consider करें।


