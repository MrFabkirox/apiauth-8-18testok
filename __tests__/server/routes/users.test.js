const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai
const faker = require('faker')
const mongoose = require('mongoose')

const server = require('../../../server/app')

chai.use(chaiHttp)
let token

describe('apiauth-8 user route testing', () => {

  const signup = '/users/signup'
  const signin = '/users/signin'
  const secret = '/users/secret'

  const user = {
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password()
  }

//   const preSave = {
//     email: 'apiauth8presave1@mail.com',
//     password: faker.internet.password()
//   }
// 
//   before(done => {
//     chai
//       .request(server)
//       .post(signup)
//       .send(preSave)
//       .end((err, res) => {
//         expect(res.status).to.equal(200);
//         token = res.body.token;
//         done()
//       })
//   });

after('dropping test db', done  => {
//   mongoose.connection.dropDatabase(() => {
//     console.log('\n test db dropped')
//   })
    mongoose.connection.close(() => {
      console.log('\n---- db closed')
      done()
    })
  })

  describe('user route signup', () => {

    it('should display signup', done => {
      chai
        .request(server)
        .post(signup)
        .send(user)
        .end(function(err, res) {
          expect(res).to.have.status(200) 
          expect(res.status).to.equal(200)
          expect(res.body).not.to.be.empty
          expect(res.body).to.have.property('message')
          expect(res.body).to.be.deep.equal({
            message: 'apiauth8 signup',
            email: user.email,
            token: res.body.token
          })
          expect(res.body).to.include({
            message: 'apiauth8 signup'
          })
          token = res.body.token;
          // console.log('show me your faketok2', token)
          // faketok2 from controller test impact here
          // if singToken not called overthere because of rewire
          done()
        })
    })

    it('400 if signup lack password', done => {
      const noPwdUser = { email: 'noPwdUser' + faker.internet.email() }
      chai
        .request(server)
        .post(signup)
        .send(noPwdUser )
        .end(function(err, res) {
          expect(res).to.have.status(400) 
          expect(res.status).to.equal(400)
          expect(res.body).not.to.be.empty
          expect(res.body).to.have.property('isJoi')
          expect(res.body).to.include({
            name: "ValidationError"
          })
          done()
        })
    })

    it('400 if signup lack email', done => {
      const noMailUser = { password: 'noMailUser' + faker.internet.password() }
      chai
        .request(server)
        .post(signup)
        .send(noMailUser )
        .end(function(err, res) {
          expect(res).to.have.status(400) 
          expect(res.status).to.equal(400)
          expect(res.body).not.to.be.empty
          expect(res.body).to.have.property('isJoi')
          expect(res.body).to.include({
            name: "ValidationError"
          })
          done()
        })
    })

    it('400 if signup lack email and password', done => {
      const noMailPwdUser = {}
      chai
        .request(server)
        .post(signup)
        .send(noMailPwdUser )
        .end(function(err, res) {
          expect(res).to.have.status(400) 
          expect(res.status).to.equal(400)
          expect(res.body).not.to.be.empty
          expect(res.body).to.have.property('isJoi')
          expect(res.body).to.include({
            name: "ValidationError"
          })
          done()
        })
    })

    it('403 if email already in db', done => {
      chai
        .request(server)
        .post(signup)
        .send(user)
        .end(function(err, res) {
          expect(res.status).to.equal(403)
          expect(res.body).not.to.be.empty
          expect(res.body).to.have.property('error')
          expect(res.body).to.be.deep.equal({
            error: 'Email already in db',
            foundUser: user.email
          })
          done()
        })
    })



  })

  describe('user route signin', () => {

    it('await should display signin', async () => {
      const result = await chai
        .request(server)
        .post(signin)
        .send(user)
          expect(result.status).to.equal(200)
          expect(result.body).not.to.be.empty
          expect(result.body).to.be.deep.equal({
            message: 'apiauth8 signin',
            token: result.body.token
          })

        })
    })

  describe('user route secret', () => {

    it('should display secret', done => {

      chai
        .request(server)
        .get(secret)
        .set('Authorization', token)
        .end(function(err, res) {
          expect(res).to.have.status(200) 
          expect(res.body).not.to.be.empty
          expect(res.body).to.have.property('message')
          expect(res.body).to.be.deep.equal({
            message: 'apiauth8 secret'
          })

          done()
        })
    })

    it('no display secret if wrong token', done => {

      chai
        .request(server)
        .get(secret)
        .set('Authorization', 'faketoken')
        .end(function(err, res) {
          expect(res).to.have.status(401) 
          done()
        })
    })

  })



})
