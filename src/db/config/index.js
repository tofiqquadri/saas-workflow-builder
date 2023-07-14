const mongoose = require('mongoose');
const MongoDb = process.env.MONGODB_URL;

if (!MongoDb) {
    throw new Error(
        'Please define the MONGODB_URL environment variable inside .env.local'
    );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true
        };

        cached.promise = mongoose
            .connect(MongoDb, opts)
            .then((mongoose) => {
                console.log('db success connect');
                return mongoose;
            }).catch(error => {
                console.log('error connecting to DB', error);
            });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

module.exports = dbConnect;
