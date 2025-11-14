# 🔧 Exotel Webhook URL Setup Guide

## ❌ Problem

Call send हो रही है लेकिन call cut हो जाती है क्योंकि Exotel को webhook URL नहीं पता है।

---

## ✅ Solution: Exotel Dashboard में Webhook URL Set करें

### Step 1: Exotel Dashboard में जाएं

1. Login करें: https://my.exotel.com
2. **Voicebot Applets** section में जाएं
3. आपका App ID: **1117620** select करें
4. **Settings** या **Configuration** में जाएं

---

### Step 2: Webhook URL Set करें

#### Option A: Local Testing (ngrok के साथ)

**1. ngrok Install करें:**
```powershell
# Chocolatey के साथ:
choco install ngrok -y

# या download करें: https://ngrok.com/download
```

**2. ngrok Start करें:**
```powershell
ngrok http 3000
```

**3. ngrok URL copy करें:**
```
Example: https://abc123.ngrok-free.app
```

**4. Exotel Dashboard में Webhook URL set करें:**
```
https://abc123.ngrok-free.app/api/v1/exotel/voice/connect
```

---

#### Option B: Production (Render.com पर Deploy)

**1. Render.com पर Deploy करें:**
- Code push करें Git पर
- Render.com में new service create करें
- Service URL मिलेगा: `https://your-app.onrender.com`

**2. Exotel Dashboard में Webhook URL set करें:**
```
https://your-app.onrender.com/api/v1/exotel/voice/connect
```

---

### Step 3: Exotel Dashboard Configuration

**Voicebot Applet Settings में:**

1. **Webhook URL / Connect URL:**
   ```
   https://your-server-url/api/v1/exotel/voice/connect
   ```

2. **Method:** GET या POST (दोनों support होते हैं)

3. **Save** करें

---

## 🔍 Current Server Endpoints

आपका server ये endpoints provide करता है:

```
GET/POST  /api/v1/exotel/voice/connect  ← Exotel यहाँ webhook भेजेगा
WebSocket /voice-stream                  ← Real-time audio streaming
```

---

## 🧪 Testing Steps

### 1. ngrok Start करें (Local testing के लिए):
```powershell
ngrok http 3000
```

### 2. ngrok URL copy करें:
```
Forwarding: https://abc123.ngrok-free.app -> http://localhost:3000
```

### 3. Exotel Dashboard में Webhook URL set करें:
```
https://abc123.ngrok-free.app/api/v1/exotel/voice/connect
```

### 4. Test Call Send करें:
- Browser: `http://localhost:3000`
- PDF upload करें
- Call send करें
- Call connect होनी चाहिए और greeting सुननी चाहिए

---

## 📋 Exotel Dashboard में क्या Set करना है

### Voicebot Applet (App ID: 1117620)

**Settings:**
- **Connect URL / Webhook URL:**
  ```
  https://your-ngrok-url.ngrok-free.app/api/v1/exotel/voice/connect
  ```
  या Production के लिए:
  ```
  https://your-app.onrender.com/api/v1/exotel/voice/connect
  ```

- **Method:** GET (या POST)

- **Save** करें

---

## 🔍 Verify करें

### Server Logs में देखें:

Call send करने के बाद, server logs में ये दिखना चाहिए:

```
📞 Voicebot connect webhook received
   Method: GET
   CallSid: xxxxx
   From: +919324606985
   To: 07948516111
   Direction: outbound-api
```

अगर ये logs नहीं दिख रहे, तो webhook URL सही से set नहीं है।

---

## 🐛 Troubleshooting

### Issue 1: "Call cuts immediately"
**Cause:** Webhook URL set नहीं है या गलत है
**Fix:** Exotel Dashboard में webhook URL verify करें

### Issue 2: "Webhook not received"
**Check:**
1. ngrok running है या नहीं
2. Webhook URL सही है या नहीं
3. Server logs में webhook request आ रही है या नहीं

### Issue 3: "Connection refused"
**Fix:** 
- ngrok URL verify करें
- Server running है या नहीं check करें
- Firewall settings check करें

---

## ✅ Quick Checklist

- [ ] ngrok install और start किया (local testing के लिए)
- [ ] ngrok URL copy किया
- [ ] Exotel Dashboard में webhook URL set किया
- [ ] Webhook URL format: `https://your-url/api/v1/exotel/voice/connect`
- [ ] Test call send किया
- [ ] Server logs में webhook request verify किया

---

## 🚀 Next Steps

1. **ngrok install करें** (local testing के लिए)
2. **ngrok start करें:** `ngrok http 3000`
3. **Exotel Dashboard में webhook URL set करें**
4. **Test call send करें**
5. **Call connect होनी चाहिए!** 🎉

---

**Webhook URL set करने के बाद call properly connect होगी! 🎉**

