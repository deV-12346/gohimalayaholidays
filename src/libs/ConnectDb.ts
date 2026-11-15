import mongoose from "mongoose"

// Cache the connection on `globalThis` so Next.js hot reloads (dev) and
// serverless invocations reuse one connection instead of opening new ones.
interface MongooseCache {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
}
const globalWithMongoose = globalThis as typeof globalThis & {
    _mongooseCache?: MongooseCache
}
const cache: MongooseCache = (globalWithMongoose._mongooseCache ??= {
    conn: null,
    promise: null,
})

export const connectDb = async () => {
    const uri = process.env.MONGODB_URI
    if (!uri) {
        throw new Error("MONGODB_URI is not set")
    }
    // Re-use only while the driver still reports "connected" (1)
    if (cache.conn && mongoose.connection.readyState === 1) {
        return cache.conn
    }
    if (!cache.promise) {
        cache.promise = mongoose.connect(uri).catch((err) => {
            cache.promise = null // allow a retry on the next request
            throw err
        })
    }
    cache.conn = await cache.promise
    return cache.conn
}
