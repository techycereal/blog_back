const { admin } = require('./firebaseAdmin');

// Middleware to verify the Firebase ID token
const authenticateUser = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    console.log('here')
    return res.status(403).send('Authorization token is required.');
  }

  try {
    console.log(idToken)
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log(decodedToken)
    req.user = decodedToken; // Attach decoded user info to request
    console.log(req.user)
    next();
  } catch (error) {
    console.log(error)
    return res.status(403).send('Invalid or expired token.');
  }
};

// Export the middleware
module.exports = { authenticateUser };
