const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'firebase-key.json');

try {
  // Check if firebase-key.json exists (this will be provided by user)
  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('Firebase Admin initialized');
} catch (error) {
  console.warn('Firebase Admin could not be initialized. Please ensure firebase-key.json exists in the root directory.');
}

module.exports = admin;
