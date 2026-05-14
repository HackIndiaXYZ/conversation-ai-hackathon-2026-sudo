import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  avatar: {
    skin: { type: String, default: '#FAD4A6' },
    skinShade: { type: String, default: '#F0B07A' },
    hair: { type: String, default: '#3A2A1A' },
    hairStyle: { type: String, default: 'long' },
    eye: { type: String, default: '#2C1A0E' },
    lip: { type: String, default: '#C0704A' },
    acc: { type: String, default: 'none' },
    theme: { type: String, default: 'light' },
    avatarType: { type: String, default: 'human' },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model('User', userSchema)
