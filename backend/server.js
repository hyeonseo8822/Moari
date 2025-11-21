const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const clubRoutes = require('./routes/clubs'); // Add this line

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase payload size limit
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Also increase for urlencoded data if any

app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes); // Add this line

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
