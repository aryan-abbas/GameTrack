const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Replace YOUR_PASSWORD_HERE with your actual MongoDB password (no angle brackets!)
const MONGO_URI = "mongodb+srv://a:1234aa@cluster0.qm1cakv.mongodb.net/?appName=Cluster0";
const client = new MongoClient(MONGO_URI);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('gameTracker');
    console.log('✅ Connected to MongoDB Atlas');
    console.log('📊 Database ready: gameTracker');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

// Get all games
app.get('/api/games', async (req, res) => {
  try {
    const games = await db.collection('games').find().toArray();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// Add game
app.post('/api/games', async (req, res) => {
  try {
    const result = await db.collection('games').insertOne(req.body);
    res.json({ ...req.body, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add game' });
  }
});

// Update game
app.put('/api/games/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('games').updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update game' });
  }
});

// Delete game
app.delete('/api/games/:id', async (req, res) => {
  try {
    await db.collection('games').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

connectDB().then(() => {
  app.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
  });
});