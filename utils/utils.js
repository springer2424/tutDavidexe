export const getNextId = (users) => {
  if (!users || users.length === 0) {
    return 1;
  }
  let maxValue = 0;
  users.forEach((users) => {
    if (users.id > maxValue) {
      maxValue = users.id;
    }
  });
  return maxValue + 1;
};
