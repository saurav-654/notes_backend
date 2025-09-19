const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const Tenant = require('../models/tenent');
const User = require('../models/User');

// Load environment variables
dotenv.config({ path: './.env.local' });

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Tenant.deleteMany({});
    console.log('Cleared existing data');

    // Create tenants
    const acmeTenant = await Tenant.create({
      slug: 'acme',
      name: 'Acme Corporation',
      plan: 'PRO'
    });

    const globexTenant = await Tenant.create({
      slug: 'globex',
      name: 'Globex Corporation',
      plan: 'FREE'
    });

    console.log('Tenants created');

    // Hash password function
    const hashPassword = async (password) => {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    };

    // Hash the password before creating users
    const hashedPassword = await hashPassword('password');

    // Create users with hashed passwords
    const users = [
      {
        email: 'admin@acme.test',
        password: hashedPassword,
        name: 'Acme Admin',
        role: 'ADMIN',
        tenantId: acmeTenant._id
      },
      {
        email: 'user@acme.test',
        password: hashedPassword,
        name: 'Acme User',
        role: 'MEMBER',
        tenantId: acmeTenant._id
      },
      {
        email: 'admin@globex.test',
        password: hashedPassword,
        name: 'Globex Admin',
        role: 'ADMIN',
        tenantId: globexTenant._id
      },
      {
        email: 'user@globex.test',
        password: hashedPassword,
        name: 'Globex User',
        role: 'MEMBER',
        tenantId: globexTenant._id
      }
    ];

    await User.insertMany(users);
    console.log('Test users created successfully with hashed passwords');

    // Log the created accounts
    console.log('\n=== TEST ACCOUNTS CREATED ===');
    console.log('admin@acme.test (Admin, tenant: Acme)');
    console.log('user@acme.test (Member, tenant: Acme)');
    console.log('admin@globex.test (Admin, tenant: Globex)');
    console.log('user@globex.test (Member, tenant: Globex)');
    console.log('Password for all accounts: password (hashed in database)');
    console.log('=============================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
