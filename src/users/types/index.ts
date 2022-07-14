export type UserViewType = Omit<
  UserDBType,
  'hashPassword' | 'emailConfirmation' | 'email' | 'tokenVersion'
>;

export interface UserDBType {
  id: string;
  login: string;
  email: string;
  hashPassword: string;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
  tokenVersion: number;
}
