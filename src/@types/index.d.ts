declare namespace Express {
  export interface Request {
    user: Record<string, any>;
  }
  export interface Response {
    user: Record<string, any>;
  }
}
