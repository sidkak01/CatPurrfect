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

// Cat Schema
const catSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: Number },
  age: { type: Number },
  breed: { type: String }
}, { timestamps: true });

const Cat = mongoose.model('Cat', catSchema);

// API Routes
// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Count all users
app.get('/api/users/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json(count);
  } catch (error) {
    res.status(500).json({ message: 'Error counting users' });
  }
});

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

// Get user by ID
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user' });
  }
});

// Update user
app.put('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete user
app.delete('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user' });
  }
});

// Delete all users (test utility)
app.delete('/api/users/delete', async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: 'All users deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting users' });
  }
});

// Cat API Routes

// Get all cats
app.get('/api/cats', async (req, res) => {
  try {
    const cats = await Cat.find();
    res.status(200).json(cats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cats' });
  }
});

// Count all cats
app.get('/api/cats/count', async (req, res) => {
  try {
    const count = await Cat.countDocuments();
    res.status(200).json(count);
  } catch (error) {
    res.status(500).json({ message: 'Error counting cats' });
  }
});

// Create new cat
app.post('/api/cat', async (req, res) => {
  try {
    const cat = new Cat(req.body);
    const savedCat = await cat.save();
    res.status(201).json(savedCat);
  } catch (error) {
    res.status(400).json({ message: 'Error creating cat' });
  }
});

// Get cat by ID
app.get('/api/cat/:id', async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Cat not found' });
    return res.status(200).json(cat);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching cat' });
  }
});

// Update cat
app.put('/api/cat/:id', async (req, res) => {
  try {
    const cat = await Cat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) return res.status(404).json({ message: 'Cat not found' });
    return res.status(200).json(cat);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating cat' });
  }
});

// Delete cat
app.delete('/api/cat/:id', async (req, res) => {
  try {
    const cat = await Cat.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Cat not found' });
    return res.status(200).json({ message: 'Cat deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting cat' });
  }
});

// Delete all cats (test utility)
app.delete('/api/cats/delete', async (req, res) => {
  try {
    await Cat.deleteMany({});
    res.status(200).json({ message: 'All cats deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting cats' });
  }
});

export { app };