export type User = {
  userName: string;
  passwordHash: string;
};

export type AuthResult = {
  success: boolean;
  message: string;
};
