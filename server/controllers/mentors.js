/* eslint-disable consistent-return */
import moment from 'moment';
import { isMentor } from '../helpers/check-user-type';
import { codes, messages } from '../utils/messages-codes';
import sessions from '../data/sessions';
import validate from '../helpers/validate-input';

export const acceptMentorship = (req, res) => {
  const { sessionId } = req.params;
  const { user } = req;
  const { error, value } = validate.validateMentorResponse(req.body);

  // Send an error if mentor's input does not meet requirements
  if (error)
    res
      .status(codes.badRequest)
      .json({ status: res.statusCode, error: error.message });

  // Check if the user accessing this route is a mentor
  if (!isMentor(user))
    return res.status(codes.unauthorized).json({
      status: res.statusCode,
      error: messages.accessDeniedToRegularUsers
    });

  // Retrieve the session to be updated
  const session = sessions.find(s => s.id === parseInt(sessionId, 10));
  if (!session)
    return res
      .status(codes.notFound)
      .json({ status: res.statusCode, error: messages.sessionNotFound });

  // Deny access to the session, if the session retrieved does not belong to the signed in mentor
  if (user.id !== session.mentorId)
    return res
      .status(codes.unauthorized)
      .json({ status: res.statusCode, error: messages.sessionNotYours });

  const acceptedOn = moment().format('LLL');

  // Update session and send response
  return res.status(codes.okay).json({
    status: codes.okay,
    message: messages.success,
    data: {
      id: sessionId,
      mentorId: user.id,
      menteeId: session.menteeId,
      menteeEmail: session.menteeEmail,
      title: session.title,
      questions: session.questions,
      status: 'accepted',
      createdOn: session.createdOn,
      response: value.response,
      acceptedOn
    }
  });
};

export const rejectMentorship = (req, res) => {
  const { sessionId } = req.params;
  const { user } = req;

  // Check if the user accessing this route is a mentor
  if (!isMentor(user))
    return res.status(codes.unauthorized).json({
      status: res.statusCode,
      error: messages.accessDeniedToRegularUsers
    });

  // Retrieve the session to be updated
  const session = sessions.find(s => s.id === parseInt(sessionId, 10));
  if (!session)
    return res
      .status(codes.notFound)
      .json({ status: res.statusCode, error: messages.sessionNotFound });

  // Deny access to the session, if the session retrieved does not belong to the signed in mentor
  if (user.id !== session.mentorId)
    return res
      .status(codes.unauthorized)
      .json({ status: res.statusCode, error: messages.sessionNotYours });

  const rejectedOn = moment().format('LLL');

  // Update session and send response
  return res.status(codes.okay).json({
    status: codes.okay,
    message: messages.success,
    data: {
      id: sessionId,
      mentorId: user.id,
      menteeId: session.menteeId,
      menteeEmail: session.menteeEmail,
      title: session.title,
      questions: session.questions,
      status: 'rejected',
      createdOn: session.createdOn,
      rejectedOn
    }
  });
};
