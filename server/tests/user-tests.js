/* eslint-disable consistent-return */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import { codes, messages } from '../utils/messages-codes';
import generateToken from '../helpers/generate-token';

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
  it('should return status 200 and "status", "message" and "data" properties', done => {
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

  it('should return status 401 in case a user provides a wrong password', done => {
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

describe('View all mentors', () => {
  const rightToken = generateToken({
    email: 'carljenkinson@gmail.com',
    password: 'carlpassword'
  });

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

  it('should return status 200 and an object with "status", "message" and "data" properties', done => {
    chai
      .request(app)
      .get('/api/v1/mentors')
      .set('Authorization', rightToken)
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'message', 'data']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.okay);
        res.body.message.should.be.a('string');
        res.body.message.should.equal(messages.success);
        res.body.data.should.be.a('array');
      });
    done();
  });

  it('should return status 401 if no token was provided', done => {
    chai
      .request(app)
      .get('/api/v1/mentors')
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.unauthorized);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.noToken);
      });
    done();
  });

  it('should return status 401 if the user is a mentor', done => {
    chai
      .request(app)
      .get('/api/v1/mentors')
      .set('Authorization', mentorToken)
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.unauthorized);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.accessDeniedToMentors);
      });
    done();
  });
});

describe('View a specific mentor', () => {
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

  const mentor = {
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
  };

  const mentorId = 2;
  const incorrectId = 20;

  it('should return status 200 and an object with "status", "message" and "data" as properties', done => {
    chai
      .request(app)
      .get(`/api/v1/mentors/${mentorId}`)
      .set('Authorization', user)
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.okay);
        res.body.message.should.be.a('string');
        res.body.message.should.equal(messages.success);
        res.body.data.should.be.a('object');
        res.body.data.id.should.equal(mentorId);
      });
    done();
  });

  it('should return status 404 in case no mentor of that specific ID was found', done => {
    chai
      .request(app)
      .get(`/api/v1/mentors/${incorrectId}`)
      .set('Authorization', user)
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.notFound);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.resourceNotFound);
      });
    done();
  });

  it('should return status 401 in case a mentor tries to access this route', done => {
    chai
      .request(app)
      .get(`/api/v1/mentors/${mentorId}`)
      .set('Authorization', mentor)
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.unauthorized);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.accessDeniedToMentors);
      });
    done();
  });
});

describe('Create mentorship session', () => {
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

  const mentor = generateToken({
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

  it('should return status 200 and an object with "status", "message" and "data" as properties', done => {
    chai
      .request(app)
      .post('/api/v1/sessions')
      .set('Authorization', user)
      .send({
        mentorId: 2,
        title: 'My first session',
        questions: 'I have a few questions'
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
        res.body.data.should.include.keys([
          'id',
          'mentorId',
          'menteeId',
          'menteeEmail',
          'title',
          'questions',
          'status',
          'createdOn'
        ]);
      });
    done();
  });

  it('should return status 401 if the user sending a mentorship request is a mentor or an admin', done => {
    chai
      .request(app)
      .post('/api/v1/sessions')
      .set('Authorization', mentor)
      .send({
        mentorId: 2,
        title: 'My first session',
        questions: 'I have a few questions'
      })
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.unauthorized);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.accessDeniedToMentors);
      });
    done();
  });

  it('should return status 400 if the user input lacks required information', done => {
    chai
      .request(app)
      .post('/api/v1/sessions')
      .set('Authorization', user)
      .send({
        mentorId: 2,
        title: 'My first session'
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

  it('should return status 404 if the mentor to which a request is sent does not exist', done => {
    chai
      .request(app)
      .post('/api/v1/sessions')
      .set('Authorization', user)
      .send({
        mentorId: 2000,
        title: 'My first session',
        questions: 'I have a few questions'
      })
      .end((err, res) => {
        if (err) return done(err);

        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.notFound);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.noMentor);
      });
    done();
  });
});
