const User = require("../models/User");
const bcrypt = require("bcrypt");

const addUser = async (req, res) => {
    try {
        console.log("=== ADD USER REQUEST ===");
        console.log("Request body:", req.body);
        
        const { email, useremail, userPassword, userName, userrole } = req.body;
        
        console.log("Looking for admin with email:", email);
        const checkAdmin = await User.findOne({ email });
        
        if (!checkAdmin) {
            console.log("Admin not found");
            return res.status(401).json({
                success: "false",
                message: "Invalid credentials"
            });
        }
        
        console.log("Found admin:", checkAdmin.name, "Role:", checkAdmin.role);
        
        if (checkAdmin.role !== "ADMIN") {
            return res.status(401).json({
                success: "false",
                message: "Only admin can add the member"
            });
        }
        
        // ✅ FIX: Change 'user' to 'User' and fix query
        console.log("Checking if user exists with email:", useremail);
        const checkuser = await User.findOne({ email: useremail });
        
        if (checkuser) {
            console.log("User already exists");
            return res.status(409).json({
                success: "false",
                message: "User already exists"
            });
        }
        
        // ✅ FIX: Enable password hashing
       
        
        const userData = {
            email: useremail,
            password: userPassword, // ✅ Use hashed password
            name: userName,
            role: userrole,
            tenantId: checkAdmin.tenantId
        };
        
        console.log('User data to save:', { ...userData, password: '[HIDDEN]' });
        
        // ✅ FIX: Use different variable name
        const newUser = new User(userData);
        const savedUser = await newUser.save();
        
        console.log("User saved successfully!");
        
        return res.status(201).json({
            success: "true",
            message: "User is added successfully"
        });
        
    } catch (error) {
        console.error('=== ADD USER ERROR ===');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        
        res.status(500).json({
            success: "false",
            message: 'Internal server error'
        });
    }
};

module.exports = { addUser };