export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,16}$/;

export const validatePassword = (password: string): boolean => {
  return PASSWORD_REGEX.test(password);
};
