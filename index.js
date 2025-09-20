const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const router = require('./routes/auth.route');
// const loginRoutes = require('./routes/auth.route');
const cors = require('cors');
dotenv.config({ path: './.env.local' });   // ✅ correct path

const app = express();
app.use(cookieParser());  
const port = process.env.PORT || 3000;
app.use(cors({
  origin: ['http://localhost:3000', 'https://saas-notes-one.vercel.app/'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));// allow all origins for tests; in prod restrict origins

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use(express.json());                   // ✅ parse JSON body
connectDB();

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.use('/api', router);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
