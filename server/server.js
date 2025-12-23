import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import applicationsRoutes from './routes/applications.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

app.set('trust proxy', 1)

app.use(helmet()); 
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));
app.use(express.json()); 

connectDB(); 

app.get('/api/health', (req, res) => {
    res.json({ message: 'API JobTracker is running' });
});

app.use('/api/auth', authRoutes); // auth routes
app.use('/api/applications', applicationsRoutes); // applications routes
app.use('/api/admin', adminRoutes); // admin routes

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});