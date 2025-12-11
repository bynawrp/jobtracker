import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        await User.deleteMany({});
        await Application.deleteMany({});

        console.log('Collections nettoyées');

        const users = await User.insertMany([
            {
                firstName: 'Lucas',
                lastName: 'JEAN',
                email: 'lucas.jean@test.com',
                password: await bcrypt.hash('MyPassword123!', 10),
                role: 'user'
            },
            {
                firstName: 'Steve',
                lastName: 'ROGER',
                email: 'steve.roger@test.com',
                password: await bcrypt.hash('MyPassword123!', 10),
                role: 'user',
                phone: '0687654321'
            },
            {
                firstName: 'Super',
                lastName: 'Admin',
                email: 'admin@example.com',
                password: await bcrypt.hash('Admin123!', 10), 
                role: 'admin'
            }
        ]);
        console.log(`${users.length} utilisateurs créés`);

        const applications = await Application.insertMany([
            {
                user_id: users[0]._id,
                title: 'Développeur Full Stack',
                company: 'Tech Corp',
                link: 'https://example.com/job1',
                status: 'applied',
                notes: 'Candidature envoyée le 15/01/2024',
                dateApplied: new Date('2024-01-15'),
                reminderDate: new Date('2024-01-22')
            },
            {
                user_id: users[0]._id,
                title: 'Développeur React',
                company: 'StartupXYZ',
                link: 'https://example.com/job2',
                status: 'interview',
                notes: 'Entretien prévu le 25/01/2024',
                dateApplied: new Date('2024-01-10'),
                reminderDate: new Date('2024-01-25')
            },
            {
                user_id: users[0]._id,
                title: 'Développeur Backend',
                company: 'BigTech',
                link: 'https://example.com/job3',
                status: 'pending',
                notes: 'À postuler cette semaine',
                dateApplied: new Date('2025-01-20'),
                reminderDate: new Date('2025-12-12')
            },
            {
                user_id: users[1]._id,
                title: 'Designer UI/UX',
                company: 'DesignStudio',
                link: 'https://example.com/job4',
                status: 'rejected',
                notes: 'Refusé - manque d\'expérience',
                dateApplied: new Date('2024-01-05'),
                reminderDate: null
            },
            {
                user_id: users[1]._id,
                title: 'Product Manager',
                company: 'ProductCo',
                link: 'https://example.com/job5',
                status: 'applied',
                notes: 'En attente de réponse',
                dateApplied: new Date('2024-01-12'),
                reminderDate: new Date('2024-01-19')
            },
            {
                user_id: users[0]._id,
                title: 'Développeur Full Stack',
                company: 'Tech Corp',
                link: 'https://example.com/job6',
                status: 'applied',
                notes: 'Candidature envoyée le 15/01/2024',
                dateApplied: new Date('2024-01-15'),
                reminderDate: new Date('2024-01-22')
            },
            {
                user_id: users[0]._id,
                title: 'Développeur Full Stack',
                company: 'Google',
                link: 'https://example.com/job7',
                status: 'interview',
                notes: 'Entretien prévu le 25/01/2024',
                dateApplied: new Date('2024-01-10'),
                reminderDate: new Date('2024-01-25')
            },
            {
                user_id: users[1]._id,
                title: 'Développeur Full Stack',
                company: 'Apple',
                link: 'https://example.com/job8',
                status: 'rejected',
                notes: 'Refusé - manque d\'expérience',
                dateApplied: new Date('2024-01-05'),
                reminderDate: null
            }
        ]);
        console.log(`${applications.length} candidatures créées`);

        console.log('Données de test créées avec succès !');
        process.exit(0);
    } catch (error) {
        console.error('Erreur lors du seed :', error);
        process.exit(1);
    }
};

seedData();

