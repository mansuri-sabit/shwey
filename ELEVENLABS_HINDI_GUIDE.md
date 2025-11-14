# 🎙️ ElevenLabs API Integration - Hindi Guide

## 📖 Overview
यह guide आपको ElevenLabs API को integrate करके greeting send करने में step-by-step मदद करेगी।

---

## 🎯 Step 1: ElevenLabs Account और API Key Setup

### 1.1 Account बनाएं
1. Browser में https://www.elevenlabs.io खोलें
2. "Sign Up" button पर click करें
3. Email और password से account बनाएं
4. Email verify करें (अगर required हो)

### 1.2 API Key Generate करें
1. Login करने के बाद, top-right corner में profile icon पर click करें
2. "Profile" या "Settings" में जाएं
3. Left sidebar में "API Keys" option select करें
4. "Create API Key" button click करें
5. API Key name दें (जैसे: "Exotel Voicebot")
6. "Create" click करें
7. **Important:** API Key को immediately copy कर लें (यह सिर्फ एक बार दिखेगी!)

**API Key Format:** `abc123def456ghi789jkl012mno345pqr678` (लगभग 32 characters)

### 1.3 Voice ID (Optional)
अगर आप default voice के अलावा कोई और voice use करना चाहते हैं:

1. Dashboard में "Voices" section में जाएं
2. अपनी पसंद की voice select करें
3. Voice settings में Voice ID copy करें

**Popular Voices:**
- `EXAVITQu4vr4xnSDxMaL` - Bella (Default, Female)
- `21m00Tcm4TlvDq8ikWAM` - Rachel (Female)
- `AZnzlk1XvdvUeBnXmlld` - Domi (Female)
- `ErXwobaYiN019PkySvjV` - Antoni (Male)

---

## 🔧 Step 2: Project में Configuration Setup

### 2.1 `.env` File बनाएं

Project folder (`D:\KKBK-main`) में `.env` file बनाएं:

**Windows PowerShell में:**
```powershell
cd D:\KKBK-main
notepad .env
```

**`.env` file में यह content add करें:**

```env
# TTS Provider - ElevenLabs use करने के लिए
TTS_PROVIDER=elevenlabs

# ElevenLabs API Key (Step 1.2 से copy किया हुआ)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Optional: Voice ID (अगर default voice नहीं चाहिए)
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL

# Greeting Text (जो greeting call में play होगी)
GREETING_TEXT=Hello! Thank you for calling. How can I help you today?

# Exotel Configuration (पहले से set होनी चाहिए)
EXOTEL_API_KEY=your_exotel_api_key
EXOTEL_API_TOKEN=your_exotel_api_token
EXOTEL_SID=your_exotel_sid
EXOTEL_APP_ID=your_exotel_app_id
EXOTEL_CALLER_ID=your_exotel_caller_id
EXOTEL_SUBDOMAIN=api.exotel.com
```

**Important:**
- `your_elevenlabs_api_key_here` को अपनी actual API key से replace करें
- `your_exotel_*` values को अपनी Exotel credentials से replace करें
- File save करें

---

## ✅ Step 3: Configuration Test करें

### 3.1 Test Script Run करें

PowerShell में:

```powershell
node test-elevenlabs.js
```

**Expected Output:**
```
🧪 Testing ElevenLabs TTS Integration...

📋 Configuration Check:
   TTS Provider: elevenlabs
   ElevenLabs API Key: ✅ Set
   ElevenLabs Voice ID: EXAVITQu4vr4xnSDxMaL (default)
   Greeting Text: Hello! Thank you for calling...

🎙️ Step 1: Testing TTS Synthesis...
✅ TTS Synthesis Successful!
   Audio Size: xxxx bytes
   Duration: xxxms

🔄 Step 2: Testing Audio Conversion to PCM...
✅ Audio Conversion Successful!
   PCM Size: xxxx bytes

✅ All tests passed!
```

**अगर Error आए:**
- `ELEVENLABS_API_KEY not set` → `.env` file check करें
- `ElevenLabs TTS failed` → API key सही है या नहीं verify करें
- `ffmpeg not found` → ffmpeg install करें (नीचे देखें)

---

## 🚀 Step 4: Server Start करें

### 4.1 Server Run करें

```powershell
npm start
```

या development mode में (auto-restart):

```powershell
npm run dev
```

**Expected Output:**
```
🚀 Exotel Voicebot Caller Server running on port 3000
📞 POST /call to initiate a call
🔌 WebSocket Server: ws://localhost:3000/voicebot/ws
📡 Voicebot Connect: http://localhost:3000/api/v1/exotel/voice/connect
```

---

## 📞 Step 5: Test Call Send करें

### 5.1 Call Initiate करें

**नया terminal window खोलें** और:

```powershell
node send-call.js +919324606985
```

**Expected Output:**
```
📞 Initiating call to +919324606985...
   Using Exotel Voicebot Applet: 1116870
   Caller ID: 07948516111
   Server URL: https://kkbk-xjhf.onrender.com/api/v1/exotel/voice/connect

✅ Call successfully initiated to +919324606985
   Call SID: xxxxxx
```

### 5.2 Server Logs Check करें

Server terminal में आपको दिखना चाहिए:

```
📞 New Exotel WebSocket connection
   Call ID: call_xxxxx
   
📨 [call_xxxxx] Received Exotel event: start
   ✅ Stream SID captured: xxxxxx
   
🎙️ [call_xxxxx] Starting greeting synthesis...
   Text: "Hello! Thank you for calling. How can I help you today?"
   Step 1: Calling TTS API...
   
🎙️ TTS synthesis using elevenlabs: { textLength: 45, voice: 'EXAVITQu4vr4xnSDxMaL' }
✅ [call_xxxxx] TTS synthesis complete: xxxx bytes
   
   Step 2: Converting audio to PCM...
✅ [call_xxxxx] Audio converted to PCM: xxxx bytes
   
   Step 3: Streaming audio to Exotel...
📤 [call_xxxxx] Streaming x chunks to Exotel
✅ [call_xxxxx] Greeting audio streamed successfully!
```

---

## 🔍 Step 6: Verification

### ✅ Success Indicators:

1. **Call Connect हो गई**
   - Phone ring होगी
   - Call answer होगी

2. **Greeting Audio Generate हो गई**
   - Server logs में "TTS synthesis using elevenlabs" दिखेगा
   - "TTS synthesis complete" message आएगा

3. **Audio Stream हो गई**
   - "Streaming x chunks to Exotel" message आएगा
   - "Greeting audio streamed successfully" message आएगा

4. **User को Greeting सुनाई दी**
   - Phone call में ElevenLabs voice में greeting play होगी

---

## ❌ Troubleshooting

### Problem 1: "ELEVENLABS_API_KEY not configured"

**Solution:**
1. `.env` file check करें
2. `ELEVENLABS_API_KEY=your_actual_key` line सही है या नहीं
3. Server restart करें

### Problem 2: "ElevenLabs TTS failed"

**Possible Causes:**
- Invalid API key
- No credits in ElevenLabs account
- Internet connection issue

**Solution:**
1. ElevenLabs dashboard में API key verify करें
2. Account में credits/usage check करें
3. Internet connection check करें

### Problem 3: Greeting नहीं आ रही

**Solution:**
1. Server logs check करें
2. `GREETING_TEXT` environment variable set है या नहीं
3. WebSocket connection properly establish हो रहा है या नहीं
4. `stream_sid` receive हो रहा है या नहीं

### Problem 4: "ffmpeg not found"

**Solution - Windows:**
```powershell
# Chocolatey use करके
choco install ffmpeg

# या manually download करें
# https://ffmpeg.org/download.html
```

**Solution - Manual Install:**
1. https://ffmpeg.org/download.html से download करें
2. Extract करें
3. `.env` file में add करें:
   ```env
   FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe
   ```

---

## 🎛️ Advanced Configuration

### Custom Voice Settings

अगर आप voice quality customize करना चाहते हैं, `utils/ttsService.js` file में `synthesizeElevenLabs()` function में settings change करें:

```javascript
voice_settings: {
  stability: 0.5,        // 0.0 - 1.0 (higher = more stable voice)
  similarity_boost: 0.75, // 0.0 - 1.0 (higher = more similar to original)
  style: 0.0,            // 0.0 - 1.0 (higher = more expressive)
  use_speaker_boost: true // Better voice clarity
}
```

### Different Model Use करना

अगर आप different model use करना चाहते हैं:

```javascript
model_id: 'eleven_turbo_v2_5'  // Fast (default)
// या
model_id: 'eleven_multilingual_v2'  // Multilingual support
```

---

## 📊 Monitoring

### Server Logs में Check करें:

1. **TTS Provider:** `🎙️ TTS synthesis using elevenlabs`
2. **Voice ID:** Logs में voice ID दिखेगा
3. **Audio Size:** TTS synthesis complete के बाद bytes दिखेंगे
4. **Streaming:** Chunks की count दिखेगी

### ElevenLabs Dashboard में Check करें:

1. https://www.elevenlabs.io → Dashboard
2. "Usage" section में API calls check करें
3. "Characters Used" check करें

---

## ✅ Final Checklist

Setup complete करने से पहले verify करें:

- [ ] ElevenLabs account बना लिया
- [ ] API key generate कर लिया
- [ ] `.env` file में `TTS_PROVIDER=elevenlabs` set किया
- [ ] `.env` file में `ELEVENLABS_API_KEY` set किया
- [ ] `.env` file में `GREETING_TEXT` set किया
- [ ] `node test-elevenlabs.js` successfully run हुआ
- [ ] Server start हो गया
- [ ] Test call send की
- [ ] Server logs में ElevenLabs TTS success message दिखा
- [ ] Call में greeting audio सुनी

---

## 🎉 Success!

अगर सब कुछ सही है, तो:
1. ✅ Call automatically connect होगी
2. ✅ ElevenLabs से greeting audio generate होगी
3. ✅ Audio Exotel को stream होगी
4. ✅ User को high-quality greeting सुनाई देगी

---

## 📞 Support

अगर कोई problem है:

1. **Server Logs Check करें** - सबसे important
2. **ElevenLabs Dashboard** - API usage और credits check करें
3. **Exotel Dashboard** - Call logs check करें
4. **Test Script Run करें** - `node test-elevenlabs.js`

---

## 📝 Notes

- **Free Tier Limits:** ElevenLabs free tier में limited characters/month होते हैं
- **Production:** Production use के लिए paid plan consider करें
- **Voice Quality:** ElevenLabs voices बहुत high quality होती हैं
- **Latency:** `eleven_turbo_v2_5` model fast है, low latency के लिए best

---

**Happy Coding! 🚀**


