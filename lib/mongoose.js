const mongoose = require('mongoose');
// initialize server-side DNS settings early
try { require('./dns'); } catch (e) { /* noop if not available */ }

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.warn('MONGODB_URI not set. Set it in .env.local');
}

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = dbConnect;
