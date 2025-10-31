import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { config, showResponseLogs } from './configs/config.js';

dotenv.config();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function executeFunction(userMessage) {
  try {

    const response = await client.messages.create({
      ...config,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    if (showResponseLogs) console.log('Assistant response:', JSON.stringify(response, null, 2));

    const toolUseBlock = response.content.find(block => block.type === 'tool_use');

    if (toolUseBlock) {
      // If the assistant indicates that it cannot perform the action
      if (toolUseBlock.name === 'cannot_perform_action') {
        return {
          success: false,
          error_type: 'not_available',
          message: `Cannot perform: ${toolUseBlock.input.requested_action}`
        };
      }

      return {
        success: true,
        function: toolUseBlock.name,
        parameters: toolUseBlock.input
      };
    } else {
      const textBlock = response.content.find(block => block.type === 'text');
      return {
        success: false,
        error_type: 'not_recognized',
        message: textBlock ? textBlock.text : 'Command not recognized'
      };
    }
  } catch (error) {
    console.error('Error in executeFunction:', error);
    return {
      success: false,
      error_type: 'api_error',
      message: 'Error during prompt processing'
    };
  }
}
