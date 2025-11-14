# 🔧 Greeting Fix - Step by Step

## ❌ Problem

Call connect हो रही है लेकिन greeting सुनाई नहीं दे रही।

---

## ✅ Solution Steps

### Step 1: TTS Test करें

```powershell
node test-tts.js
```

**Expected Output:**
```
✅ TTS synthesis successful: XXXX bytes
✅ Audio conversion successful: XXXX bytes
✅ All tests passed!
```

**अगर Error आए:**
- FFmpeg issue → `choco install ffmpeg -y`
- API Key issue → `.env` file में check करें

---

### Step 2: Server Logs Check करें

Call send करने के बाद, server terminal में ये logs देखें:

#### ✅ Success Logs (ये दिखने चाहिए):

```
📞 Voicebot connect webhook received
🔌 WebSocket connection established
✅ Stream SID captured: xxxxx
🎙️ Starting greeting synthesis...
   Step 1: Calling TTS API...
✅ TTS synthesis complete: XXXX bytes
   Step 2: Converting audio to PCM...
✅ Audio converted to PCM: XXXX bytes
   Step 3: Streaming audio to Exotel...
📤 Streaming X chunks to Exotel
✅ Greeting audio streamed successfully!
```

#### ❌ Error Logs (अगर ये दिखें):

```
❌ Error in greeting synthesis/streaming: ...
❌ TTS error: ...
❌ Audio conversion failed: ...
❌ WebSocket not ready: ...
```

---

### Step 3: Common Fixes

#### Fix 1: TTS API Error

**Error:**
```
❌ ElevenLabs TTS failed: ...
```

**Solution:**
1. `.env` file check करें:
   ```env
   TTS_PROVIDER=elevenlabs
   ELEVENLABS_API_KEY=your_key_here
   ```

2. API key valid है या नहीं verify करें

3. Server restart करें:
   ```powershell
   npm start
   ```

---

#### Fix 2: Audio Conversion Error

**Error:**
```
❌ Audio conversion failed: ffmpeg not found
```

**Solution:**
```powershell
# FFmpeg install करें:
choco install ffmpeg -y

# Verify:
ffmpeg -version

# Server restart करें:
npm start
```

---

#### Fix 3: WebSocket Not Ready

**Error:**
```
❌ WebSocket not ready (state: X)
```

**Solution:**
1. ngrok running है या नहीं check करें
2. Exotel webhook URL सही है या नहीं verify करें
3. Server restart करें

---

#### Fix 4: Stream SID Not Received

**Error:**
```
⏳ Waiting for stream_sid before sending greeting
```

**Solution:**
1. Call properly connect हो रही है या नहीं check करें
2. Exotel Voicebot Applet properly configured है या नहीं verify करें
3. Webhook URL सही है या नहीं check करें

---

### Step 4: Complete Restart

अगर कुछ भी काम नहीं कर रहा:

```powershell
# 1. Stop server (Ctrl+C)
# 2. Stop ngrok (Ctrl+C)

# 3. Start ngrok:
.\ngrok.exe http 3000

# 4. Start server (new terminal):
npm start

# 5. Test call again
```

---

## 🧪 Quick Test

### 1. TTS Test:
```powershell
node test-tts.js
```

### 2. Server Health:
```powershell
curl http://localhost:3000/health
```

### 3. ngrok Status:
```powershell
curl http://localhost:4040/api/tunnels
```

---

## 📋 Checklist

- [ ] FFmpeg installed (`ffmpeg -version`)
- [ ] TTS test passed (`node test-tts.js`)
- [ ] Server running (`npm start`)
- [ ] ngrok running (`.\ngrok.exe http 3000`)
- [ ] Exotel webhook URL set (Dashboard में)
- [ ] ELEVENLABS_API_KEY set (`.env` file में)
- [ ] TTS_PROVIDER=elevenlabs set (`.env` file में)
- [ ] Server logs में greeting synthesis started
- [ ] Server logs में TTS complete
- [ ] Server logs में audio conversion complete
- [ ] Server logs में audio streaming

---

## 🔍 Debug Commands

### Check Environment:
```powershell
Get-Content .env | Select-String "ELEVENLABS|TTS_PROVIDER"
```

### Check Processes:
```powershell
Get-Process | Where-Object {$_.ProcessName -eq "node" -or $_.ProcessName -eq "ngrok"}
```

### Check Ports:
```powershell
netstat -ano | findstr ":3000"
netstat -ano | findstr ":4040"
```

---

## 📞 Next Steps

1. **`node test-tts.js` run करें** - TTS और audio conversion test करें
2. **Server logs check करें** - Call send करने के बाद की logs
3. **Errors identify करें** - ऊपर दिए गए fixes से match करें
4. **Fix apply करें** - Corresponding solution use करें

---

**पहले `node test-tts.js` run करें और results share करें! 🔍**

