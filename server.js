const express = require('express');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');
const categoryRoutes = require('./Routes/categoriesRoutes'); // Import category routes
const serviceRoutes = require('./Routes/servicesRoutes'); // Import category routes
const employeeRoutes = require('./Routes/employeeRoutes');
const scheduleRoutes = require('./Routes/scheduleRoutes');
const assignedServiceRoutes = require('./Routes/assignedServiceRoutes');
const appointmentRoutes = require('./Routes/appointmentRoutes');
const commentRoutes = require('./Routes/commentRoutes');
const repliesroutes = require('./Routes/repliesRoutes');
const ratingRoutes = require('./Routes/ratingRoutes');
const notificationRoutes = require('./Routes/notificationRoutes');
const paymentRoutes = require('./Routes/paymentRoutes');

require('dotenv').config(); // Load environment variables
const app = express();
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());
// Middleware

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes); // Mount category routes under /categories
app.use('/services',serviceRoutes ); // Mount category routes under /categories
app.use('/employees', employeeRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/assignedService', assignedServiceRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/comments', commentRoutes);
app.use('/replies', repliesroutes);
app.use('/ratings', ratingRoutes);
app.use('/notifications', notificationRoutes);
app.use('/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});