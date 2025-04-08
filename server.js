const express = require('express');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');
const categoryRoutes = require('./Routes/categoriesRoutes'); // Import category routes
require('dotenv').config(); // Load environment variables

const app = express();
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());
// Middleware
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes); // Mount category routes under /categories

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});