import express from 'express'
import { getDb, ObjectId } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const chats = () => getDb().collection('chats')

const getUserObjectId = (userId) => {
  if (userId === 'guest') return null
  return ObjectId.isValid(userId) ? new ObjectId(userId) : null
}

const getChatObjectId = (chatId) => ObjectId.isValid(chatId) ? new ObjectId(chatId) : null

router.use(authenticate)

router.get('/', async (req, res, next) => {
  try {
    const userId = getUserObjectId(req.user.userId)
    if (!userId) {
      return res.json({ chats: [] })
    }

    const results = await chats()
      .find({ userId, isArchived: false })
      .sort({ updatedAt: -1 })
      .project({ title: 1, createdAt: 1, updatedAt: 1 })
      .toArray()

    res.json({ chats: results.map((chat) => ({
      _id: chat._id.toString(),
      title: chat.title,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    })) })
  } catch (error) {
    next(error)
  }
})

router.get('/:chatId', async (req, res, next) => {
  try {
    const userId = getUserObjectId(req.user.userId)
    const chatId = getChatObjectId(req.params.chatId)

    if (!userId || !chatId) {
      return res.status(404).json({ error: 'Chat not found' })
    }

    const chat = await chats().findOne({ _id: chatId, userId })
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' })
    }

    res.json({
      chat: {
        _id: chat._id.toString(),
        userId: chat.userId.toString(),
        title: chat.title,
        messages: chat.messages,
        isArchived: chat.isArchived,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      },
    })
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const userId = getUserObjectId(req.user.userId)
    if (!userId) {
      return res.status(403).json({ error: 'Guest users cannot create chats' })
    }

    const { title = 'New Chat' } = req.body
    const now = new Date()
    const result = await chats().insertOne({
      userId,
      title,
      messages: [],
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    })

    res.status(201).json({
      chat: {
        _id: result.insertedId.toString(),
        title,
        createdAt: now,
        updatedAt: now,
      },
    })
  } catch (error) {
    next(error)
  }
})

router.patch('/:chatId', async (req, res, next) => {
  try {
    const userId = getUserObjectId(req.user.userId)
    const chatId = getChatObjectId(req.params.chatId)
    const { title } = req.body

    if (!userId || !chatId) {
      return res.status(404).json({ error: 'Chat not found' })
    }

    const result = await chats().findOneAndUpdate(
      { _id: chatId, userId },
      { $set: { title, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )

    if (!result.value) {
      return res.status(404).json({ error: 'Chat not found' })
    }

    res.json({
      chat: {
        _id: result.value._id.toString(),
        userId: result.value.userId.toString(),
        title: result.value.title,
        createdAt: result.value.createdAt,
        updatedAt: result.value.updatedAt,
      },
    })
  } catch (error) {
    next(error)
  }
})

router.delete('/:chatId', async (req, res, next) => {
  try {
    const userId = getUserObjectId(req.user.userId)
    const chatId = getChatObjectId(req.params.chatId)

    if (!userId || !chatId) {
      return res.status(404).json({ error: 'Chat not found' })
    }

    const result = await chats().deleteOne({ _id: chatId, userId })
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Chat not found' })
    }

    res.json({ message: 'Chat deleted successfully' })
  } catch (error) {
    next(error)
  }
})

router.post('/:chatId/archive', async (req, res, next) => {
  try {
    const userId = getUserObjectId(req.user.userId)
    const chatId = getChatObjectId(req.params.chatId)

    if (!userId || !chatId) {
      return res.status(404).json({ error: 'Chat not found' })
    }

    const result = await chats().findOneAndUpdate(
      { _id: chatId, userId },
      { $set: { isArchived: true, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )

    if (!result.value) {
      return res.status(404).json({ error: 'Chat not found' })
    }

    res.json({ message: 'Chat archived successfully' })
  } catch (error) {
    next(error)
  }
})

export default router
