# Tool Assistant API

API of AI assistant for voice commands using Anthropic SDK.

**Anthropic SDK Official Documentation:** https://github.com/anthropics/anthropic-sdk-typescript

## Configuration

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
PORT=3000
ANTHROPIC_API_KEY=your_api_key_here
```

3. Start server:
```bash
npm start
```

## Usage

### Endpoint: POST /exec_function

Receive a voice transcription and return the command to execute.

**Request:**
```json
{
  "transcription": "change the language to spanish"
}
```

**Response:**
```json
{
  "success": true,
  "function": "change_lang",
  "parameters": {
    "lang": "es"
  }
}
```

