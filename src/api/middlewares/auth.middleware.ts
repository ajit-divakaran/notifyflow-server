import { NextFunction, Request, Response } from "express";
import { supabaseAdmin } from "../../lib/supabase";

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }

    // Extract the token (Bearer <token>)
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Verify token with Supabase
    // This checks signature, expiry, and returns the user object
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      console.error("Auth Error:", error?.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Attach user to the request object for the controller to use
    req.user = user;

    next(); // Proceed to the next middleware or controller
  } catch (err) {
    console.error("Unexpected Auth Error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};