# 📡 Exotel Webhook URL Configuration

## 🎯 Webhook URL for Exotel Flow

### Main Webhook Endpoint:

```
https://one-calling-agent.onrender.com/api/v1/exotel/voice/connect
```

**या अगर आप `kkbk-xjhf` service use कर रहे हैं:**

```
https://kkbk-xjhf.onrender.com/api/v1/exotel/voice/connect
```

---

## 📋 Exotel Flow में Configure करें

### Step 1: Exotel Dashboard में जाएं

1. https://my.exotel.com पर login करें
2. **Flows** → **Edit Flow** (App ID: `1117620`)
3. **Voicebot** applet select करें

### Step 2: Webhook URL Enter करें

**Voicebot Configuration में:**

**Option 1: HTTP/HTTPS URL (Recommended)**
```
https://one-calling-agent.onrender.com/api/v1/exotel/voice/connect
```

**Option 2: Direct WebSocket URL (अगर Exotel direct WebSocket support करता है)**
```
wss://one-calling-agent.onrender.com/voice-stream
```

---

## 🔄 How It Works

### Flow:

1. **Call Initiated:**
   - Exotel call initiate करता है
   - Exotel Voicebot Applet trigger होता है

2. **Webhook Call:**
   - Exotel → `https://one-calling-agent.onrender.com/api/v1/exotel/voice/connect`
   - Method: GET या POST
   - Parameters: `CallSid`, `CallFrom`, `CallTo`, `Direction`, etc.

3. **Server Response:**
   - Server WebSocket URL return करता है:
   ```json
   {
     "url": "wss://one-calling-agent.onrender.com/voice-stream?call_id=xxxxx"
   }
   ```

4. **WebSocket Connection:**
   - Exotel → `wss://one-calling-agent.onrender.com/voice-stream?call_id=xxxxx`
   - Real-time audio streaming start होता है

5. **Greeting Play:**
   - Server ElevenLabs से greeting generate करता है
   - Audio Exotel को stream करता है
   - User को greeting सुनाई देती है

---

## ✅ Complete Configuration

### Exotel Flow Settings:

| Setting | Value |
|---------|-------|
| **App ID** | `1117620` |
| **Webhook URL** | `https://one-calling-agent.onrender.com/api/v1/exotel/voice/connect` |
| **WebSocket URL** | `wss://one-calling-agent.onrender.com/voice-stream` |
| **Record this?** | ✅ Checked |
| **Recording Channels?** | Dual |
| **Encrypt DTMF?** | ❌ Unchecked |

---

## 🧪 Testing Webhook

### Test करने के लिए:

```powershell
# Health check
curl https://one-calling-agent.onrender.com/health

# Webhook endpoint test (GET)
curl "https://one-calling-agent.onrender.com/api/v1/exotel/voice/connect?CallSid=test123&CallFrom=+919324606985&CallTo=07948516111"

# Expected Response:
# {
#   "url": "wss://one-calling-agent.onrender.com/voice-stream?call_id=test123"
# }
```

---

## 📝 Important Notes

1. **HTTPS Required:**
   - Exotel requires HTTPS for webhook URLs
   - Render automatically provides HTTPS

2. **Both Methods Supported:**
   - Server supports both GET and POST
   - Exotel can use either method

3. **WebSocket Path:**
   - Default: `/voice-stream`
   - Can be changed via `WS_PATH` environment variable

4. **Base URL:**
   - Set `WEBHOOK_BASE_URL` in Render environment variables
   - Should match your Render service URL

---

## 🔧 Render Environment Variables

Render Dashboard में set करें:

```env
WEBHOOK_BASE_URL=https://one-calling-agent.onrender.com
WS_PATH=/voice-stream
EXOTEL_APP_ID=1117620
```

---

## ✅ Final Webhook URL

**Exotel Flow में use करें:**

```
https://one-calling-agent.onrender.com/api/v1/exotel/voice/connect
```

**यह URL Exotel Flow के Voicebot Applet में configure करें!**

---

**Webhook URL configured! 🎉**

