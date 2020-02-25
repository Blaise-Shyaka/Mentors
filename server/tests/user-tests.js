/* eslint-disable consistent-return */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import { codes, messages } from '../utils/messages-codes';

const { should } = chai;
should();

chai.use(chaiHttp);

/* global describe, it */

describe('User signup POST /auth/signup', () => {
  it('should return status 201 and an object with status, message and data as properties', done => {
    chai
      .request(app)
      .post('/api/v1/user/auth/signup')
      .send({
        first_name: 'Hirwa',
        last_name: 'Firmin',
        email: 'change6@gmail.com',
        address: 'New York',
        password: 'hirwapassword',
        bio: 'I also have a bio',
        occupation: 'Software developer',
        expertise: 'software development'
      })
      .end((err, res) => {
        if (err) return done(err);

        res.statusCode.should.equal(codes.resourceCreated);
        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'message', 'data']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.resourceCreated);
        res.body.message.should.be.a('string');
        res.body.message.should.equal(messages.userCreatedSuccessfully);
        res.body.data.should.be.a('object');
        res.body.data.should.include.keys([
          'id',
          'first_name',
          'last_name',
          'email',
          'address',
          'password',
          'bio',
          'occupation',
          'expertise'
        ]);
      });
    done();
  });
});
