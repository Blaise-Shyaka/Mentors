import users from '../data/users';

// Generate a user ID. This function is only used with data structures as storage means
const generateUserId = () => {
  return users.length + 1;
};

export default generateUserId;
