import {Router} from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

const authenticrouter = Router();

authenticrouter.post('/register', async (req, res) => {
  const { username, email, fullName, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Input Validation
  if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
    return res.status(400).json(new ApiError(400, 'All fields are required'));
  }

  // Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email }]
  });

  if (existedUser) {
    return res.status(409).json(new ApiError(409, 'User already exists'));
  }

  const newUser = new User({ username, email, fullName, password: hashedPassword, role });

  await newUser.save();

  return res.status(201).json(new ApiResponse(201, 'User registered successfully'));
});

authenticrouter.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json(new ApiError(400, 'Invalid credentials'));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json(new ApiError(400, 'Invalid credentials'));
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email, fullName: user.fullName, role: user.role },
    'secretkey',
    { expiresIn: '1h' }
  );

  return res.json({ token });
});


export default authenticrouter;
