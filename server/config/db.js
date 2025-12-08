import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        const db = await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB connecté : ${db.connection.host}`);
        return db;
    } catch (error) {
        console.error(`Erreur de connexion MongoDB : ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;