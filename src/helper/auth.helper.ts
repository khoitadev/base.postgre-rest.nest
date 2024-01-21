import * as bcrypt from 'bcrypt';

export const encryptionPassword = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};
export const validatePassword = (
  password: string,
  passwordUser: string,
): boolean => {
  return bcrypt.compareSync(password, passwordUser);
};
