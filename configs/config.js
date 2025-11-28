// Configuration module
// This module reads the assistant-config.json file and exports the configuration
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configPath = join(__dirname, 'assistant-config.json');
const configData = JSON.parse(readFileSync(configPath, 'utf-8'));

export const config = (userMessage) => {
    return {
        model: configData.model,
        max_tokens: configData.max_tokens,
        tools: configData.tools,
        system: configData.system,
        messages: [
            {
                role: 'user',
                content: userMessage
            }
        ]
    }
};

export const showResponseLogs = configData.showResponseLogs;
