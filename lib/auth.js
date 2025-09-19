// lib/auth.js
const jwt = require('jsonwebtoken');

exports.generateToken = (id, tenantId) => {
  const payload = {
    id,
    tenantId,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.generateCode = () => {  // ✅ Changed to camelCase
  const min = 10000;
  const max = 99999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};