# ✅ Final Deployment Checklist

## 📋 Pre-Deployment Checklist

### ✅ Code Changes
- [x] ElevenLabs TTS integration added
- [x] Exotel App ID updated to 1117620
- [x] WebSocket path updated to /voice-stream
- [x] All code committed to git
- [x] All files pushed to repository

---

## 🚀 Step 1: Git Push

### If Git Push Successful:
✅ Code is on GitHub
✅ Render will auto-deploy

### If Git Push Failed:
```powershell
# Check remote URL
git remote -v

# If SSH, change to HTTPS
git remote set-url origin https://github.com/your-username/your-repo.git

# Push again
git push origin main
```

---

## 🌐 Step 2: Render Dashboard - Environment Variables

### 2.1 Go to Render Dashboard
1. https://dashboard.render.com
2. Login
3. Select service: **exotel-voicebot-caller** (या **one-calling-agent**)

### 2.2 Settings → Environment

**यह सभी variables add/update करें:**

```env
# Exotel Configuration
EXOTEL_API_KEY=a14dc4fbfa60fa17cd8095c18f5d5aeb69a9c26dd7b379e5
EXOTEL_API_TOKEN=55eade199e7c9d4c1d734c5f4934a113c618181c6d451ac8
EXOTEL_SID=troikaplus1
EXOTEL_APP_ID=1117620
EXOTEL_CALLER_ID=07948516111
EXOTEL_SUBDOMAIN=api.exotel.com

# WebSocket Configuration
WS_PATH=/voice-stream
WEBHOOK_BASE_URL=https://one-calling-agent.onrender.com
# या अगर kkbk-xjhf service use कर रहे हैं:
# WEBHOOK_BASE_URL=https://kkbk-xjhf.onrender.com

# TTS Configuration - ElevenLabs
TTS_PROVIDER=elevenlabs
ELEVENLABS_API_KEY=sk_af6c2894a563cb2d8...ae2d738f4d
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
GREETING_TEXT=Hello! Thank you for calling. How can I help you today?

# Server Configuration
NODE_ENV=production
PORT=3000
```

**Important:**
- `ELEVENLABS_API_KEY` को अपनी actual key से replace करें
- `WEBHOOK_BASE_URL` को अपने actual Render service URL से replace करें

### 2.3 Save Changes
- "Save Changes" button click करें

---

## 🔄 Step 3: Trigger Deploy

### Option A: Automatic Deploy
- Git push के बाद automatically deploy हो जाएगा
- Render Dashboard → Logs में deploy status check करें

### Option B: Manual Deploy
1. Render Dashboard में
2. "Manual Deploy" button click करें
3. "Deploy latest commit" select करें
4. Deploy start हो जाएगा

---

## 📊 Step 4: Deploy Status Check

### 4.1 Build Logs
Render Dashboard → Logs में check करें:

**Expected:**
```
✅ npm install successful
✅ npm start successful
✅ Server running on port 3000
```

### 4.2 Server Logs
```
🚀 Exotel Voicebot Caller Server running on port 3000
🔌 WebSocket Server: ws://localhost:3000/voice-stream
📡 Voicebot Connect: http://localhost:3000/api/v1/exotel/voice/connect
```

---

## 🧪 Step 5: Testing

### 5.1 Health Check
```powershell
curl https://one-calling-agent.onrender.com/health
```

**Expected:** `{"status":"healthy","timestamp":"..."}`

### 5.2 Test Call
```powershell
node send-call.js +919324606985
```

### 5.3 Check Render Logs
Render Dashboard → Logs में देखें:

**Expected Logs:**
```
📞 New Exotel WebSocket connection
   Path: /voice-stream
   Call ID: call_xxxxx
   
🎙️ [call_xxxxx] Starting greeting synthesis...
   Text: "Hello! Thank you for calling. How can I help you today?"
   
🎙️ TTS synthesis using elevenlabs: { textLength: 55, voice: 'EXAVITQu4vr4xnSDxMaL' }
✅ [call_xxxxx] TTS synthesis complete: 51036 bytes
✅ [call_xxxxx] Audio converted to PCM: xxxx bytes
📤 [call_xxxxx] Streaming x chunks to Exotel
✅ [call_xxxxx] Greeting audio streamed successfully!
```

---

## ✅ Success Indicators

अगर सब कुछ सही है:

1. ✅ **Deploy Successful:** Build logs में "Build successful"
2. ✅ **Server Running:** Health check successful
3. ✅ **Call Connects:** Call successfully initiate होगी
4. ✅ **WebSocket Connects:** Logs में "New Exotel WebSocket connection"
5. ✅ **Greeting Plays:** Logs में "Greeting audio streamed successfully"
6. ✅ **User Hears Greeting:** Phone call में greeting सुनाई देगी

---

## ❌ Troubleshooting

### Problem 1: Deploy Failed
**Check:**
- Build logs में errors
- `package.json` में scripts सही हैं या नहीं
- Git repository connected है या नहीं

### Problem 2: Environment Variables Not Working
**Check:**
- सभी variables correctly added हैं
- Variable names सही हैं (case-sensitive)
- "Save Changes" click किया है
- Service restart किया है

### Problem 3: Greeting नहीं आ रही
**Check:**
1. **Render Logs:**
   - "TTS synthesis using elevenlabs" message दिख रहा है या नहीं
   - Errors check करें

2. **Environment Variables:**
   - `TTS_PROVIDER=elevenlabs` set है
   - `ELEVENLABS_API_KEY` valid है
   - `GREETING_TEXT` set है

3. **Exotel Flow:**
   - Webhook URL: `https://one-calling-agent.onrender.com/api/v1/exotel/voice/connect`
   - App ID: `1117620`

---

## 📋 Final Checklist

- [ ] Git push successful
- [ ] Render Dashboard में service select किया
- [ ] Environment variables add किए (सभी)
- [ ] `EXOTEL_APP_ID=1117620` set किया
- [ ] `WS_PATH=/voice-stream` set किया
- [ ] `WEBHOOK_BASE_URL` set किया
- [ ] `ELEVENLABS_API_KEY` set किया
- [ ] "Save Changes" click किया
- [ ] Deploy triggered
- [ ] Build successful
- [ ] Server running
- [ ] Health check successful
- [ ] Test call send की
- [ ] Render logs में greeting messages दिखे

---

## 🎉 Final Result

Deploy complete के बाद:

1. ✅ **Call Send होगी:** `node send-call.js +919324606985`
2. ✅ **Exotel Connect होगा:** WebSocket connection establish
3. ✅ **Greeting Generate होगी:** ElevenLabs TTS से
4. ✅ **Greeting Play होगी:** User को सुनाई देगी

**"Hello! Thank you for calling. How can I help you today?"**

---

**Deploy करने के बाद greeting perfectly work करेगी! 🚀**

