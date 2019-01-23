const passport = require('passport')
const JWTStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const GooglePlusTokenStrategy = require('passport-google-plus-token')
const FacebookTokenStrategy = require('passport-facebook-token')
const { ExtractJwt } = require('passport-jwt')
const { JWT_SECRET } = require('./configuration')
const config = require('./configuration')
const User = require('./models/user')

// json web token strategy
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: JWT_SECRET
}, async (payload, done) => {

  try {

    console.log('\n ---error before findbyid try --- \n', error)
    const user = await User.findById(payload.sub)

    if(!user) {

    console.log('\n ---error before findbyid nouser--- \n', error)
      return done(null, false)
    }

    // return in req.user

    console.log('\n ---error before findbyid catch--- \n', error)

    done(null, user)

  } catch(error) {
    console.log('\n -----error after findbyid ------- \n', error)
    done(error, false)
  }

}))

// google oauth strategy
passport.use('googleToken', new GooglePlusTokenStrategy({

  clientID: config.oauth.google.clientID,
  clientSecret: config.oauth.google.clientSecret


}, async (accessToken, refreshToken, profile, done) => {

  try {
 
    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)
    console.log('profile', profile)
  
    // check if google user exist in out db
    const existingUser = await User.findOne({ 'google.id': profile.id })
    if (existingUser) {

      return done(null, existingUser)
    }
  
    // if user doesn t exist create new account in our db
    const newUser = new User({
      method: 'google',
      google: {
        id: profile.id,
        email: profile.emails[0].value
      }
    })
  
    // save the new user and send it back with no errors
    await newUser.save()
    done(null, newUser)


  } catch (error) {
    console.log('error in ggl oauth passport', error)
    done(error, false, error.message)
  }

}))



// facebook oauth strategy
passport.use('facebookToken', new FacebookTokenStrategy ({

  clientID: config.oauth.facebook.clientID,
  clientSecret: config.oauth.facebook.clientSecret

}, async (accessToken, refreshToken, profile, done) => {

  try {

    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)
    console.log('profile', profile)

    const existingUser = await User.findOne({ 'facebook.id': profile.id })

    if (existingUser) {
      return done(null, existingUser)
    }

    const newUser = new User({
      method: 'facebook',
      facebook: {
        id: profile.id,
        email: profile.emails[0].value
      }
    })

    await newUser.save()
    done(null, newUser)

  } catch (error) {
    console.log('error in facebook oauth passport', error)
    done(error, false, error.message)
  }

}))


// local strategy
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {

  try {
 
    // find the user with given email
    const user = await User.findOne({ "local.email": email })

    console.log('user', user)
    
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
    console.log('error in local oauth passport', error)
    done(error, false)
    
  }


}))

