import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import helmet from 'helmet';

import { PORT } from './config/env.js';
import { initializeDatabase } from './config/database.js';
import authRouter from './routes/auth.routes.js';
import protectedRouter from './routes/protected.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import authenticate from './middlewares/auth.middleware.js'; // Add this import
import arcjetMiddleware from './middlewares/arcjet.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csrfProtection = csrf({ cookie: true });
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(arcjetMiddleware);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/protected', protectedRouter);
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:"]
  }
}));
// HTML Routes with proper authentication
app.get('/dashboard', (req, res, next) => {
  // This route will only be accessible with valid JWT cookie
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Redirect to login if trying to access dashboard directly
app.get('/dashboard.html', (req, res) => {
  res.redirect('/login.html');
});

app.get('/userpage',csrfProtection, authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'userpage.html'));
});

app.get('/greeting', authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'greeting.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard.html', (req, res) => res.redirect('/login.html'));
app.get('/userpage.html', (req, res) => res.redirect('/login.html'));
app.get('/greeting.html', (req, res) => res.redirect('/login.html'));

// Error handling
app.use(errorMiddleware);

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
});

export default app;