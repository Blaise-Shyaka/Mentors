const codes = {
  badRequest: 400,
  conflict: 409,
  resourceCreated: 201,
  unauthorized: 401,
  okay: 200
};

const messages = {
  signinInstead: 'You already have an account. Please sign in instead',
  userCreatedSuccessfully: 'New user was created successfully',
  userDoesntExist: 'You do not have an account on Mentors. Sign up instead!',
  wrongEmailOrPassword: 'Sign in failed. Email and password do not match',
  successfulLogin: 'You were logged in successfully!'
};

export { codes, messages };
