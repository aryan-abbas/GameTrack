const { MongoClient } = require('mongodb');

let cachedDb = null;
let cachedClient = null;

async function connectToDatabase() {
  // Return cached connection if available
  if (cachedDb && cachedClient) {
    return { db: cachedDb, client: cachedClient };
  }

  // Get MongoDB URI from environment variable (try multiple names)
  const uri = process.env.MONGODB_URI || 
              process.env.MONGO_URI || 
              process.env.MONGO_URL || 
              process.env.DATABASE_URL ||
              process.env.MONGODB_CONNECTION_STRING;
  
  if (!uri) {
    console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('MONGO') || k.includes('DATABASE')));
    throw new Error('MongoDB URI environment variable is not set. Checked: MONGODB_URI, MONGO_URI, MONGO_URL, DATABASE_URL');
  }

  console.log('🔗 Connecting to MongoDB...');

  // Create new connection
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const dbName = new URL(uri).pathname.slice(1).split('?')[0] || 'gameTracker';
  const db = client.db(dbName);
  
  // Cache the connection
  cachedDb = db;
  cachedClient = client;

  console.log(`✅ Connected to MongoDB Atlas - Database: ${dbName}`);
  
  return { db, client };
}

module.exports = { connectToDatabase };
