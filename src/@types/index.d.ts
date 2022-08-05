declare namespace Express {
  export interface Request {
    user: {
      id: string;
      login: string;
    };
  }
  export interface Response {
    user: Record<string, any>;
  }
}
