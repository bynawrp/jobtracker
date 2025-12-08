import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { limiter, authLimiter } from './config/security.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

app.use(helmet());
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));
app.use(limiter);
app.use(express.json());

connectDB();

app.get('/api/health', (res) => {
    res.json({ message: 'API JobTracker is running' });
});

app.use('/api/auth', authLimiter, authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});