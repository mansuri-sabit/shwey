# 🔧 Fix ElevenLabs 401 Error - Step by Step

## ❌ Problem
**Error:** `Request failed with status code 401`
**Details:** `missing_permissions` - API key doesn't have required permissions

## ✅ Solution Steps

### Step 1: Generate New API Key with Proper Permissions

1. **Go to ElevenLabs Dashboard:**
   - Open: https://www.elevenlabs.io
   - Login to your account

2. **Navigate to API Keys:**
   - Click on your **Profile** (top right)
   - Go to **"Profile"** or **"Settings"**
   - Click on **"API Keys"** in left sidebar

3. **Delete Old Key (if needed):**
   - Find the current API key
   - Delete it (optional, but recommended for security)

4. **Create New API Key:**
   - Click **"Create API Key"** button
   - **Name:** Give it a name (e.g., "Exotel Voicebot")
   - **Important:** Make sure all permissions are enabled:
     - ✅ `user_read` (Required)
     - ✅ `text_to_speech` (Required)
     - ✅ Any other permissions you need
   - Click **"Create"**

5. **Copy the New API Key:**
   - **Important:** Copy it immediately (it shows only once!)
   - Format: `sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Update .env File

Open `.env` file and update:

```env
# Old (remove this line)
ELEVENLABS_API_KEY=sk_0df10f9a74f5ce6cb20450a8cc73a9682

# New (replace with your new API key)
ELEVENLABS_API_KEY=your_new_api_key_here
```

**Also make sure:**
```env
TTS_PROVIDER=elevenlabs
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
GREETING_TEXT=Hello! Thank you for calling. How can I help you today?
```

### Step 3: Test the Fix

```powershell
node fix-elevenlabs.js
```

**Expected Output:**
```
✅ API Key is valid!
✅ Voice ID "EXAVITQu4vr4xnSDxMaL" is available!
✅ TTS Test Successful!
```

### Step 4: Test Full Integration

```powershell
node test-elevenlabs.js
```

**Expected Output:**
```
✅ TTS Synthesis Successful!
✅ Audio Conversion Successful!
✅ All tests passed!
```

---

## 🚀 Alternative: Use Default Voice (Quick Fix)

If you want to use a voice that's definitely available:

1. **Update .env:**
```env
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
```

2. **Or use one of these default voices:**
- `EXAVITQu4vr4xnSDxMaL` - Bella (Female)
- `21m00Tcm4TlvDq8ikWAM` - Rachel (Female)
- `AZnzlk1XvdvUeBnXmlld` - Domi (Female)
- `ErXwobaYiN019PkySvjV` - Antoni (Male)

---

## ✅ Verification Checklist

After fixing, verify:

- [ ] New API key generated from ElevenLabs dashboard
- [ ] API key has `user_read` permission
- [ ] `.env` file updated with new API key
- [ ] `node fix-elevenlabs.js` shows all tests passing
- [ ] `node test-elevenlabs.js` shows success
- [ ] Server can start without errors

---

## 🎯 Once Fixed

1. **Start Server:**
   ```powershell
   npm start
   ```

2. **Send Test Call:**
   ```powershell
   node send-call.js +919324606985
   ```

3. **Check Logs:**
   - Should see: `🎙️ TTS synthesis using elevenlabs`
   - Should see: `✅ TTS synthesis complete`
   - Should see: `✅ Greeting audio streamed successfully`

---

## 📞 Still Having Issues?

1. **Check API Key Format:**
   - Should start with `sk_`
   - Should be about 32-40 characters long

2. **Check Account Credits:**
   - Free tier has limited characters/month
   - Go to ElevenLabs dashboard → Usage

3. **Check Voice Availability:**
   - Run `node fix-elevenlabs.js` to see available voices
   - Use a voice from the list

4. **Verify Internet Connection:**
   - Make sure you can access https://api.elevenlabs.io

---

**After fixing, your greeting will work perfectly! 🎉**


