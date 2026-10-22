/**
 * models/User.js
 * Mongoose schema for user accounts.
 * passwordHash is never returned in normal API responses via .toJSON() transform.
 */
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name must be 80 characters or fewer'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,   // Normalize on save
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email is invalid'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,     // Never included in query results by default
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.passwordHash   // Belt-and-suspenders: never expose hash
        delete ret.__v
        return ret
      },
    },
  }
)

export const User = mongoose.model('User', userSchema)
