import { writeFileSync } from 'fs';
import { join } from 'path';

export async function handler(event, context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle OPTIONS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const config = JSON.parse(event.body);

    if (!config.model || !config.max_tokens || !config.system || !config.tools) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        body: JSON.stringify({
          error: 'Missing required fields',
          required: ['model', 'max_tokens', 'system', 'tools']
        })
      };
    }

    if (!Array.isArray(config.tools)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        body: JSON.stringify({ error: 'tools must be an array' })
      };
    }

    const configPath = join(process.cwd(), 'configs', 'assistant-config.json');
    writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify({
        success: true,
        message: 'Configuration updated successfully'
      })
    };
  } catch (error) {
    console.error('Error in update_config:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify({ error: 'Error updating configuration' })
    };
  }
}
