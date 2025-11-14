# 🚀 Render Deployment - Step by Step

## ✅ Step 1: Git Push (अगर नहीं हुआ)

### Option A: HTTPS Use करें

```powershell
# Remote URL check करें
git remote -v

# अगर SSH है, तो HTTPS में change करें
git remote set-url origin https://github.com/your-username/your-repo.git

# फिर push करें
git push origin main
```

### Option B: Manual Push

GitHub website से manually push करें या Git GUI tool use करें।

---

## 🌐 Step 2: Render Dashboard में Environment Variables Set करें

### 2.1 Render Dashboard खोलें

1. https://dashboard.render.com पर जाएं
2. Login करें
3. अपना service **"exotel-voicebot-caller"** select करें

### 2.2 Environment Variables Add करें

**Settings → Environment** section में जाएं

**यह सभी variables add करें:**

```env
# TTS Provider - ElevenLabs
TTS_PROVIDER=elevenlabs

# ElevenLabs API Key (अपनी actual key से replace करें)
ELEVENLABS_API_KEY=sk_af6c2894a563cb2d8...ae2d738f4d

# ElevenLabs Voice ID
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL

# Greeting Text
GREETING_TEXT=Hello! Thank you for calling. How can I help you today?

# Exotel Configuration
EXOTEL_API_KEY=a14dc4fbfa60fa17cd8095c18f5d5aeb69a9c26dd7b379e5
EXOTEL_API_TOKEN=55eade199e7c9d4c1d734c5f4934a113c618181c6d451ac8
EXOTEL_SID=troikaplus1
EXOTEL_APP_ID=1116870
EXOTEL_CALLER_ID=07948516111
EXOTEL_SUBDOMAIN=api.exotel.com

# Server Configuration
NODE_ENV=production
PORT=3000
WEBHOOK_BASE_URL=https://kkbk-xjhf.onrender.com
WS_PATH=/voicebot/ws

# Optional
EXOTEL_WS_TOKEN=your_secret_token
```

### 2.3 Important Notes:

- **ELEVENLABS_API_KEY:** अपनी actual API key paste करें (`.env` file से copy करें)
- **सभी variables:** एक-एक करके add करें
- **Save Changes:** Add करने के बाद "Save Changes" button click करें

---

## 🔄 Step 3: Deploy Trigger करें

### Option A: Automatic Deploy

अगर Git connected है, तो automatically deploy हो जाएगा।

### Option B: Manual Deploy

1. Render Dashboard में
2. **"Manual Deploy"** button click करें
3. **"Deploy latest commit"** select करें
4. Deploy start हो जाएगा

---

## 📊 Step 4: Deploy Status Check करें

### 4.1 Build Logs Check करें

1. **"Logs"** tab खोलें
2. Build process देखें:
   - ✅ `npm install` successful
   - ✅ `npm start` successful
   - ✅ Server started on port 3000

### 4.2 Expected Logs:

```
🚀 Exotel Voicebot Caller Server running on port 3000
📞 POST /call to initiate a call
🔌 WebSocket Server: ws://localhost:3000/voicebot/ws
📡 Voicebot Connect: http://localhost:3000/api/v1/exotel/voice/connect
```

---

## 🧪 Step 5: Test करें

### 5.1 Health Check

Browser में या terminal में:

```powershell
curl https://kkbk-xjhf.onrender.com/health
```

**Expected:** `{"status":"healthy","timestamp":"..."}`

### 5.2 Test Call Send करें

```powershell
node send-call.js +919324606985
```

### 5.3 Render Logs में Check करें

Render Dashboard → Logs में देखें:

```
📞 New Exotel WebSocket connection
   Call ID: call_xxxxx
   
📨 [call_xxxxx] Received Exotel event: start
   ✅ Stream SID captured: xxxxxx
   
🎙️ [call_xxxxx] Starting greeting synthesis...
   Text: "Hello! Thank you for calling. How can I help you today?"
   Step 1: Calling TTS API...
   
🎙️ TTS synthesis using elevenlabs: { textLength: 55, voice: 'EXAVITQu4vr4xnSDxMaL' }
✅ [call_xxxxx] TTS synthesis complete: 51036 bytes
   
   Step 2: Converting audio to PCM...
✅ [call_xxxxx] Audio converted to PCM: xxxx bytes
   
   Step 3: Streaming audio to Exotel...
📤 [call_xxxxx] Streaming x chunks to Exotel
✅ [call_xxxxx] Greeting audio streamed successfully!
```

---

## ✅ Success Indicators

अगर सब कुछ सही है:

1. ✅ **Deploy Successful:** Render logs में "Build successful" दिखेगा
2. ✅ **Server Running:** Health check successful
3. ✅ **Call Connects:** Call successfully initiate होगी
4. ✅ **Greeting Plays:** User को greeting सुनाई देगी

---

## ❌ Troubleshooting

### Problem 1: Deploy Failed

**Check करें:**
- Git repository connected है या नहीं
- Build logs में errors check करें
- `package.json` में scripts सही हैं या नहीं

### Problem 2: Environment Variables Not Working

**Check करें:**
- सभी variables correctly added हैं या नहीं
- Variable names सही हैं या नहीं (case-sensitive)
- Values में extra spaces तो नहीं
- "Save Changes" click किया है या नहीं

### Problem 3: Greeting नहीं आ रही

**Check करें:**
1. **Render Logs:**
   - "TTS synthesis using elevenlabs" message दिख रहा है या नहीं
   - Errors check करें

2. **Environment Variables:**
   - `TTS_PROVIDER=elevenlabs` set है या नहीं
   - `ELEVENLABS_API_KEY` valid है या नहीं
   - `GREETING_TEXT` set है या नहीं

3. **ElevenLabs API:**
   - API key valid है या नहीं
   - Account में credits हैं या नहीं

---

## 📋 Quick Checklist

- [ ] Git push successful (या manual push किया)
- [ ] Render Dashboard में service select किया
- [ ] Environment variables add किए (सभी)
- [ ] "Save Changes" click किया
- [ ] Deploy triggered (automatic या manual)
- [ ] Build successful (logs check किया)
- [ ] Server running (health check successful)
- [ ] Test call send की
- [ ] Render logs में greeting messages दिखे

---

## 🎉 Final Result

Deploy के बाद:
- ✅ Call successfully initiate होगी
- ✅ WebSocket connection establish होगा
- ✅ ElevenLabs से greeting audio generate होगी
- ✅ Greeting user को सुनाई देगी: **"Hello! Thank you for calling. How can I help you today?"**

---

**Deploy complete करने के बाद greeting perfectly work करेगी! 🚀**


