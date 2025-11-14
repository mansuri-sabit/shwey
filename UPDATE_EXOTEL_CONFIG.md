# 🔄 Exotel Configuration Update

## ✅ Changes Made

### 1. App ID Updated
- **Old:** `1116870`
- **New:** `1117620`

### 2. WebSocket Path Updated
- **Old:** `/voicebot/ws`
- **New:** `/voice-stream` (default)
- **Note:** Server supports both paths

### 3. Server URL
- **Current:** `wss://one-calling-agent.onrender.com/voice-stream`
- **Or:** `https://kkbk-xjhf.onrender.com` (if using kkbk-xjhf service)

---

## 📝 Environment Variables to Update

### Render Dashboard में यह variables set करें:

```env
# Exotel Configuration
EXOTEL_APP_ID=1117620

# WebSocket Path (अगर /voice-stream use करना है)
WS_PATH=/voice-stream

# Server Base URL (अपने actual Render service URL से replace करें)
WEBHOOK_BASE_URL=https://one-calling-agent.onrender.com
# या
WEBHOOK_BASE_URL=https://kkbk-xjhf.onrender.com
```

---

## ✅ Code Changes

1. **server.js:**
   - ✅ Default WebSocket path changed to `/voice-stream`
   - ✅ Server accepts both `/voicebot/ws` and `/voice-stream` paths
   - ✅ WebSocket authentication bypassed for both paths

2. **Environment Variables:**
   - `EXOTEL_APP_ID` should be set to `1117620`
   - `WS_PATH` can be set to `/voice-stream` (or leave default)

---

## 🧪 Testing

### 1. Check WebSocket Path

Server logs में देखें:
```
🔌 WebSocket Server: ws://localhost:3000/voice-stream
```

### 2. Test Call

```powershell
node send-call.js +919324606985
```

### 3. Verify Exotel Flow

Exotel Dashboard में check करें:
- App ID: `1117620`
- WebSocket URL: `wss://one-calling-agent.onrender.com/voice-stream`

---

## 📋 Complete Environment Variables List

Render Dashboard में यह सभी variables set करें:

```env
# Exotel Configuration
EXOTEL_API_KEY=your_exotel_api_key
EXOTEL_API_TOKEN=your_exotel_api_token
EXOTEL_SID=troikaplus1
EXOTEL_APP_ID=1117620
EXOTEL_CALLER_ID=07948516111
EXOTEL_SUBDOMAIN=api.exotel.com

# WebSocket Configuration
WS_PATH=/voice-stream
WEBHOOK_BASE_URL=https://one-calling-agent.onrender.com

# TTS Configuration
TTS_PROVIDER=elevenlabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
GREETING_TEXT=Hello! Thank you for calling. How can I help you today?

# Server Configuration
NODE_ENV=production
PORT=3000
```

---

## ✅ After Update

1. **Git Push करें:**
   ```powershell
   git add server.js
   git commit -m "Update Exotel App ID to 1117620 and WebSocket path to /voice-stream"
   git push origin main
   ```

2. **Render में Deploy:**
   - Environment variables update करें
   - Deploy trigger करें

3. **Test:**
   - Call send करें
   - Greeting check करें

---

**Configuration updated! 🎉**

