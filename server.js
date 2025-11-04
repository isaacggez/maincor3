// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
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

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route handlers
const authRoutes = require("./src/routes/authRoutes");
app.use("/auth", authRoutes);

// API root route
app.get('/api', (req, res) => {
    res.json({
        status: 'online',
        message: 'MainCore API v1.0',
        docs: {
            auth: {
                register: '/auth/registrar',
                login: '/auth/login'
            }
        }
    });
});

// Catch all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
