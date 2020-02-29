export const isMentor = data => {
  if (data.is_mentor) return true;
  return false;
};

export const isAdmin = data => {
  if (data.is_admin) return true;
  return false;
};
