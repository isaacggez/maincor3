// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./src/config/db");

const app = express();

// CORS configuration
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'https://maincor3.vercel.app',
        'https://maincor3-7hvksownh-isaacggezs-projects.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handlers
const authRoutes = require("./src/routes/authRoutes");
app.use("/auth", authRoutes);

// Remove any app.options('*', cors()) calls
// Instead use specific preflight routes
app.options('/auth/registrar', cors());
app.options('/auth/login', cors());

// Health check route
app.get('/ping', (req, res) => {
    res.send('pong');
});

// For local development only
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
