# 🚀 Step-by-Step Run & Test Guide - PDF Q&A Voicebot

## 📋 Prerequisites

### Required Accounts & Keys:

1. **Exotel Account** ✅ (Already configured)
2. **ElevenLabs API Key** ✅ (Already configured)
3. **OpenAI API Key** ⚠️ (NEW - Required for Q&A and STT)
   - Get from: https://platform.openai.com/api-keys
   - Create account if needed
   - Add credits to account

---

## 🔧 Step 1: Install Dependencies

```powershell
npm install
```

**Expected:** All packages installed successfully

---

## 🔑 Step 2: Environment Variables Setup

`.env` file में यह variables add करें:

```env
# Exotel Configuration (Already set)
EXOTEL_API_KEY=your_exotel_api_key
EXOTEL_API_TOKEN=your_exotel_api_token
EXOTEL_SID=troikaplus1
EXOTEL_APP_ID=1117620
EXOTEL_CALLER_ID=07948516111
EXOTEL_SUBDOMAIN=api.exotel.com

# TTS Configuration (Already set)
TTS_PROVIDER=elevenlabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
GREETING_TEXT=Hello! Thank you for calling. How can I help you today?

# NEW: OpenAI Configuration (Required for Q&A and STT)
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-3.5-turbo

# Server Configuration
NODE_ENV=production
PORT=3000
WEBHOOK_BASE_URL=https://one-calling-agent.onrender.com
WS_PATH=/voice-stream
```

**Important:**
- `OPENAI_API_KEY` - **Required** (Get from OpenAI dashboard)
- OpenAI account में credits add करें

---

## 🚀 Step 3: Start Server

```powershell
npm start
```

**Expected Output:**
```
🚀 Exotel Voicebot Caller Server running on port 3000
📞 POST /call to initiate a call
🔌 WebSocket Server: ws://localhost:3000/voice-stream
📡 Voicebot Connect: http://localhost:3000/api/v1/exotel/voice/connect
```

---

## 🌐 Step 4: Open Web UI

Browser में खोलें:

```
http://localhost:3000
```

**UI दिखेगा:**
- PDF Upload section
- Call Configuration section
- Active Calls section

---

## 📄 Step 5: Upload PDF

### 5.1 UI में Upload:

1. Browser में `http://localhost:3000` खोलें
2. **"PDF Upload"** section में:
   - PDF file select करें (click या drag & drop)
   - File info दिखेगा
3. **"Upload PDF"** button click करें
4. Success message दिखेगा:
   - ✅ PDF uploaded successfully!
   - PDF ID दिखेगा
   - PDF content preview दिखेगा

### 5.2 Expected Response:

```json
{
  "success": true,
  "pdfId": "pdf_1234567890_abc123",
  "content": "...",
  "numPages": 5,
  "textLength": 5000
}
```

---

## 📞 Step 6: Send Call with PDF

### 6.1 UI से:

1. **"Call Configuration"** section में:
   - **Exotel Phone Number:** `07948516111` (या अपना)
   - **Target Phone Number:** `+919324606985` (या test number)
2. **"Send Call"** button click करें
3. Call initiate होगी

### 6.2 Expected Response:

```json
{
  "success": true,
  "callSid": "xxxxx",
  "message": "Call initiated successfully to +919324606985",
  "pdfId": "pdf_1234567890_abc123"
}
```

---

## 🎯 Step 7: Test Call Flow

### 7.1 Call Connect होगी:

1. Phone ring होगी
2. Call answer करें

### 7.2 Greeting Play होगी:

- AI-generated greeting (PDF content based)
- या default greeting
- Example: "Hello! Thank you for calling. I can answer questions about the document. How can I help you?"

### 7.3 Ask Question:

- PDF के बारे में question पूछें
- Example: "What is this document about?"
- या: "Tell me about the main points"

### 7.4 AI Answer:

- AI PDF content के based पर answer देगा
- Answer audio में play होगी
- Conversation continue होगी

---

## 📊 Step 8: Check Logs

### Server Logs में देखें:

```
📞 Voicebot connect webhook received
   CustomField: pdf_1234567890_abc123

📞 New Exotel WebSocket connection
   Custom Field: pdf_1234567890_abc123
   📄 PDF linked: pdf_1234567890_abc123 (5000 chars)

🎙️ Starting greeting synthesis...
   📄 Using AI-generated greeting based on PDF

🎤 Processing speech (16000 bytes)...
   📝 User said: "What is this document about?"
   🤖 AI Answer: "This document is about..."
✅ Response sent to user
```

---

## 🧪 Step 9: Complete Test Flow

### Test Scenario:

1. ✅ **PDF Upload:**
   - Test PDF upload करें
   - Content preview check करें

2. ✅ **Call Send:**
   - Call send करें
   - Call connect verify करें

3. ✅ **Greeting:**
   - Greeting play होनी चाहिए
   - PDF-based greeting होनी चाहिए

4. ✅ **Question 1:**
   - "What is this document about?" पूछें
   - AI answer सुनें

5. ✅ **Question 2:**
   - "Tell me the main points" पूछें
   - AI answer सुनें

6. ✅ **Question 3:**
   - Specific question पूछें
   - AI PDF content के based पर answer देगा

---

## ❌ Troubleshooting

### Problem 1: PDF Upload Fails

**Check:**
- File size < 10MB
- File is valid PDF
- Server logs for errors
- `pdf-parse` package installed

### Problem 2: OpenAI API Error

**Check:**
- `OPENAI_API_KEY` set है
- OpenAI account में credits हैं
- API key valid है

### Problem 3: STT Not Working

**Check:**
- `OPENAI_API_KEY` set है
- Audio format correct है (PCM 8kHz)
- Enough audio accumulated है (1+ seconds)

### Problem 4: AI Answers Not Accurate

**Check:**
- PDF content properly extracted है
- PDF content relevant है
- OpenAI API working है

### Problem 5: Greeting Not Playing

**Check:**
- Previous fixes applied हैं
- ElevenLabs API key valid है
- Server logs check करें

---

## 📋 Complete Test Checklist

- [ ] Dependencies installed
- [ ] Environment variables set (including `OPENAI_API_KEY`)
- [ ] Server started successfully
- [ ] UI accessible at `http://localhost:3000`
- [ ] PDF upload tested
- [ ] PDF content preview working
- [ ] Call send tested
- [ ] Call connects successfully
- [ ] Greeting plays (PDF-based)
- [ ] User question detected (STT working)
- [ ] AI answer generated
- [ ] Answer plays (TTS working)
- [ ] Conversation continues

---

## 🎉 Success Indicators

अगर सब कुछ सही है:

1. ✅ PDF upload successful
2. ✅ Call initiates successfully
3. ✅ Greeting plays (PDF-based)
4. ✅ User questions detected
5. ✅ AI answers based on PDF
6. ✅ Answers play correctly
7. ✅ Conversation flows naturally

---

## 🚀 Production Deployment

### Render Dashboard में Environment Variables:

```env
# Add OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-3.5-turbo
```

### Deploy Steps:

1. Git push करें
2. Render auto-deploy होगा
3. Environment variables verify करें
4. Test करें

---

## 📝 API Testing (Optional)

### Upload PDF:
```powershell
curl -X POST http://localhost:3000/api/upload-pdf -F "pdf=@test.pdf"
```

### Send Call:
```powershell
curl -X POST http://localhost:3000/api/send-call -H "Content-Type: application/json" -d "{\"to\": \"+919324606985\", \"from\": \"07948516111\", \"pdfId\": \"pdf_xxxxx\"}"
```

### Get Active Calls:
```powershell
curl http://localhost:3000/api/active-calls
```

---

**System ready! Test करें और enjoy करें! 🎉**

