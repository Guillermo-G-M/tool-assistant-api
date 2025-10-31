import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { executeFunction } from './assistant.js';

dotenv.config();

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

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running OK' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
