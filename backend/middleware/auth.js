import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token || token === 'undefined') {
      return res.status(401).json({ error: 'Access denied. No token provided.' })
    }

    if (token === 'null') {
      req.user = { userId: 'guest' }
      return next()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecret')
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallbacksecret', {
    expiresIn: '7d',
  })
}
