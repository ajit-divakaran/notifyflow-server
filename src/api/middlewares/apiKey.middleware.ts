import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../lib/supabase';
import crypto from 'crypto'


export const verifyApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key']; 

  if (!apiKey || typeof apiKey !== 'string') {
    return res.status(401).json({ error: 'Missing or invalid API Key' });
  }

  try {
    // Logic: Check the key_hash against the database [cite: 103, 121]
    const hashedIncomingKey = crypto
      .createHash('sha256')
      .update(apiKey)
      .digest('hex');
    
    
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('id, user_id')
      .eq('key_hash', hashedIncomingKey) // Assuming stored key is comparable
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid API Key' });
    }

    // Attach user_id to the request for the controller to use
    (req as any).user = { id: data.user_id }; 
    next();
  } catch (err) {
    next(err);
  }
};