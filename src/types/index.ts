export interface AuthContext {
  api_key: string;
  user_id: string;
  project_id: string;
}

export type EmailJobData = {
  user_id: string;
  credits_used:number;
  event:string;
  brevoApiKey?:string;
  type:'EMAIL';
  data:{
    toEmail: string;
    subject: string;
    htmlContent: string;
    created_at: string;
  };
  params?: Record<string, any>
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
      auth?: AuthContext;
    }
  }
}
