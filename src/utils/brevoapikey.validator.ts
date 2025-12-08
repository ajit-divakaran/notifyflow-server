import axios from 'axios';

async function checkBrevoKey(apiKey: string) {
  try {
    await axios.get('https://api.brevo.com/v3/account', {
      headers: { 'api-key': apiKey }
    });
    return true;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      return false; // Key invalid
    }
    throw error; // Other network/server errors
  }
}

export default checkBrevoKey;