/* eslint-disable consistent-return */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import { codes, messages } from '../utils/messages-codes';

const { should } = chai;
should();
chai.use(chaiHttp);

/* global describe, it */

describe('User signup', () => {
  it('should return status code 201', done => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        first_name: 'Hirwa',
        last_name: 'Firmin',
        email: 'hirwafirmin@gmail.com',
        address: 'New York',
        password: 'hirwapassword',
        bio: 'I also have a bio',
        occupation: 'Software developer',
        expertise: 'software development'
      })
      .end((err, res) => {
        if (err) return done(err);

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

  it('should return status code 400, if a user does not fill all the required fields', done => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        first_name: 'Hirwa',
        last_name: 'Firmin',
        email: 'hirwafirmin@gmail.com',
        address: 'New York',
        password: 'hirwapassword'
      })
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.badRequest);
        res.body.error.should.be.a('string');
      });
    done();
  });

  it('should return status code 409, if a user already has an account', done => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        first_name: 'Carl',
        last_name: 'Jenkinson',
        email: 'carljenkinson@gmail.com',
        address: 'New York',
        password: 'carlpassword',
        bio: 'Carl has a bio',
        occupation: 'Software developer',
        expertise: 'software development'
      })
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.conflict);
        res.body.error.should.be.a('string');
        res.body.error.should.be.equal(messages.signinInstead);
      });
    done();
  });
});

describe('User sign in', () => {
  it('should return status 201 and "status", "message" and "data" properties', done => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'carljenkinson@gmail.com', password: 'carlpassword' })
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'message', 'data']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.okay);
        res.body.message.should.be.a('string');
        res.body.message.should.equal(messages.successfulLogin);
        res.body.data.should.be.a('object');
        res.body.data.should.include.keys(['token']);
      });
    done();
  });

  it('should return status 400, if the user submits incomplete information', done => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'carljenkinson@gmail.com' })
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.badRequest);
        res.body.error.should.be.a('string');
      });
    done();
  });

  it('should return status 401, in case the user does not exist', done => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'carl@gmail.com', password: 'password' })
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.unauthorized);
        res.body.error.should.be.a('string');
      });
    done();
  });

  it('should return status 201 and "status", "message" and "data" properties', done => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'carljenkinson@gmail.com', password: 'wrongpassword' })
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.unauthorized);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.wrongEmailOrPassword);
      });
    done();
  });
});
