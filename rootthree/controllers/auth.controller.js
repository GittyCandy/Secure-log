import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';

// Helper function to create JWT token
// In auth.controller.js
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
      algorithm: 'HS256' // Explicitly specify algorithm
    }
  );
};

// Update the register function to remove special admin handling
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      const error = new Error('Please provide all required fields');
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 8) {
      const error = new Error('Password must be at least 8 characters');
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Determine roles based on selection
    let is_buyer = false;
    let is_seller = false;

    if (role === 'buyer') is_buyer = true;
    else if (role === 'seller') is_seller = true;
    else if (role === 'both') {
      is_buyer = true;
      is_seller = true;
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      is_buyer,
      is_seller,
      is_admin: false // Regular users are never admins
    });

    const token = generateToken(user.id);

    // Set secure HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_buyer: user.is_buyer,
        is_seller: user.is_seller,
        is_admin: user.is_admin
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Simple response - let frontend handle redirect
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin
      }
    });

  } catch (error) {
    next(error);
  }
};

// Add admin dashboard function
export const getAdminDashboard = async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    res.sendFile('admin-dashboard.html', { root: './public' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getDashboard = async (req, res) => {
  try {
    // This will only be called if authenticate middleware passes
    res.sendFile('dashboard.html', { root: './public' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};