/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import { codes, messages } from '../utils/messages-codes';

const authoriseUser = async (req, res, next) => {
  try {
    // Retrieve token from the header
    const token = req.header('Authorization');
    if (!token)
      return res
        .status(codes.unauthorized)
        .json({ status: res.statusCode, error: messages.noToken });

    // Verify token
    const verifiedUser = await jwt.verify(token, process.env.secret_key);

    req.user = verifiedUser;
  } catch (e) {
    if (e) return e.stack;
  }

  next();
};

export default authoriseUser;
