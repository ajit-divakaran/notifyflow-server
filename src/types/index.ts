export interface AuthContext {
  api_key: string;
  user_id: string;
  project_id: string;
}

export type EmailJobData = {
  user_id: string;
  type:'EMAIL';
  data:{
    toEmail: string;
    subject: string;
    htmlContent: string
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
      auth?: AuthContext;
    }
  }
}
