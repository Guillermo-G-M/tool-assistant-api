import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { config, showResponseLogs } from './configs/config.js';
import fileCache from './configs/cache.js';

dotenv.config();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Processes the user message using the cache or calling the Anthropic API.
 * @param {string} userMessage - The user prompt (voice transcription).
 * @returns {Promise<object>} The result of the action to execute.
 */
export async function executeFunction(userMessage) {

  //verify cache
  const cachedResult = await fileCache.get(userMessage).catch(err => {
    console.error('Error executing fileCache.get');
    return null;
  });
  if (cachedResult) return cachedResult;

 try {
  const response = await client.messages.create(config(userMessage));

  if (showResponseLogs) console.log('Assistant response:', JSON.stringify(response, null, 2));
    
  const toolUseBlock = response.content.find(block => block.type === 'tool_use');

  let result;

  if (toolUseBlock) {
   if (toolUseBlock.name === 'cannot_perform_action') {
    result = {
     success: false,
     error_type: 'not_available',
     message: `Cannot perform: ${toolUseBlock.input.requested_action}`
    };
   } else {
    result = {
     success: true,
     function: toolUseBlock.name,
     parameters: toolUseBlock.input
    };
   }
  } else {
   const textBlock = response.content.find(block => block.type === 'text');
   result = {
    success: false,
    error_type: 'not_recognized',
    message: textBlock ? textBlock.text : 'Command not recognized'
   };
  }

  // Save to cache
  if (result.success && result.function) {
    fileCache.set(userMessage, result).catch(err => {
      console.error('Error executing fileCache.set');
    });
  }

  return result;
    
 } catch (error) {
  console.error('Error in executeFunction:', error);
  return {
   success: false,
   error_type: 'api_error',
   message: 'Error during prompt processing'
  };
 }
}
