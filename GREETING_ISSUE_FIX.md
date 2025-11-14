# ✅ TTS Working! - Greeting Issue Fix

## ✅ Good News

TTS और audio conversion **perfectly working** हैं:
- ✅ TTS synthesis: Working
- ✅ Audio conversion: Working
- ✅ FFmpeg: Installed

**तो problem webhook/WebSocket connection में है!**

---

## 🔍 Next: Server Logs Check करें

Call send करने के बाद, **server terminal में ये logs देखें:**

### ✅ Success Flow (ये दिखने चाहिए):

```
1. 📞 Voicebot connect webhook received
   Method: GET
   CallSid: xxxxx

2. 🔌 WebSocket connection established for Call: xxxxx

3. ✅ Stream SID captured: xxxxx

4. 🎙️ Starting greeting synthesis...
   Step 1: Calling TTS API...
   ✅ TTS synthesis complete: XXXX bytes
   Step 2: Converting audio to PCM...
   ✅ Audio converted to PCM: XXXX bytes
   Step 3: Streaming audio to Exotel...
   📤 Streaming X chunks to Exotel
   ✅ Greeting audio streamed successfully!
```

---

## ❌ Common Issues & Fixes

### Issue 1: Webhook Not Received

**Symptoms:**
- Server logs में "Voicebot connect webhook received" **नहीं दिख रहा**

**Fix:**
1. **Exotel Dashboard check करें:**
   - Login: https://my.exotel.com
   - Voicebot Applets → App ID: **1117620**
   - Settings → Webhook URL verify करें:
     ```
     https://xenia-cranial-rakishly.ngrok-free.dev/api/v1/exotel/voice/connect
     ```

2. **ngrok running है या नहीं:**
   ```powershell
   # Check ngrok:
   curl http://localhost:4040/api/tunnels
   ```

3. **ngrok URL change तो नहीं हुआ:**
   - Free plan पर restart पर URL change होता है
   - नया URL Exotel Dashboard में update करें

---

### Issue 2: WebSocket Not Connecting

**Symptoms:**
- "WebSocket connection established" **नहीं दिख रहा**

**Fix:**
1. **Server running है या नहीं:**
   ```powershell
   curl http://localhost:3000/health
   ```

2. **Webhook URL सही है या नहीं:**
   - Exotel Dashboard में verify करें
   - Format: `https://your-ngrok-url/api/v1/exotel/voice/connect`

3. **Server restart करें:**
   ```powershell
   # Stop (Ctrl+C)
   npm start
   ```

---

### Issue 3: Stream SID Not Received

**Symptoms:**
- "Stream SID captured" **नहीं दिख रहा**
- "Waiting for stream_sid" message दिख रहा

**Fix:**
1. **Call properly connect हो रही है या नहीं:**
   - Phone ring हो रहा है?
   - Call answer हो रही है?

2. **Exotel Voicebot Applet properly configured है:**
   - App ID: **1117620** सही है?
   - Webhook URL set है?

3. **Server logs में errors check करें**

---

### Issue 4: Greeting Not Triggering

**Symptoms:**
- "Starting greeting synthesis" **नहीं दिख रहा**

**Fix:**
1. **Stream SID received है या नहीं check करें**
2. **WebSocket ready है या नहीं check करें**
3. **Server logs में errors check करें**

---

## 🧪 Test Steps

### Step 1: Complete Restart

```powershell
# Terminal 1: ngrok
.\ngrok.exe http 3000

# Terminal 2: Server
npm start
```

### Step 2: Verify ngrok URL

```powershell
curl http://localhost:4040/api/tunnels
```

**Output से URL copy करें और Exotel Dashboard में verify करें**

### Step 3: Test Call

1. Browser: `http://localhost:3000`
2. PDF upload करें
3. Call send करें
4. **Server logs watch करें** (real-time)

### Step 4: Check Logs

Server terminal में ये देखें:
- Webhook received?
- WebSocket connected?
- Stream SID captured?
- Greeting synthesis started?
- Any errors?

---

## 📋 Quick Checklist

- [x] TTS working (`node test-tts.js` passed)
- [x] Audio conversion working
- [x] FFmpeg installed
- [ ] ngrok running
- [ ] ngrok URL Exotel Dashboard में set है
- [ ] Server running
- [ ] Webhook received (server logs में)
- [ ] WebSocket connected (server logs में)
- [ ] Stream SID captured (server logs में)
- [ ] Greeting synthesis started (server logs में)

---

## 🔧 Quick Fix Commands

### Restart Everything:
```powershell
# 1. Stop all (Ctrl+C in both terminals)

# 2. Start ngrok:
.\ngrok.exe http 3000

# 3. Get ngrok URL:
curl http://localhost:4040/api/tunnels

# 4. Update Exotel Dashboard with new URL (if changed)

# 5. Start server:
npm start

# 6. Test call
```

---

## 📞 Next Steps

1. **Call send करें**
2. **Server logs copy करें** (server terminal से)
3. **Logs share करें** - मैं exact issue identify करूंगा

---

**Server logs share करें ताकि exact problem find कर सकें! 🔍**

**TTS working है, तो problem webhook/WebSocket में है - logs से पता चल जाएगा! 🚀**

