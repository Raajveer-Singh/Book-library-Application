import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/book-library');
    console.log('Connected to MongoDB');

    // Define User schema (temporary)
    const userSchema = new mongoose.Schema({
      username: String,
      email: String,
      password: String,
      role: String,
      borrowedBooks: Array
    }, { timestamps: true });

    const User = mongoose.model('User', userSchema);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@lib.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const adminUser = new User({
      username: 'Admin',
      email: 'admin@lib.com',
      password: hashedPassword,
      role: 'admin',
      borrowedBooks: []
    });

    await adminUser.save();
    console.log(' Admin user created successfully!');
    console.log(' Email: admin@lib.com');
    console.log(' Password: admin123');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

createAdminUser();