import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedData = async () => {
    try {
        await connectDB();

        await User.deleteMany({});
        await Application.deleteMany({});

        console.log('Collections nettoyées');

        const usersData = JSON.parse(
            readFileSync(join(__dirname, '../data/users.json'), 'utf-8')
        );
        const applicationsData = JSON.parse(
            readFileSync(join(__dirname, '../data/applications.json'), 'utf-8')
        );

        const usersToInsert = await Promise.all(
            usersData.map(async (userData) => ({
                ...userData,
                password: await bcrypt.hash(userData.password, 10)
            }))
        );

        const users = await User.insertMany(usersToInsert);
        console.log(`${users.length} utilisateurs créés`);

        const applicationsToInsert = applicationsData.map(data => {
            const userIndex = data.userId - 1;
            if (userIndex < 0 || userIndex >= users.length) {
                throw new Error(`userId ${data.userId} invalide. Doit être entre 1 et ${users.length}`);
            }
            
            return {
                user_id: users[userIndex]._id,
                title: data.title,
                company: data.company,
                link: data.link,
                status: data.status,
                notes: data.notes,
                dateApplied: data.dateApplied ? new Date(data.dateApplied) : undefined,
                reminderDate: data.reminderDate ? new Date(data.reminderDate) : undefined
            };
        });

        const applications = await Application.insertMany(applicationsToInsert);
        console.log(`${applications.length} candidatures créées`);

        console.log('Données de test créées avec succès !');
        process.exit(0);
    } catch (error) {
        console.error('Erreur lors du seed :', error);
        process.exit(1);
    }
};

seedData();

