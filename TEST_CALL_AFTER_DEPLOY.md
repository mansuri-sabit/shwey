# 📞 Test Call After Deployment

## ✅ Deployment Complete होने के बाद

### Step 1: Health Check करें

```powershell
curl https://one-calling-agent.onrender.com/health
```

**Expected:** `{"status":"healthy","timestamp":"..."}`

---

### Step 2: Test Call Send करें

```powershell
node send-call.js +919324606985
```

---

### Step 3: Expected Flow

1. **Call Initiation:**
   ```
   ✅ Call successfully initiated to +919324606985
   Call SID: xxxxxx
   ```

2. **Exotel Connection:**
   - Exotel webhook call करेगा: `https://one-calling-agent.onrender.com/api/v1/exotel/voice/connect`
   - Server WebSocket URL return करेगा: `wss://one-calling-agent.onrender.com/voice-stream?call_id=xxxxx`

3. **WebSocket Connection:**
   - Exotel → Server WebSocket connect होगा
   - Render logs में: `📞 New Exotel WebSocket connection`

4. **Greeting Generation:**
   - Render logs में: `🎙️ TTS synthesis using elevenlabs`
   - Render logs में: `✅ TTS synthesis complete: 51036 bytes`
   - Render logs में: `✅ Audio converted to PCM`

5. **Greeting Streaming:**
   - Render logs में: `📤 Streaming x chunks to Exotel`
   - Render logs में: `✅ Greeting audio streamed successfully!`

6. **User Experience:**
   - Phone ring होगी
   - Call answer होगी
   - **Greeting play होगी:** "Hello! Thank you for calling. How can I help you today?"

---

## 📊 Render Logs में Check करें

### Expected Logs Sequence:

```
📞 Voicebot connect webhook received
   Method: GET
   CallSid: xxxxxx
   Returning WebSocket URL: wss://one-calling-agent.onrender.com/voice-stream?call_id=xxxxx

📞 New Exotel WebSocket connection
   Path: /voice-stream
   Call ID: call_xxxxx
   Stream SID: pending

📨 [call_xxxxx] Received Exotel event: start
   ✅ Stream SID captured: xxxxxx

🎙️ [call_xxxxx] Starting greeting synthesis...
   Text: "Hello! Thank you for calling. How can I help you today?"
   Stream SID: xxxxxx
   WebSocket State: 1

   Step 1: Calling TTS API...
🎙️ TTS synthesis using elevenlabs: { textLength: 55, voice: 'EXAVITQu4vr4xnSDxMaL' }
✅ [call_xxxxx] TTS synthesis complete: 51036 bytes

   Step 2: Converting audio to PCM...
✅ [call_xxxxx] Audio converted to PCM: xxxx bytes

   Step 3: Streaming audio to Exotel...
📤 [call_xxxxx] Streaming x chunks (xxxx bytes total) to Exotel
   Stream SID: xxxxxx
   Starting sequence number: 0
✅ [call_xxxxx] Sent x/x chunks. Final sequence number: x

   Step 4: Sending mark event...
📍 Mark event sent: greeting_done for Call call_xxxxx

✅ [call_xxxxx] Greeting audio streamed successfully!
```

---

## ✅ Success Indicators

अगर सब कुछ सही है:

1. ✅ **Call Initiated:** `send-call.js` output में success message
2. ✅ **Webhook Called:** Render logs में "Voicebot connect webhook received"
3. ✅ **WebSocket Connected:** Render logs में "New Exotel WebSocket connection"
4. ✅ **Greeting Generated:** Render logs में "TTS synthesis using elevenlabs"
5. ✅ **Greeting Streamed:** Render logs में "Greeting audio streamed successfully"
6. ✅ **User Hears Greeting:** Phone call में greeting सुनाई देगी

---

## ❌ अगर Greeting नहीं आ रही

### Check करें:

1. **Render Logs:**
   - Errors check करें
   - "TTS synthesis" message दिख रहा है या नहीं
   - WebSocket connection establish हुआ या नहीं

2. **Environment Variables:**
   - `TTS_PROVIDER=elevenlabs` set है
   - `ELEVENLABS_API_KEY` valid है
   - `GREETING_TEXT` set है
   - `WS_PATH=/voice-stream` set है

3. **Exotel Flow:**
   - Webhook URL: `https://one-calling-agent.onrender.com/api/v1/exotel/voice/connect`
   - App ID: `1117620`

4. **ElevenLabs:**
   - API key valid है
   - Account में credits हैं

---

## 🎯 Ready to Test!

Deployment complete होने के बाद:

```powershell
node send-call.js +919324606985
```

**फिर Render logs check करें और greeting verify करें!**

---

**Test call ready! 🚀**

