/* eslint-disable consistent-return */
import bcrypt from 'bcrypt';
import validate from '../helpers/validate-input';
import { codes, messages } from '../utils/messages-codes';
import users from '../data/users';
import generateToken from '../helpers/generate-token';

// The User sign up route controller function
export const userSignUp = async (req, res) => {
  const { error, value } = validate.validateSignup(req.body);

  if (error)
    return res
      .status(codes.badRequest)
      .json({ status: res.statusCode, error: error.message });

  // Check if user exists
  const userExists = users.find(user => user.email === value.email);

  if (userExists)
    return res
      .status(codes.conflict)
      .json({ status: res.statusCode, error: messages.signinInstead });

  // Hash password
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(value.password, salt);

  users.push({
    id: users.length + 1,
    first_name: value.first_name,
    last_name: value.last_name,
    email: value.email,
    password: hashedPassword,
    address: value.address,
    bio: value.bio,
    occupation: value.occupation,
    expertise: value.expertise,
    is_admin: false,
    is_mentor: false
  });

  return res.status(codes.resourceCreated).json({
    status: res.statusCode,
    message: messages.userCreatedSuccessfully,
    data: {
      id: users.length,
      first_name: value.first_name,
      last_name: value.last_name,
      email: value.email,
      password: hashedPassword,
      address: value.address,
      bio: value.bio,
      occupation: value.occupation,
      expertise: value.expertise,
      is_admin: false,
      is_mentor: false
    }
  });
};

export const userSignIn = async (req, res) => {
  const { error, value } = validate.validateSignin(req.body);

  // return error if user input does not meet validation criteria defined in the validate function
  if (error)
    return res
      .status(codes.badRequest)
      .json({ status: res.statusCode, error: error.message });

  // Check if user exists
  const userExists = users.find(user => user.email === value.email);
  if (!userExists)
    return res
      .status(codes.unauthorized)
      .json({ status: res.statusCode, error: messages.userDoesntExist });

  // Verify if the passwords match
  const passwordsMatch = await bcrypt.compare(
    value.password,
    userExists.password
  );

  if (!passwordsMatch)
    return res
      .status(codes.unauthorized)
      .json({ status: res.statusCode, error: messages.wrongEmailOrPassword });

  // Generate and assign token to header
  const token = await generateToken(userExists);
  return res
    .header('Authorization', token)
    .status(codes.okay)
    .json({
      status: res.statusCode,
      message: messages.successfulLogin,
      data: { token }
    });
};

export const viewAllMentors = (req, res) => {
  // Details of a signed in user
  const { user } = req;

  // Check if a user trying to access this resource is a mentor and deny them access
  if (user.is_mentor)
    return res
      .status(codes.unauthorized)
      .json({ status: res.statusCode, error: messages.accessDeniedToMentors });

  // Retrieve all mentors
  const mentors = users.filter(individual => individual.is_mentor === true);
  if (mentors.length === 0)
    return res
      .status(codes.okay)
      .json({ status: res.statusCode, error: messages.noMentors });

  return res
    .status(codes.okay)
    .json({ status: res.statusCode, message: messages.success, data: mentors });
};
