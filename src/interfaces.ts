import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ServiceResponseType, RequestAttemptType } from './types';
import { UserDBType } from './features/users/types';

export interface ITestController {
  deleteAllUsers(req: Request, res: Response): any;
}

export interface IAuthService {
  resendingEmail(email: string): Promise<any | null>;
  checkRefreshToken(refreshToken: string): Promise<null | UserDBType>;
  refreshToken(refreshToken: string): Promise<ServiceResponseType>;
  me(token: string): Promise<any>;
  logout(token: string): Promise<ServiceResponseType<Record<string, never>>>;
}

export interface IMailSender {
  sendEmail(
    address: string,
    body: string,
  ): Promise<SMTPTransport.SentMessageInfo | undefined>;
}

export interface IRequestAttemptsRepository {
  getRequestAttemptsBetweenToDates(
    ip: string,
    startDate: Date,
    endDate: Date,
    path: string,
  ): Promise<Array<RequestAttemptType>>;
  createRequestAttempt(requestAttempt: RequestAttemptType): Promise<boolean>;
  deleteAllRequests(): Promise<any>;
}
