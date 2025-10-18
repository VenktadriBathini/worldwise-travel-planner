const jwt = require('jsonwebtoken');

function signAccessToken(user) {
  return jwt.sign(
    { email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { subject: user.id, expiresIn: process.env.JWT_ACCESS_TTL || '15m' }
  );
}
function signRefreshToken(user) {
  return jwt.sign(
    { email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { subject: user.id, expiresIn: process.env.JWT_REFRESH_TTL || '7d' }
  );
}

module.exports = { signAccessToken, signRefreshToken };
