import jwt from 'jsonwebtoken';

const generateToken = data => {
  const token = jwt.sign(data, process.env.secret_key);
  return token;
};

export default generateToken;
