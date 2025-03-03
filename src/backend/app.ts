import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
  }, { timestamps: true });

const User = mongoose.model('User', userSchema);

// API Routes
// Get all users
// app.get('/api/users', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching users' });
//   }
// });

// // Count all users
// app.get('/api/users/count', async (req, res) => {
//   try {
//     const count = await User.countDocuments();
//     res.status(200).json(count);
//   } catch (error) {
//     res.status(500).json({ message: 'Error counting users' });
//   }
// });

// Create new user
app.post('/api/user', async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user' });
  }
});

// // Get user by ID
// app.get('/api/user/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching user' });
//   }
// });

// // Update user
// app.put('/api/user/:id', async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating user' });
//   }
// });

// // Delete user
// app.delete('/api/user/:id', async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.status(200).json({ message: 'User deleted' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting user' });
//   }
// });

// // Delete all users (test utility)
// app.delete('/api/users/delete', async (req, res) => {
//   try {
//     await User.deleteMany({});
//     res.status(200).json({ message: 'All users deleted' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting users' });
//   }
// });

export { app };