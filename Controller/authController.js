const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {generateToken} = require('../lib/auth'); // Fixed import - default export
const tenent = require('../models/tenent');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const saveuser = await User.findOne({ email });
    if (!saveuser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid User cannot find',
      });
    }

    // Use the instance method from the User model
    const isPasswordValid = await saveuser.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password issue',
      });
    }
    console.log("'''''''''''''''''''''''''''");
    console.log(saveuser._id,saveuser.tenantId);

    const token = generateToken(saveuser._id,saveuser.tenantId);

    const slugname = await tenent.findOne({_id:saveuser.tenantId});
    console.log("this is slugname",slugname);

    res.status(201).cookie('token', token, {
        httpOnly: true,       // protects from XSS
        secure: process.env.NODE_ENV === 'production', // only https in prod
        sameSite: 'none',   // prevent CSRF
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      }).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: saveuser._id,
          email: saveuser.email,
          name: saveuser.name,
          role: saveuser.role,
          tenant: saveuser.tenantId || null,
          slug:slugname
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


module.exports = { login };