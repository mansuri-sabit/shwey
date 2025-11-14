# 🚀 Complete Setup Guide - PDF Q&A Voicebot System

## 📋 Overview

यह system आपको:
1. PDF upload करने देता है
2. Exotel के through call send करता है
3. Call आने पर PDF content के based पर questions answer करता है
4. Speech-to-Text और AI use करके conversation handle करता है

---

## 🛠️ Step 1: Dependencies Install करें

```powershell
npm install
```

**Installed Packages:**
- `pdf-parse` - PDF text extraction
- `multer` - File upload handling
- `openai` - AI for Q&A
- `form-data` - Form data handling

---

## 🔧 Step 2: Environment Variables Setup

`.env` file में यह variables add करें:

```env
# Existing Exotel Configuration
EXOTEL_API_KEY=your_exotel_api_key
EXOTEL_API_TOKEN=your_exotel_api_token
EXOTEL_SID=troikaplus1
EXOTEL_APP_ID=1117620
EXOTEL_CALLER_ID=07948516111
EXOTEL_SUBDOMAIN=api.exotel.com

# Existing TTS Configuration
TTS_PROVIDER=elevenlabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
GREETING_TEXT=Hello! Thank you for calling. How can I help you today?

# NEW: OpenAI Configuration (for AI Q&A and STT)
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-3.5-turbo

# Server Configuration
NODE_ENV=production
PORT=3000
WEBHOOK_BASE_URL=https://one-calling-agent.onrender.com
WS_PATH=/voice-stream
```

**Important:**
- `OPENAI_API_KEY` - OpenAI API key required (for Q&A and Speech-to-Text)
- Get from: https://platform.openai.com/api-keys

---

## 🚀 Step 3: Server Start करें

```powershell
npm start
```

या development mode में:

```powershell
npm run dev
```

**Expected Output:**
```
🚀 Exotel Voicebot Caller Server running on port 3000
📞 POST /call to initiate a call
🔌 WebSocket Server: ws://localhost:3000/voice-stream
📡 Voicebot Connect: http://localhost:3000/api/v1/exotel/voice/connect
```

---

## 🌐 Step 4: Web UI Access करें

Browser में खोलें:

```
http://localhost:3000
```

**UI Features:**
- 📄 PDF Upload section
- 📞 Call Configuration section
- 📊 Active Calls section

---

## 📝 Step 5: PDF Upload करें

### 5.1 UI में Upload:

1. Browser में `http://localhost:3000` खोलें
2. "PDF Upload" section में:
   - PDF file select करें (या drag & drop)
   - "Upload PDF" button click करें
3. Success message दिखेगा
4. PDF content preview दिखेगा

### 5.2 API से Upload (Optional):

```powershell
curl -X POST http://localhost:3000/api/upload-pdf \
  -F "pdf=@your-file.pdf"
```

---

## 📞 Step 6: Call Send करें

### 6.1 UI से:

1. "Call Configuration" section में:
   - Exotel Phone Number (Caller ID) enter करें
   - Target Phone Number enter करें
2. "Send Call" button click करें
3. Call initiate होगी

### 6.2 API से (Optional):

```powershell
curl -X POST http://localhost:3000/api/send-call \
  -H "Content-Type: application/json" \
  -d "{\"to\": \"+919324606985\", \"from\": \"07948516111\", \"pdfId\": \"pdf_xxxxx\"}"
```

---

## 🎯 Step 7: Call Flow

### When Call Connects:

1. **Greeting Plays:**
   - AI-generated greeting based on PDF content
   - या default greeting

2. **User Speaks:**
   - Audio captured
   - Speech-to-Text converts to text
   - Question extracted

3. **AI Answers:**
   - Question analyzed against PDF content
   - Answer generated using OpenAI
   - Answer converted to speech (ElevenLabs)
   - Audio streamed to user

4. **Conversation Continues:**
   - User can ask multiple questions
   - Each question answered based on PDF

---

## 🧪 Step 8: Testing

### 8.1 Local Testing:

1. **Start Server:**
   ```powershell
   npm start
   ```

2. **Open UI:**
   ```
   http://localhost:3000
   ```

3. **Upload PDF:**
   - Test PDF upload करें
   - Content preview check करें

4. **Send Test Call:**
   - Your phone number enter करें
   - Call send करें

5. **Test Conversation:**
   - Call answer करें
   - Greeting सुनें
   - PDF के बारे में question पूछें
   - Answer सुनें

### 8.2 Check Logs:

Server logs में देखें:

```
📄 PDF linked: pdf_xxxxx (5000 chars)
🎙️ Starting greeting synthesis...
🎤 Processing speech (16000 bytes)...
📝 User said: "What is this document about?"
🤖 AI Answer: "This document is about..."
✅ Response sent to user
```

---

## 📊 API Endpoints

### 1. Upload PDF
```
POST /api/upload-pdf
Content-Type: multipart/form-data
Body: { pdf: File }

Response: {
  success: true,
  pdfId: "pdf_xxxxx",
  content: "...",
  numPages: 5
}
```

### 2. Send Call
```
POST /api/send-call
Content-Type: application/json
Body: {
  to: "+919324606985",
  from: "07948516111",
  pdfId: "pdf_xxxxx"
}

Response: {
  success: true,
  callSid: "xxxxx",
  pdfId: "pdf_xxxxx"
}
```

### 3. Get Active Calls
```
GET /api/active-calls

Response: {
  calls: [
    {
      callId: "call_xxxxx",
      status: "active",
      pdfId: "pdf_xxxxx"
    }
  ]
}
```

### 4. Get PDF Content
```
GET /api/pdf/:pdfId

Response: {
  pdfId: "pdf_xxxxx",
  content: "...",
  numPages: 5
}
```

---

## 🔍 Troubleshooting

### Problem 1: PDF Upload Fails

**Check:**
- File size < 10MB
- File is valid PDF
- Server logs for errors

### Problem 2: STT Not Working

**Check:**
- `OPENAI_API_KEY` set है
- OpenAI account में credits हैं
- Audio format correct है (PCM 8kHz)

### Problem 3: AI Answers Not Accurate

**Check:**
- PDF content properly extracted है
- OpenAI API key valid है
- PDF content relevant है

### Problem 4: Greeting Not Playing

**Check:**
- Previous greeting fixes applied हैं
- ElevenLabs API key valid है
- Server logs check करें

---

## 📋 Complete Flow Diagram

```
1. User Uploads PDF
   ↓
2. PDF Parsed & Stored
   ↓
3. User Sends Call (with PDF ID)
   ↓
4. Call Connects
   ↓
5. Greeting Plays (AI-generated from PDF)
   ↓
6. User Asks Question
   ↓
7. Speech-to-Text (OpenAI Whisper)
   ↓
8. AI Answers (OpenAI GPT based on PDF)
   ↓
9. Text-to-Speech (ElevenLabs)
   ↓
10. Answer Streamed to User
   ↓
11. Repeat steps 6-10 for conversation
```

---

## ✅ Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables set (especially `OPENAI_API_KEY`)
- [ ] Server started successfully
- [ ] UI accessible at `http://localhost:3000`
- [ ] PDF upload tested
- [ ] Call send tested
- [ ] Greeting plays correctly
- [ ] STT working (user speech detected)
- [ ] AI answers working (questions answered)
- [ ] Conversation flow working

---

## 🎉 Success!

अगर सब कुछ सही है:

1. ✅ PDF upload होगा
2. ✅ Call send होगी
3. ✅ Greeting play होगी (PDF-based)
4. ✅ User questions सुने जाएंगे
5. ✅ AI answers दिए जाएंगे (PDF content based)
6. ✅ Conversation continue होगी

---

**System ready! Test करें और enjoy करें! 🚀**

