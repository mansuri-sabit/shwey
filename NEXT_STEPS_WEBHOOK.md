# ✅ Next Steps: Exotel Webhook Setup

## 🎉 ngrok Installed Successfully!

ngrok अब project folder में है: `D:\KKBK-main\ngrok.exe`

---

## 🚀 Step-by-Step Setup

### Step 1: ngrok Start करें

**New PowerShell window में:**
```powershell
cd D:\KKBK-main
.\ngrok.exe http 3000
```

**Output में दिखेगा:**
```
Forwarding: https://abc123.ngrok-free.app -> http://localhost:3000
```

**Important:** इस window को open रखें (ngrok running रहना चाहिए)

---

### Step 2: ngrok URL Copy करें

ngrok output से **HTTPS URL** copy करें:
```
https://abc123.ngrok-free.app
```

---

### Step 3: Exotel Dashboard में Webhook URL Set करें

1. **Login:** https://my.exotel.com
2. **Voicebot Applets** section में जाएं
3. **App ID: 1117620** select करें
4. **Settings** या **Configuration** में जाएं
5. **Webhook URL / Connect URL** में add करें:
   ```
   https://abc123.ngrok-free.app/api/v1/exotel/voice/connect
   ```
   (आपका ngrok URL use करें)
6. **Save** करें

---

### Step 4: Server Start करें

**अलग PowerShell window में:**
```powershell
cd D:\KKBK-main
npm start
```

---

### Step 5: Test Call Send करें

1. **Browser:** `http://localhost:3000`
2. **PDF upload करें**
3. **Call send करें**
4. **Call answer करें**
5. **Greeting सुननी चाहिए!** 🎉

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

अगर ये logs नहीं दिख रहे, तो:
- ngrok running है या नहीं check करें
- Exotel Dashboard में webhook URL सही है या नहीं verify करें

---

## ⚠️ Important Notes

1. **ngrok Window Open रखें:** ngrok running रहना चाहिए
2. **ngrok URL Change हो सकता है:** Free plan पर हर restart पर URL change होता है
3. **Production के लिए:** Render.com use करें (stable URL)

---

## 🎯 Quick Commands

### Terminal 1 (ngrok):
```powershell
.\ngrok.exe http 3000
```

### Terminal 2 (Server):
```powershell
npm start
```

### Browser:
```
http://localhost:3000
```

---

## ✅ Checklist

- [x] ngrok installed
- [ ] ngrok started (`.\ngrok.exe http 3000`)
- [ ] ngrok URL copied
- [ ] Exotel Dashboard में webhook URL set किया
- [ ] Server running (`npm start`)
- [ ] Test call send किया
- [ ] Server logs में webhook request verify किया

---

**अब ngrok start करें और Exotel Dashboard में webhook URL set करें! 🚀**

