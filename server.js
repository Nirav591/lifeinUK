const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const chapterRoutes = require('./routes/chapter.routes');
const lessonRoutes = require('./routes/lesson.routes');
const testRoutes = require('./routes/test.routes');
const questionRoutes = require('./routes/question.routes');
const examRoutes = require('./routes/exam.routes');
const examQuestionRoutes = require('./routes/examQuestion.routes');



dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // serve uploaded files

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chapter', chapterRoutes);
app.use('/api/lesson', lessonRoutes);
app.use('/api/test', testRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/exam-questions', examQuestionRoutes);

const PORT = process.env.PORT || 6350;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));