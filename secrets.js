require('dotenv').config();

let key = process.env.PRIVATE_KEY;
let newKey = key.replace(/\\n/g, '\n');

module.exports = {
  // reads environment variables via dotenv file
  sheetUrl: process.env.SHEET_URL,
  credentials: {
    "type": process.env.TYPE,
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": newKey,
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_URL,
    "client_x509_cert_url": process.env.CLIENT_CERT_URL
  }
}