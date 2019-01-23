const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

const userSchema = new Schema({

  method: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    required: true
  },
  local: {
    email: {
      type: String,
//       required: true,
//       unique: true,
     lowercase: true
    },
    password: {
      type: String,
//       required: true
    }
  },
  google: {

    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },

  facebook: {

    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }

  }
})

userSchema.pre('save', async function(next) {
  try {

    if(this.method !== 'local') {
      next()
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(this.local.password, salt)

    this.local.password = passwordHash

    next()
    
  } catch (error) {
    next(error)
    
  }
})

userSchema.methods.isValidPassword = async function(newPassword) {
  try {

    console.log('newPassword', newPassword)
    console.log('this.local.password', this.local.password)

    return await bcrypt.compare(newPassword, this.local.password)
    
  } catch (error) {
    throw new Error(error)
  }
}

const User = mongoose.model('user', userSchema)

module.exports = User
