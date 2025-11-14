# 🔧 ngrok Manual Installation (No Admin Required)

## ❌ Chocolatey Issue

Chocolatey installation failed due to lock file/permissions. Use manual installation instead.

---

## ✅ Option 1: Manual ngrok Installation (Easiest)

### Step 1: Download ngrok

1. Visit: https://ngrok.com/download
2. Download Windows version (ZIP file)
3. Extract to a folder (e.g., `C:\ngrok`)

### Step 2: Add to PATH (Optional but Recommended)

1. Extract ngrok.exe to: `C:\ngrok\ngrok.exe`
2. Add to PATH:
   - System Properties → Environment Variables
   - Edit PATH variable
   - Add: `C:\ngrok`
   - OK करें

### Step 3: Verify

```powershell
ngrok version
```

---

## ✅ Option 2: Use ngrok Without PATH

अगर PATH में add नहीं करना है:

1. ngrok.exe को project folder में copy करें: `D:\KKBK-main\ngrok.exe`
2. Use करें:
   ```powershell
   .\ngrok.exe http 3000
   ```

---

## ✅ Option 3: Render.com Deployment (Best for Production)

ngrok की जरूरत नहीं - direct production deployment:

### Step 1: Git Push

```powershell
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Render.com Setup

1. Login: https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - **Name:** exotel-voicebot
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Deploy करें

### Step 3: Get Service URL

Render.com आपको URL देगा:
```
https://your-app.onrender.com
```

### Step 4: Exotel Dashboard में Set करें

1. Login: https://my.exotel.com
2. Voicebot Applets → App ID: **1117620**
3. Settings → Webhook URL:
   ```
   https://your-app.onrender.com/api/v1/exotel/voice/connect
   ```
4. Save करें

---

## 🧪 Quick Test (Manual ngrok)

### Step 1: ngrok Start करें

```powershell
# अगर PATH में है:
ngrok http 3000

# या project folder में है:
.\ngrok.exe http 3000
```

### Step 2: ngrok URL Copy करें

Output में दिखेगा:
```
Forwarding: https://abc123.ngrok-free.app -> http://localhost:3000
```

### Step 3: Exotel Dashboard में Set करें

1. https://my.exotel.com → Voicebot Applets → App ID: **1117620**
2. Settings → Webhook URL:
   ```
   https://abc123.ngrok-free.app/api/v1/exotel/voice/connect
   ```
3. Save करें

### Step 4: Test Call

1. Server running: `npm start`
2. Browser: `http://localhost:3000`
3. PDF upload करें
4. Call send करें
5. Call connect होनी चाहिए! 🎉

---

## 📋 Quick Commands

### Manual ngrok (Project Folder में):
```powershell
# Download ngrok.exe और project folder में रखें
# फिर:
.\ngrok.exe http 3000
```

### Render.com (Production):
```powershell
git push origin main
# फिर Render.com में deploy करें
```

---

## ✅ Recommended: Render.com

**Advantages:**
- ✅ No ngrok needed
- ✅ Stable URL (doesn't change)
- ✅ Production ready
- ✅ Free tier available

**Steps:**
1. Git push करें
2. Render.com में deploy करें
3. Service URL copy करें
4. Exotel Dashboard में webhook URL set करें

---

**Choose any option - all will work! 🚀**

