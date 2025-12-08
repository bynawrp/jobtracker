import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import BlacklistedToken from '../models/BlacklistedToken.js';
import { validationResult } from 'express-validator';

const JWT_SECRET = process.env.JWT_SECRET ;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ;


const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// POST /api/auth/register
export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Erreurs de validation',
                errors: errors.array() 
            });
        }

        const { firstName, lastName, email, password, phone } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Cet email est déjà utilisé' 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone: phone || undefined
        });

        const token = generateToken(user._id);

        res.status(201).json({
            message: 'Inscription réussie',
            token,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ 
            message: 'Erreur serveur lors de l\'inscription',
            error: error.message 
        });
    }
};

// POST /api/auth/login
export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Erreurs de validation',
                errors: errors.array() 
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                message: 'Email ou mot de passe incorrect' 
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Email ou mot de passe incorrect' 
            });
        }

        const token = generateToken(user._id);

        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ 
            message: 'Erreur serveur lors de la connexion',
            error: error.message 
        });
    }
};

// POST /api/auth/logout
export const logout = async (req, res) => {
    try {
        const token = req.token;
        
        if (!token) {
            return res.status(401).json({ 
                message: 'Token manquant' 
            });
        }

        const decoded = jwt.decode(token);
        const expiresAt = new Date(decoded.exp * 1000);

        await BlacklistedToken.create({
            token,
            expiresAt
        });

        res.json({ 
            message: 'Déconnexion réussie' 
        });
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        res.status(500).json({ 
            message: 'Erreur serveur lors de la déconnexion',
            error: error.message 
        });
    }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
    try {
        res.json({
            user: {
                id: req.user._id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                role: req.user.role,
                phone: req.user.phone,
                createdAt: req.user.createdAt,
                updatedAt: req.user.updatedAt
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({ 
            message: 'Erreur serveur lors de la récupération du profil',
            error: error.message 
        });
    }
};

