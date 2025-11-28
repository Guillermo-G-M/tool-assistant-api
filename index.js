import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { executeFunction } from './assistant.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const SERVERLESS_ENABLED = process.env.SERVERLESS_ENABLED === 'true';

if (SERVERLESS_ENABLED) {
  console.log('Serverless mode enabled. Server will not start.');
  console.log('Deploy to Netlify to use serverless functions.');
} else {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  app.post('/exec_function', async (req, res) => {
    try {
      const { transcription } = req.body;

      if (!transcription) {
        return res.status(400).json({ error: 'Missing transcription' });
      }

      const result = await executeFunction(transcription);

      res.json(result);
    } catch (error) {
      console.error('Error in /exec_function:', error);
      res.status(500).json({ error: 'Error processing the request' });
    }
  });

  app.post('/update_config', async (req, res) => {
    try {
      const config = req.body;

      if (!config.model || !config.max_tokens || !config.system || !config.tools) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['model', 'max_tokens', 'system', 'tools']
        });
      }

      if (!Array.isArray(config.tools)) {
        return res.status(400).json({ error: 'tools must be an array' });
      }

      const configPath = join(__dirname, 'configs', 'assistant-config.json');
      writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

      res.json({
        success: true,
        message: 'Configuration updated successfully'
      });
    } catch (error) {
      console.error('Error in /update_config:', error);
      res.status(500).json({ error: 'Error updating configuration' });
    }
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running OK' });
  });

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
