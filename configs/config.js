// Default configuration for the assistant AI
// You can modify this file to customize the behavior of the assistant
import tools from './tools.js';

const MODEL = 'claude-haiku-4-5-20251001';
const SYSTEM_PROMPT = `You are an assistant tasked with executing only the tool functions you have defined.`;
const MAX_TOKENS = 1024;
const TOOLS = tools;

export const config = {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    tools: TOOLS,
    system: SYSTEM_PROMPT
};

export const showResponseLogs = false;
