# 🚨 Quick Fix: Exotel Webhook URL Setup

## ❌ Problem

Call send हो रही है लेकिन call cut हो जाती है क्योंकि Exotel को webhook URL नहीं पता है।

---

## ✅ Solution: 2 Options

### Option 1: Local Testing (ngrok) - Quick

**Step 1: ngrok Install करें**
```powershell
# Chocolatey के साथ:
choco install ngrok -y
```

**Step 2: ngrok Start करें**
```powershell
ngrok http 3000
```

**Step 3: ngrok URL Copy करें**
```
Example output:
Forwarding: https://abc123.ngrok-free.app -> http://localhost:3000
```

**Step 4: Exotel Dashboard में Set करें**

1. Login: https://my.exotel.com
2. Voicebot Applets → App ID: **1117620**
3. Settings → Webhook URL / Connect URL:
   ```
   https://abc123.ngrok-free.app/api/v1/exotel/voice/connect
   ```
4. Save करें

---

### Option 2: Production (Render.com) - Permanent

**Step 1: Render.com पर Deploy करें**

1. Git push करें:
   ```powershell
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Render.com में:
   - New Web Service create करें
   - GitHub repo connect करें
   - Service URL मिलेगा: `https://your-app.onrender.com`

**Step 2: Exotel Dashboard में Set करें**

1. Login: https://my.exotel.com
2. Voicebot Applets → App ID: **1117620**
3. Settings → Webhook URL:
   ```
   https://your-app.onrender.com/api/v1/exotel/voice/connect
   ```
4. Save करें

---

## 🧪 Test करें

1. **ngrok running है** (local testing के लिए)
2. **Exotel Dashboard में webhook URL set है**
3. **Server running है:** `npm start`
4. **Test call send करें:**
   - Browser: `http://localhost:3000`
   - PDF upload करें
   - Call send करें
   - Call connect होनी चाहिए!

---

## 🔍 Verify करें

**Server logs में देखें:**

Call send करने के बाद, ये logs दिखने चाहिए:

```
📞 Voicebot connect webhook received
   Method: GET
   CallSid: xxxxx
   From: +919324606985
   To: 07948516111
```

अगर ये logs नहीं दिख रहे, तो webhook URL सही से set नहीं है।

---

## ✅ Checklist

- [ ] ngrok install किया (local testing के लिए)
- [ ] ngrok start किया: `ngrok http 3000`
- [ ] ngrok URL copy किया
- [ ] Exotel Dashboard में webhook URL set किया
- [ ] Webhook URL format: `https://your-url/api/v1/exotel/voice/connect`
- [ ] Test call send किया
- [ ] Server logs में webhook request verify किया

---

**Webhook URL set करने के बाद call properly connect होगी! 🎉**

