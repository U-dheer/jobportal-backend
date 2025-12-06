const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB (adjust the connection string as needed)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/job-portal';

async function createAdminUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Define the User schema (simplified version)
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, required: true, enum: ['JobSeeker', 'Employer', 'Admin'] },
      name: { type: String, required: true },
      address: { type: String, required: true },
      telephone: { type: String, required: true },
      isActive: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });

    const User = mongoose.model('User', userSchema);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@jobportal.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const adminUser = new User({
      email: 'admin@jobportal.com',
      password: hashedPassword,
      role: 'Admin',
      name: 'System Administrator',
      address: 'Admin Address',
      telephone: '+1234567890',
      isActive: true
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@jobportal.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
createAdminUser(); 