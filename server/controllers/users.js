const JWT = require('jsonwebtoken')
const User = require('../models/user')
const { JWT_SECRET } = require('../configuration')

signToken = user => {

 return JWT.sign({
        iss: 'apiauth8',
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
      }, JWT_SECRET)

}

module.exports = {

  signUp: async(req, res, next) => {
    try {

      const { email, password } = req.value.body

      // check if user already in db
      const foundUser = await User.findOne({ "local.email": email })
      if (foundUser) {
        return res.status(403).json({
          error: 'Email already in db',
          foundUser: foundUser.email
        })
      }

      const newUser = new User({
        method: 'local',
        local: {
          email: email,
          password: password
        }
      })
      await newUser.save()

      const token = signToken(newUser)
//       console.log('tok: ', token)

//       console.log('users signup')
      res.status(200).json({
        message: 'apiauth8 signup',
        email: newUser.email,
        token: token
      })

    } catch(error) {
      console.log('error in controller signup', error)
      next(error)
    }
  },

  signIn: async(req, res, next) => {
    try {

      // req.user available with passeport local strategy
      const token = signToken(req.user)
      
//       console.log('users signin')
      res.status(200).json({
        message: 'apiauth8 signin',
        token: token
      })

    } catch(error) {
      console.log('error in controller signin', error)
      next(error)
    }
  },
  

  googleOAuth: async(req, res, next) => {
    try {

      // req.user available with passeport local strategy
      const token = signToken(req.user)
      
//       console.log('users signin req.user')
      res.status(200).json({
        message: 'apiauth8 signin',
        token: token
      })

    } catch(error) {
      console.log('error in controller ggloauth', error)
      next(error)
    }
  },

  facebookOAuth: async(req, res, next) => {
    try {

      // req.user available with passeport local strategy
      const token = signToken(req.user)
      
      console.log('\n-----users signin req.user---\n', req.user)
      res.status(200).json({
        message: 'apiauth8 signin',
        token: token
      })

    } catch(error) {
      console.log('error in controller fbloauth', error)
      next(error)
    }
  },


  secret: async(req, res, next) => {
    try {
      
//       console.log('users secret')
      res.status(200).json({
        message: 'apiauth8 secret'
      })

    } catch(error) {
      next(error)
    }
  }
}
