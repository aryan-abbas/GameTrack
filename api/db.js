const { MongoClient } = require('mongodb');

let cachedDb = null;
let cachedClient = null;

async function connectToDatabase() {
  // Return cached connection if available
  if (cachedDb && cachedClient) {
    return { db: cachedDb, client: cachedClient };
  }

  // Get MongoDB URI from environment variable
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  // Create new connection
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db('gameTracker');
  
  // Cache the connection
  cachedDb = db;
  cachedClient = client;

  console.log('✅ Connected to MongoDB Atlas');
  
  return { db, client };
}

module.exports = { connectToDatabase };