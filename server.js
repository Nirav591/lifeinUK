const express   = require('express');
const dotenv    = require('dotenv');
const cors      = require('cors');

// route files
const authRoutes         = require('./routes/auth.routes');
const chapterRoutes      = require('./routes/chapter.routes');
const lessonRoutes       = require('./routes/lesson.routes');
const testRoutes         = require('./routes/test.routes');
const questionRoutes     = require('./routes/question.routes');
const examRoutes         = require('./routes/exam.routes');
const examQuestionRoutes = require('./routes/examQuestion.routes');

// ──────────────────────────────────────────────
dotenv.config();
const app = express();

// CORS – allow only your front-end
app.use(cors({
  origin: 'http://localhost:3000',               // adjust for prod
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-key']
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ─── Access-Key protection ─────────────────────
const requireAccessKey = require('./middleware/accessKey');
app.use('/api', requireAccessKey);               // anything starting with /api/*

// ─── Routes (unchanged) ────────────────────────
app.use('/api/auth',           authRoutes);
app.use('/api/chapter',        chapterRoutes);
app.use('/api/lesson',         lessonRoutes);
app.use('/api/test',           testRoutes);
app.use('/api/question',       questionRoutes);
app.use('/api/exam',           examRoutes);
app.use('/api/exam-questions', examQuestionRoutes);

// ─── Server ────────────────────────────────────
const PORT = process.env.PORT || 6350;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));