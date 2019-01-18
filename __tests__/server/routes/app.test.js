const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const request = require('supertest')

const app = require('../../../server/app')

chai.use(chaiHttp)

describe('apiauth-8 all routes supertest', function() {

  before(async () => {
  //   console.log('\n---- supertest routes start\n')
  });

  after(async () => {
  //   console.log('\n---- supertest routes end\n')
  });

  it('lands on root index', function (done) {
    request(app).get('/')
      .expect(200)
      .expect(/index/, done);
  });

  const index = '/users/';
  const user = {
    email: 'user0@mail.com',
    password: 'pass'
  }

  it('lands on user index', async () => {

    try {
      const result = await chai
        .request(app)
        .get(index)
        .send(user);
      expect(result.status).to.equal(200);
      expect(result.body).not.to.be.empty;
      expect(result.body).to.have.property('message');
      expect(result.body).to.deep.equal({
        message: 'apiauth-8 users index'
      });

//       console.log('result.body')
//       console.log(result.body)

    } catch (error) {
      throw new Error(error)
    }
  });

});
