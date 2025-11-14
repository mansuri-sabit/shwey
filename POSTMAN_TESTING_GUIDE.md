# 📮 Postman में API Call कैसे Test करें

यह guide आपको बताएगी कि Postman में इस project के सभी API endpoints को कैसे test करें।

---

## 🚀 Setup (पहले ये करें)

### 1. Server Start करें

**Local Testing के लिए:**
```bash
npm start
# या
npm run dev
```

Server `http://localhost:3000` पर चलेगा।

**Production/Deployed Server के लिए:**
अगर आपका server Render या किसी और platform पर deployed है, तो उसका URL use करें:
- Example: `https://kkbk-xjhf.onrender.com`

---

## 📋 Postman में API Calls कैसे करें

### **1. Health Check Endpoint**

**GET Request - Server Status Check करने के लिए:**

```
Method: GET
URL: http://localhost:3000/
या
URL: http://localhost:3000/health
```

**Headers:**
- कोई headers की जरूरत नहीं

**Expected Response:**
```json
{
  "status": "ok",
  "service": "Exotel Voicebot Caller",
  "message": "Service is running. Use POST /call to initiate a call."
}
```

**Postman में कैसे करें:**
1. Postman खोलें
2. New Request बनाएं
3. Method: **GET** select करें
4. URL में डालें: `http://localhost:3000/health`
5. **Send** button दबाएं

---

### **2. Call Initiate करने के लिए (Main Endpoint)**

**POST Request - Call करने के लिए:**

```
Method: POST
URL: http://localhost:3000/call
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "to": "+919324606985"
}
```

**Optional Parameters:**
```json
{
  "to": "+919324606985",
  "from": "+919999999999",
  "callLogId": "optional-tracking-id-123"
}
```

**Expected Success Response:**
```json
{
  "success": true,
  "message": "Call initiated successfully to +919324606985",
  "callSid": "63669fcf5ff6697176926937572919bd",
  "data": {
    "Call": {
      "Sid": "63669fcf5ff6697176926937572919bd",
      "Status": "queued"
    }
  }
}
```

**Expected Error Response (अगर configuration missing है):**
```json
{
  "success": false,
  "error": "Missing Exotel configuration. Please set environment variables.",
  "required": [
    "EXOTEL_API_KEY",
    "EXOTEL_API_TOKEN",
    "EXOTEL_SID",
    "EXOTEL_APP_ID",
    "EXOTEL_CALLER_ID"
  ]
}
```

**Postman में कैसे करें:**
1. New Request बनाएं
2. Method: **POST** select करें
3. URL: `http://localhost:3000/call`
4. **Headers** tab में:
   - Key: `Content-Type`
   - Value: `application/json`
5. **Body** tab में:
   - **raw** select करें
   - **JSON** format select करें
   - Body में ये JSON paste करें:
   ```json
   {
     "to": "+919324606985"
   }
   ```
6. **Send** button दबाएं

---

### **3. Active Sessions देखने के लिए**

**GET Request - Currently Active WebSocket Sessions:**

```
Method: GET
URL: http://localhost:3000/voicebot/sessions
```

**Headers:**
- कोई headers की जरूरत नहीं

**Expected Response:**
```json
{
  "total": 2,
  "sessions": [
    {
      "callId": "63669fcf5ff6697176926937572919bd",
      "streamSid": "stream_abc123",
      "connectedAt": "2024-01-15T10:30:00.000Z",
      "lastActivity": "2024-01-15T10:30:05.000Z",
      "sequenceNumber": 45,
      "isActive": true,
      "audioChunksBuffered": 10
    }
  ]
}
```

---

### **4. Call Status Check करने के लिए**

**GET Request - Specific Call की Status:**

```
Method: GET
URL: http://localhost:3000/call/{callSid}
```

**Example:**
```
URL: http://localhost:3000/call/63669fcf5ff6697176926937572919bd
```

**Expected Response:**
```json
{
  "message": "Call status endpoint - implement as needed",
  "callSid": "63669fcf5ff6697176926937572919bd"
}
```

---

### **5. Voicebot Connect Webhook (Exotel से आता है)**

**GET/POST Request - Exotel Voicebot Webhook:**

```
Method: GET या POST
URL: http://localhost:3000/voicebot/connect
या
URL: http://localhost:3000/api/v1/exotel/voice/connect
```

**Query Parameters (GET के लिए):**
```
CallSid=63669fcf5ff6697176926937572919bd
CallFrom=+919324606985
CallTo=07948516111
Direction=outbound-api
CustomField=optional-call-log-id
```

**Body (POST के लिए):**
```json
{
  "CallSid": "63669fcf5ff6697176926937572919bd",
  "CallFrom": "+919324606985",
  "CallTo": "07948516111",
  "Direction": "outbound-api",
  "CustomField": "optional-call-log-id"
}
```

**Expected Response:**
```json
{
  "url": "wss://kkbk-xjhf.onrender.com/voicebot/ws?call_id=63669fcf5ff6697176926937572919bd"
}
```

**Postman में Test करने के लिए:**
1. Method: **GET** या **POST** select करें
2. URL: `http://localhost:3000/voicebot/connect`
3. **Params** tab में (GET के लिए):
   - Key: `CallSid`, Value: `test-call-123`
   - Key: `CallFrom`, Value: `+919324606985`
   - Key: `CallTo`, Value: `07948516111`
   - Key: `Direction`, Value: `outbound-api`
4. **Send** button दबाएं

---

## 🎯 Step-by-Step: Complete Call Flow Test

### Step 1: Health Check
```
GET http://localhost:3000/health
```
✅ Server running है या नहीं check करें

### Step 2: Call Initiate करें
```
POST http://localhost:3000/call
Body: { "to": "+919324606985" }
```
✅ Response में `callSid` note करें

### Step 3: Active Sessions Check करें
```
GET http://localhost:3000/voicebot/sessions
```
✅ Call connect होने के बाद active sessions देखें

---

## 📸 Postman Screenshots Guide

### **POST /call Request Setup:**

1. **Method & URL:**
   ```
   POST http://localhost:3000/call
   ```

2. **Headers Tab:**
   ```
   Content-Type: application/json
   ```

3. **Body Tab (raw, JSON):**
   ```json
   {
     "to": "+919324606985"
   }
   ```

4. **Send करने के बाद Response:**
   - Status: `200 OK`
   - Body में `callSid` और success message दिखेगा

---

## ⚠️ Common Issues & Solutions

### **1. "Cannot GET /call" Error**
**Problem:** GET method use किया है, लेकिन endpoint POST है
**Solution:** Method को **POST** में change करें

### **2. "Missing Exotel configuration" Error**
**Problem:** `.env` file में credentials missing हैं
**Solution:** 
- `.env` file check करें
- सभी required variables set करें:
  - `EXOTEL_API_KEY`
  - `EXOTEL_API_TOKEN`
  - `EXOTEL_SID`
  - `EXOTEL_APP_ID`
  - `EXOTEL_CALLER_ID`

### **3. "Invalid phone number" Error**
**Problem:** Phone number format गलत है
**Solution:** Phone number `+` से start होना चाहिए, example: `+919324606985`

### **4. Connection Refused Error**
**Problem:** Server running नहीं है
**Solution:** 
```bash
npm start
```
Server start करें

### **5. CORS Error (Browser में test करते समय)**
**Problem:** Browser में direct API call कर रहे हैं
**Solution:** Postman use करें (CORS issue नहीं होगा)

---

## 🔧 Postman Collection Setup (Advanced)

### **Environment Variables Setup:**

Postman में Environment बनाकर आसानी से local/production switch कर सकते हैं:

1. Postman में **Environments** tab पर जाएं
2. **+** button दबाकर new environment बनाएं
3. Variables add करें:
   - `base_url`: `http://localhost:3000` (local) या `https://your-app.onrender.com` (production)
   - `test_phone`: `+919324606985`

4. Request में use करें:
   ```
   POST {{base_url}}/call
   Body: { "to": "{{test_phone}}" }
   ```

---

## 📝 Example Postman Collection JSON

आप Postman में Collection import कर सकते हैं:

```json
{
  "info": {
    "name": "Exotel Voicebot API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/health",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["health"]
        }
      }
    },
    {
      "name": "Make Call",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"to\": \"+919324606985\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/call",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["call"]
        }
      }
    },
    {
      "name": "Get Active Sessions",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/voicebot/sessions",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["voicebot", "sessions"]
        }
      }
    }
  ]
}
```

इस JSON को Postman में **Import** करके use कर सकते हैं।

---

## ✅ Testing Checklist

- [ ] Server running है (`GET /health` check करें)
- [ ] `.env` file में सभी credentials set हैं
- [ ] `POST /call` request successful है
- [ ] Response में `callSid` मिल रहा है
- [ ] Call actually connect हो रहा है (phone ring हो रहा है)
- [ ] WebSocket connection establish हो रहा है (`GET /voicebot/sessions` check करें)

---

## 🆘 Help & Support

अगर कोई issue आए:
1. Server logs check करें (console में errors देखें)
2. Postman में Response status code check करें
3. Error message को carefully read करें
4. `.env` file में सभी variables correctly set हैं या नहीं verify करें

---

**Happy Testing! 🚀**


