import mongoose from 'mongoose';

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('MONGO_URI is not set. Check your .env file (see .env.example).');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (err) {
    // The DB is a required dependency here — if we can't reach it, don't
    // pretend to be a healthy server. Fail fast and loudly instead.
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

export default connectDB;