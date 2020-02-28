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
  successfulLogin: 'You were logged in successfully!',
  noToken: 'Access denied! No token was provided',
  noMentors: 'There are no mentors! Try again some other time',
  accessDeniedToMentors: 'Access to this resource is denied to all the mentors',
  success: 'Operation completed successfully'
};

export { codes, messages };
