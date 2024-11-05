const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mcache = require('memory-cache');
const legislativeRoutes = require('./routes/legislativeRoutes');
const config = require('./config/config');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Cache middleware
const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = '__express__' + req.originalUrl || req.url;
    const cachedBody = mcache.get(key);
    
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

// API Routes with caching
app.use('/api/legislative', cacheMiddleware(300), legislativeRoutes);

// GNews API proxy with caching
app.get('/api/news', cacheMiddleware(300), async (req, res) => {
  try {
    const GNEWS_API_KEY = process.env.GNEWS_API_KEY || 'da1bed8486239fb1c07410cf138453f5';
    const query = req.query.q || 'us government';
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=us&max=10&apikey=${GNEWS_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors[0]);
    }
    
    res.json(data);
  } catch (error) {
    console.error('News API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || config.server.port || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});