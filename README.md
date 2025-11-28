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

### Custom Configuration


**Architecture:**
- `configs/assistant-config.json` - Configuration data file (ignored by git)
- `configs/assistant-config.default.json` - Default configuration template
- `configs/config.js` - Logic module that reads and exports the JSON data

#### How it works:

1. **On first install**: The `postinstall` script automatically copies `assistant-config.default.json` to `assistant-config.json`
2. **On subsequent installs**: Existing `assistant-config.json` is preserved (not overwritten)
3. **Each developer can modify** their local `assistant-config.json` without affecting the repository
4. **The logic module** (`config.js`) reads the JSON file and exports the configuration for the application

#### Customizing your configuration:

Edit `configs/assistant-config.json` to change settings:
```json
{
  "model": "claude-opus-4-20250514",
  "max_tokens": 2048,
  "system": "Your custom system prompt...",
  "showResponseLogs": true,
  "tools": [
    {
      "name": "my_custom_tool",
      "description": "My custom tool description",
      "input_schema": {
        "type": "object",
        "properties": {
          "param": {
            "type": "string",
            "description": "Parameter description"
          }
        },
        "required": ["param"]
      }
    }
  ]
}
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

