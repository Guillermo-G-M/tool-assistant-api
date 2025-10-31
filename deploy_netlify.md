# Netlify Deployment Guide

Guide for deploying Tool Assistant API on Netlify using serverless functions.

**Netlify Official Documentation:** https://docs.netlify.com/

## Prerequisites

1. Netlify account (create one at https://www.netlify.com/)
2. Git repository with the project
3. Anthropic API key

## Deployment Methods

### Method 1: Deploy via Netlify CLI

1. Install Netlify CLI globally:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize site from project directory:
```bash
cd tool-assistant-api
netlify init
```

4. Configure environment variables:
```bash
netlify env:set ANTHROPIC_API_KEY your_api_key_here
netlify env:set SERVERLESS_ENABLED true
```

5. Deploy to production:
```bash
netlify deploy --prod
```

### Method 2: Deploy via Netlify Dashboard

1. Login to https://app.netlify.com/

2. Click "Add new site" > "Import an existing project"

3. Connect your Git repository (GitHub, GitLab, or Bitbucket)

4. Configure build settings:
   - **Build command:** `npm install`
   - **Publish directory:** `.`
   - **Functions directory:** `netlify/functions`

5. Add environment variables in Site settings > Environment variables:
   - `ANTHROPIC_API_KEY`: Your Anthropic API key
   - `SERVERLESS_ENABLED`: `true`

6. Click "Deploy site"

## Configuration

The `netlify.toml` file contains all deployment configuration:

```toml
[build]
  command = "npm install"
  functions = "netlify/functions"
  publish = "."

[functions]
  node_bundler = "esbuild"
  external_node_modules = ["@anthropic-ai/sdk"]
```

### Redirects

The following URL redirects are configured:

- `/exec_function` → `/.netlify/functions/exec_function`
- `/health` → `/.netlify/functions/health`
- `/api/*` → `/.netlify/functions/:splat`

## Serverless Mode

When `SERVERLESS_ENABLED=true`, the application runs in serverless mode using Netlify Functions instead of Express server.

**Serverless Functions:**
- `netlify/functions/exec_function.js` - Main AI assistant endpoint
- `netlify/functions/health.js` - Health check endpoint

## Usage After Deployment

Your API will be available at: `https://your-site-name.netlify.app`

### Endpoint: POST /exec_function

**Request:**
```bash
curl -X POST https://your-site-name.netlify.app/exec_function \
  -H "Content-Type: application/json" \
  -d '{"transcription": "change the language to spanish"}'
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

### Endpoint: GET /health

**Request:**
```bash
curl https://your-site-name.netlify.app/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "API is running OK (Serverless mode)"
}
```

## Local Testing

Test serverless functions locally with Netlify Dev:

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with required variables:
```
ANTHROPIC_API_KEY=your_api_key_here
SERVERLESS_ENABLED=true
```

3. Start Netlify Dev:
```bash
netlify dev
```

4. Access local endpoints:
   - http://localhost:8888/exec_function
   - http://localhost:8888/health

## Troubleshooting

**Function not found:**
- Verify `netlify/functions/` directory exists
- Check function files have `.js` extension
- Ensure functions export `handler` function

**Environment variables not working:**
- Verify variables are set in Netlify dashboard
- Redeploy site after adding new variables
- Check variable names match exactly

**Build fails:**
- Check Node.js version compatibility
- Verify all dependencies in `package.json`
- Review build logs in Netlify dashboard

**API errors:**
- Verify `ANTHROPIC_API_KEY` is valid
- Check function logs in Netlify dashboard
- Test endpoints with proper JSON format

## Monitoring

Monitor your deployment:

1. **Function logs:** Site settings > Functions > Function logs
2. **Deploy logs:** Deploys > Click on specific deploy
3. **Analytics:** Analytics tab in dashboard

## Custom Domain

To use a custom domain:

1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 48 hours)

## Rollback

Rollback to previous deployment:

1. Go to Deploys tab
2. Find the working deployment
3. Click "Publish deploy" on that version
