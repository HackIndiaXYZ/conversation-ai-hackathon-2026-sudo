import express from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDb, ObjectId } from '../config/database.js'
import { generateToken } from '../middleware/auth.js'

const router = express.Router()
const users = () => getDb().collection('users')

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

const DEFAULT_AVATAR = {
  skin: '#FAD4A6',
  skinShade: '#F0B07A',
  hair: '#3A2A1A',
  hairStyle: 'long',
  eye: '#2C1A0E',
  lip: '#C0704A',
  acc: 'none',
  theme: 'light',
  avatarType: 'human',
}

// Register
router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate,
  ],
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body

      const existingUser = await users().findOne({ email })
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const avatar = { ...DEFAULT_AVATAR }
      const userDoc = {
        name,
        email,
        password: hashedPassword,
        avatar,
        createdAt: new Date(),
      }

      const result = await users().insertOne(userDoc)
      const user = {
        id: result.insertedId.toString(),
        name,
        email,
        avatar,
      }
      res.status(201).json({
        message: 'User registered successfully',
        user,
      })
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'User already exists with this email' })
      }
      next(error)
    }
  }
)

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  async (req, res, next) => {
    try {
      const { email, password } = req.body
      const user = await users().findOne({ email })

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const token = generateToken(user._id.toString())

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      })
    } catch (error) {
      next(error)
    }
  }
)

// Get current user
router.get('/me', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecret')
    if (!decoded.userId || !ObjectId.isValid(decoded.userId)) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const user = await users().findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } }
    )

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Update user avatar preferences
router.put('/avatar', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecret')
    if (!decoded.userId || !ObjectId.isValid(decoded.userId)) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const update = await users().findOneAndUpdate(
      { _id: new ObjectId(decoded.userId) },
      { $set: { avatar: req.body } },
      { returnDocument: 'after', projection: { password: 0 } }
    )

    if (!update.value) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      message: 'Avatar updated successfully',
      avatar: update.value.avatar,
    })
  } catch (error) {
    next(error)
  }
})

export default router
