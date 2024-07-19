import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // MongoDB connection string from environment variables
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to prevent multiple connections
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new connection for each request
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
