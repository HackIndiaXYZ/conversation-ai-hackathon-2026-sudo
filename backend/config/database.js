import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/avatar_chatbot'
let client
let db

const getDatabaseName = (connectionString) => {
  try {
    const safeUri = connectionString.startsWith('mongodb+srv://')
      ? connectionString.replace('mongodb+srv://', 'mongodb://')
      : connectionString
    const url = new URL(safeUri)
    return url.pathname?.replace(/^\//, '') || 'avatar_chatbot'
  } catch {
    return 'avatar_chatbot'
  }
}

const connectDB = async () => {
  try {
    client = new MongoClient(uri)
    await client.connect()

    const dbName = getDatabaseName(uri)
    db = client.db(dbName)

    await db.collection('users').createIndex({ email: 1 }, { unique: true })
    await db.collection('chats').createIndex({ userId: 1 })

    console.log(`MongoDB Connected: ${dbName}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

const getDb = () => {
  if (!db) {
    throw new Error('Database not connected')
  }
  return db
}

export { connectDB, getDb, ObjectId }
