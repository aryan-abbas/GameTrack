const { connectToDatabase } = require('./_db');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Connect to database
    const { db } = await connectToDatabase();
    const games = db.collection('games');

    // GET - Fetch all games
    if (req.method === 'GET') {
      const allGames = await games.find({}).toArray();
      return res.status(200).json(allGames);
    }

    // POST - Add new game
    if (req.method === 'POST') {
      const gameData = req.body;
      const result = await games.insertOne(gameData);
      return res.status(201).json({ ...gameData, _id: result.insertedId });
    }

    // PUT - Update existing game
    if (req.method === 'PUT') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Game ID is required' });
      }

      const updateData = req.body;
      await games.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      
      return res.status(200).json({ success: true });
    }

    // DELETE - Remove game
    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Game ID is required' });
      }

      await games.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    }

    // Method not allowed
    res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};