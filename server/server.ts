import express, { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 3001; // Or any other port you prefer

// Use absolute path for db.json that works in both development and production
const dbPath = path.join(process.cwd(), 'db.json');

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Parse JSON request bodies

// Helper function to read data from db.json
const readData = async (): Promise<any[]> => {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    // If the file doesn't exist or is empty, return an empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading database file:', error);
    throw error; // Re-throw other errors
  }
};

// Helper function to write data to db.json
const writeData = async (data: any[]): Promise<void> => {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to database file:', error);
    throw error;
  }
};

// --- API Endpoints ---

// GET /api/data - Retrieve all data
app.get('/api/data', async (req: Request, res: Response) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving data' });
  }
});

// POST /api/data - Add or update data (example: replace entire dataset)
// You might want more specific endpoints (e.g., POST /api/items, PUT /api/items/:id)
app.post('/api/data', async (req: Request, res: Response) => {
  try {
    const newData = req.body;
    // Basic validation: check if it's an array (adjust as needed)
    if (!Array.isArray(newData)) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array.' });
    }
    await writeData(newData);
    res.status(201).json({ message: 'Data saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving data' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
