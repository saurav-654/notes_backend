const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  console.log("=== DEBUGGING COOKIE MIDDLEWARE ===");
  console.log("All cookies:", req.cookies);
  console.log("Headers:", req.headers.cookie);
  console.log("Raw cookie header:", req.get('Cookie'));
  
  const token = req.cookies.token;
  console.log("Extracted token:", token);
  console.log("Token type:", typeof token);
  console.log("Token length:", token ? token.length : 0);

  if (!token) {
    console.log("No token found in cookies");
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    console.log("Set req.user:", req.user);
    next();
  } catch (err) {
    console.log("JWT verification error:", err.message);
    return res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};
