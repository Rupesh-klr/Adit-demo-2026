const mongoose = require('mongoose');

const connectDatabase = async (MONGO_URI, options = {}) => {
  if (!MONGO_URI) throw new Error('MONGO_URI is required to connect to database');
  await mongoose.connect(MONGO_URI, Object.assign({ maxPoolSize: 5, minPoolSize: 2 }, options));
};

module.exports = { connectDatabase };
