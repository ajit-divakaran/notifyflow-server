import { Request, Response } from "express";
import { supabaseAdmin } from "../../lib/supabase";
import crypto from 'crypto';


const generateApiKey = (label:'test'|'live') =>{
  // 1. Generate High-Entropy Random Bytes
  // 32 bytes = 256 bits of entropy (Un-guessable)
  const buffer = crypto.randomBytes(16);
  
  // 2. Create the Raw Key (What the user puts in their .env)
  // Format: sk_live_<64_hex_chars>
  const rawKey = `sk_${label}_${buffer.toString('hex')}`;

  // 3. Create the Hash (What you verify against in middleware)
  // SHA-256 is fast and secure for high-entropy keys
  const hashedKey = crypto
    .createHash('sha256')
    .update(rawKey)
    .digest('hex');

  // 4. Create the Mask (What you show in the Dashboard list)
  // Example: sk_live_...a1b2
  const last4 = rawKey.slice(-4);
  const displayMask = `sk_${label}_...${last4}`;

  return { rawKey, hashedKey, displayMask };
;
}

const createAPIKeyController = async(req:Request,res:Response)=>{
const {label} = req.body;
const userId = req.user.id;
try {
    const {rawKey, hashedKey, displayMask} = generateApiKey(label)
    const {data, error} = await supabaseAdmin
    .from('api_keys')
    .insert({
        user_id: userId,
        label:label,
        key_hash: hashedKey,
        display_key: displayMask,
        last_used:new Date().toISOString(),

    })

    if(error){
        return res.status(400).json({error:"Failed to create API key"})
    }

    res.status(201).json({
        message:`${label} API key successfully created`,
        rawKey, 
        displayMask})
} catch (error) {
    res.status(400).json({error})
}
}

const getUserAPIKeysController = async(req:Request, res:Response)=>{
  const userId = req.user.id;
  try {
    const data = await supabaseAdmin
    .from('api_keys')
    .select('*')
    .eq('user_id',userId);

    console.log(data)

    res.status(200).json({data})
  } catch (error) {
    res.status(400).json({error})
  }
}

const deleteUserAPIKeysController = async(req:Request, res:Response)=>{
  const userId = req.user.id;
  const key_id = req.params.id
  try {
    const {data, error:deleteError} = await supabaseAdmin
    .from('api_keys')
    .delete()
    .eq('id',key_id)

    if (deleteError) throw new Error(deleteError.message)

    const { data: updatedList, error: fetchError } = await supabaseAdmin
    .from('api_keys')
    .select('*')
    .eq('user_id', userId);

  return res.status(200).json(updatedList);  
  } catch (error) {
    res.status(400).json(error)
  }
}

export {createAPIKeyController,getUserAPIKeysController,deleteUserAPIKeysController}