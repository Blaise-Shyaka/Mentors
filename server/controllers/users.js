/* eslint-disable consistent-return */
import bcrypt from 'bcrypt';
import validate from '../helpers/validate-input';
import { codes, messages } from '../utils/messages-codes';
import users from '../data/users';

// The User sign up route controller function
const userSignUp = async (req, res) => {
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

  res.status(codes.resourceCreated).json({
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

export default userSignUp;
