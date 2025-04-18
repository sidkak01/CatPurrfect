import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import crypto from 'crypto';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Issues with bcrypt so manually hashing passwords and creating token
const generateToken = (userEmail: string, secret: string): string => {
  const timestamp = Date.now();
  const data = `${userEmail}-${timestamp}`;
  const hash = crypto.createHmac('sha256', secret)
    .update(data)
    .digest('hex');
  
  const token = Buffer.from(`${userEmail}.${timestamp}.${hash}`).toString('base64');
  return token;
};

// Use later for refreshing page to maintain state
const verifyToken = (token: string, secret: string): { userEmail: string, valid: boolean } => {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [userEmail, timestamp, originalHash] = decoded.split('.');
    
    const now = Date.now();
    const tokenTime = parseInt(timestamp, 10);
    const tokenAge = now - tokenTime;
    const MAX_TOKEN_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (tokenAge > MAX_TOKEN_AGE) {
      return { userEmail, valid: false };
    }
    
    const data = `${userEmail}-${timestamp}`;
    const calculatedHash = crypto.createHmac('sha256', secret)
      .update(data)
      .digest('hex');
    
    const valid = calculatedHash === originalHash;
    
    return { userEmail, valid };
  } catch (error) {
    return { userEmail: '', valid: false };
  }
};

const hashPassword = (password: string, salt: string): string => {
  return crypto.createHash('sha256')
    .update(password + salt)
    .digest('hex');
};

const generateSalt = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

const TOKEN_SECRET = 'temporary_token_secret';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    role: { type: String, default: 'user' }
  }, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Cat Schema
const catSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: mongoose.Schema.Types.Mixed },
  age: { type: mongoose.Schema.Types.Mixed },
  breed: { type: String },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
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
    const existingUser = await User.findOne({ 
      $or: [
        { email: req.body.email },
        { username: req.body.username }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }
    
    const salt = generateSalt();
    const hashedPassword = hashPassword(req.body.password, salt);
    
    const user = new User({
      ...req.body,
      password: hashedPassword,
      salt
    });
    
    const savedUser = await user.save();
    
    // Remove password and salt from response
    const userResponse = {
      email: savedUser.email,
      username: savedUser.username,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      role: savedUser.role
    };
    
    return res.status(201).json(userResponse);
  } catch (error) {
    console.error('User creation error:', error);
    return res.status(400).json({ message: 'Error creating user' });
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const hashedPassword = hashPassword(password, user.salt);
    
    // Compare the hashed password with the one in the database
    if (hashedPassword !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const token = generateToken(user._id.toString(), TOKEN_SECRET);
    
    const userData = {
      id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };
    
    return res.status(200).json({
      token,
      user: userData
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
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

app.get('/api/users/:userId/cats', async (req, res) => {
  try {
    const cats = await Cat.find({ userId: req.params.userId });
    res.status(200).json(cats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user cats' });
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
app.post('/api/cats', async (req, res) => {
  try {
    const cat = new Cat({
      ...req.body,
      userId: req.body.userId
    });
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