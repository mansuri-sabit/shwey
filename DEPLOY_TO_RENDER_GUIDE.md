# 🚀 Git Push और Render Deploy Guide

## 📋 Step 1: Git में Changes Add करें

### 1.1 Important Files Add करें

```powershell
# Modified files
git add package.json
git add utils/ttsService.js

# New important files
git add send-call.js
git add test-elevenlabs.js
git add fix-elevenlabs.js

# Optional: Documentation (अगर चाहिए)
git add ELEVENLABS_HINDI_GUIDE.md
git add QUICK_START_ELEVENLABS.md
```

### 1.2 Deleted Files Remove करें

```powershell
# Old documentation files remove करें
git add -u
```

### 1.3 Status Check करें

```powershell
git status
```

---

## 📝 Step 2: Commit करें

```powershell
git commit -m "Add ElevenLabs TTS integration for greeting functionality"
```

---

## 📤 Step 3: Git Push करें

```powershell
git push origin main
```

---

## 🌐 Step 4: Render Dashboard में Environment Variables Set करें

### 4.1 Render Dashboard खोलें

1. https://dashboard.render.com पर जाएं
2. Login करें
3. अपना service select करें (exotel-voicebot-caller)

### 4.2 Environment Variables Add करें

**Settings → Environment** में जाकर यह variables add करें:

#### Required Variables:

```env
# TTS Configuration
TTS_PROVIDER=elevenlabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
GREETING_TEXT=Hello! Thank you for calling. How can I help you today?

# Exotel Configuration (अगर पहले से नहीं हैं)
EXOTEL_API_KEY=your_exotel_api_key
EXOTEL_API_TOKEN=your_exotel_api_token
EXOTEL_SID=troikaplus1
EXOTEL_APP_ID=1116870
EXOTEL_CALLER_ID=07948516111
EXOTEL_SUBDOMAIN=api.exotel.com

# Server Configuration
NODE_ENV=production
PORT=3000
WEBHOOK_BASE_URL=https://kkbk-xjhf.onrender.com
WS_PATH=/voicebot/ws
```

**Important:**
- `ELEVENLABS_API_KEY` को अपनी actual API key से replace करें
- सभी Exotel credentials add करें (अगर पहले से नहीं हैं)

### 4.3 Save करें

- "Save Changes" button click करें

---

## 🔄 Step 5: Manual Deploy Trigger करें (Optional)

अगर automatic deploy नहीं हो रहा:

1. Render Dashboard में
2. "Manual Deploy" → "Deploy latest commit" click करें

---

## ✅ Step 6: Deploy Status Check करें

1. Render Dashboard में "Logs" tab खोलें
2. Deploy logs check करें:
   - ✅ Build successful
   - ✅ Server started
   - ✅ No errors

---

## 🧪 Step 7: Test करें

### 7.1 Server Health Check

```powershell
curl https://kkbk-xjhf.onrender.com/health
```

**Expected:** `{"status":"healthy",...}`

### 7.2 Test Call Send करें

```powershell
node send-call.js +919324606985
```

### 7.3 Render Logs Check करें

Render Dashboard → Logs में देखें:
- ✅ WebSocket connection established
- ✅ TTS synthesis using elevenlabs
- ✅ Greeting audio streamed successfully

---

## 🎯 Expected Result

Deploy के बाद:
1. ✅ Call successfully initiate होगी
2. ✅ WebSocket connection establish होगा
3. ✅ ElevenLabs से greeting audio generate होगी
4. ✅ Greeting user को सुनाई देगी

---

## ❌ अगर Greeting नहीं आ रही

### Check करें:

1. **Environment Variables:**
   - Render Dashboard → Environment
   - सभी variables set हैं या नहीं
   - `TTS_PROVIDER=elevenlabs` है या नहीं
   - `ELEVENLABS_API_KEY` valid है या नहीं

2. **Server Logs:**
   - Render Dashboard → Logs
   - Errors check करें
   - "TTS synthesis" message दिख रहा है या नहीं

3. **ElevenLabs API:**
   - API key valid है या नहीं
   - Account में credits हैं या नहीं

---

## 📝 Quick Commands Summary

```powershell
# 1. Add files
git add package.json utils/ttsService.js send-call.js test-elevenlabs.js fix-elevenlabs.js

# 2. Commit
git commit -m "Add ElevenLabs TTS integration"

# 3. Push
git push origin main

# 4. Render में environment variables set करें (manually)

# 5. Test
node send-call.js +919324606985
```

---

**Deploy के बाद greeting perfectly work करेगी! 🎉**


