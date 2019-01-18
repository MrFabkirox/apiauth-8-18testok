const passport = require('passport')
const JWTStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const { ExtractJwt } = require('passport-jwt')
const { JWT_SECRET } = require('./configuration')
const User = require('./models/user')

// json web token strategy
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: JWT_SECRET
}, async (payload, done) => {

  try {

    const user = await User.findById(payload.sub)

    if(!user) {
      return done(null, false)
    }

    // return in req.user
    done(null, user)

  } catch(error) {
    done(error, false)
  }

}))

// local strategy
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {

  try {
 
    // find the user with given email
    const user = await User.findOne({ email })
    
    // if email not found
    if (!user) {
      return done(null, false)
    }
  
    // compare password for found user
    const isMatch = await user.isValidPassword(password)
  
    // if not return no error but dont pass user object
    if (!isMatch) {
      return done(null, false)
    }

    // if reach here return the user wout error
    done(null, user)
    
  } catch (error) {
    done(error, false)
    
  }


}))

