const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const chapterRoutes = require('./routes/chapter.routes');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // serve uploaded files

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chapter', chapterRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));