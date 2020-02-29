/* eslint-disable consistent-return */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import generateToken from '../helpers/generate-token';
import { codes, messages } from '../utils/messages-codes';

const { should } = chai;

should();
chai.use(chaiHttp);

/* global describe, it */

describe('Accept mentorship session', () => {
  const mentorToken = generateToken({
    id: 2,
    first_name: 'Ola',
    last_name: 'fiona',
    email: 'olafiona@gmail.com',
    password: '$2b$10$kFjxy2DAFvutTJnYAaKj.eMPGapPWfViyZeQPRJplYEYhidC6hTT6',
    address: 'Lagos',
    bio: 'Ola has a bio',
    occupation: 'Real estate developer',
    expertise: 'construction',
    is_admin: false,
    is_mentor: true
  });

  const user = generateToken({
    id: 1,
    first_name: 'Carl',
    last_name: 'Jenkinson',
    email: 'carljenkinson@gmail.com',
    password: '$2b$10$sla5Xu1lca4Vo5cMXriet.9cfEAjjCHGZOHDR0K1KtQ7tbN6Xs90G',
    address: 'New York',
    bio: 'Carl has a bio',
    occupation: 'Software developer',
    expertise: 'software development',
    is_admin: false,
    is_mentor: false
  });

  const wrongMentor = generateToken({
    id: 3,
    first_name: 'Craig',
    last_name: 'David',
    email: 'craigdavid@gmail.com',
    password: '$2b$10$wZ7WbSGj9uNO5TS4VHxdp.D2sSThPRbcsHVWqumcwRgjMleRVVRIK',
    address: 'Las Vegas',
    bio: 'Craig has a bio',
    occupation: 'Musician',
    expertise: 'Music',
    is_admin: false,
    is_mentor: true
  });

  it('should return status 200 and an object with "status", "message" and "data" as properties', done => {
    chai
      .request(app)
      .patch('/api/v1/sessions/1/accept')
      .set('Authorization', mentorToken)
      .send({
        response: "Mentor's response is here!"
      })
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'message', 'data']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.okay);
        res.body.message.should.be.a('string');
        res.body.message.should.equal(messages.success);
        res.body.data.should.be.a('object');
        res.body.data.status.should.equal('accepted');
      });
    done();
  });

  it('should return status 400 if the mentor does not send a response to the mentee', done => {
    chai
      .request(app)
      .patch('/api/v1/sessions/1/accept')
      .set('Authorization', mentorToken)
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

  it('should return status 401 if the user tries to accept a mentorship request', done => {
    chai
      .request(app)
      .patch('/api/v1/sessions/1/accept')
      .set('Authorization', user)
      .send({
        response: "Mentor's response is here!"
      })
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.unauthorized);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.accessDeniedToRegularUsers);
      });
    done();
  });

  it('should return status 404 if the session a mentor is trying to accept does not exist', done => {
    chai
      .request(app)
      .patch('/api/v1/sessions/1000/accept')
      .set('Authorization', mentorToken)
      .send({
        response: "Mentor's response is here!"
      })
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.notFound);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.sessionNotFound);
      });
    done();
  });

  it('should return status 401 a mentor accepts a request not addressed to her/him', done => {
    chai
      .request(app)
      .patch('/api/v1/sessions/1/accept')
      .set('Authorization', wrongMentor)
      .send({
        response: "Mentor's response is here!"
      })
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.unauthorized);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.sessionNotYours);
      });
    done();
  });
});

describe('Reject mentorship session', () => {
  const mentorToken = generateToken({
    id: 2,
    first_name: 'Ola',
    last_name: 'fiona',
    email: 'olafiona@gmail.com',
    password: '$2b$10$kFjxy2DAFvutTJnYAaKj.eMPGapPWfViyZeQPRJplYEYhidC6hTT6',
    address: 'Lagos',
    bio: 'Ola has a bio',
    occupation: 'Real estate developer',
    expertise: 'construction',
    is_admin: false,
    is_mentor: true
  });

  const user = generateToken({
    id: 1,
    first_name: 'Carl',
    last_name: 'Jenkinson',
    email: 'carljenkinson@gmail.com',
    password: '$2b$10$sla5Xu1lca4Vo5cMXriet.9cfEAjjCHGZOHDR0K1KtQ7tbN6Xs90G',
    address: 'New York',
    bio: 'Carl has a bio',
    occupation: 'Software developer',
    expertise: 'software development',
    is_admin: false,
    is_mentor: false
  });

  const wrongMentor = generateToken({
    id: 3,
    first_name: 'Craig',
    last_name: 'David',
    email: 'craigdavid@gmail.com',
    password: '$2b$10$wZ7WbSGj9uNO5TS4VHxdp.D2sSThPRbcsHVWqumcwRgjMleRVVRIK',
    address: 'Las Vegas',
    bio: 'Craig has a bio',
    occupation: 'Musician',
    expertise: 'Music',
    is_admin: false,
    is_mentor: true
  });

  it('should return status 200 and an object with "status", "message" and "data" as properties', done => {
    chai
      .request(app)
      .patch('/api/v1/sessions/1/reject')
      .set('Authorization', mentorToken)
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'message', 'data']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.okay);
        res.body.message.should.be.a('string');
        res.body.message.should.equal(messages.success);
        res.body.data.should.be.a('object');
        res.body.data.status.should.equal('rejected');
      });
    done();
  });

  it('should return status 401 if the user tries to reject a mentorship request', done => {
    chai
      .request(app)
      .patch('/api/v1/sessions/1/reject')
      .set('Authorization', user)
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.unauthorized);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.accessDeniedToRegularUsers);
      });
    done();
  });

  it('should return status 404 if the session a mentor is trying to reject does not exist', done => {
    chai
      .request(app)
      .patch('/api/v1/sessions/1000/reject')
      .set('Authorization', mentorToken)
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.notFound);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.sessionNotFound);
      });
    done();
  });

  it('should return status 401 a mentor rejects a request not addressed to her/him', done => {
    chai
      .request(app)
      .patch('/api/v1/sessions/1/reject')
      .set('Authorization', wrongMentor)
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.unauthorized);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.sessionNotYours);
      });
    done();
  });
});
