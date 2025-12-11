import User from '../models/User.js';
import Application from '../models/Application.js';
import { validationResult } from 'express-validator';

// GET /api/admin/users
export const getUsers = async (req, res) => {
    try {
        const currentUser = req.user;
        
        let query = {};
        if (currentUser.role === 'admin') {
            query = { role: 'user' };
        } else if (currentUser.role === 'superadmin') {
            query = { role: { $in: ['user', 'admin'] } };
        }
        
        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    
        const usersCounts = await Promise.all(
            users.map(async (user) => {
                const applicationsCount = await Application.countDocuments({ user_id: user._id });
                return {
                    ...user.toObject(),
                    applicationsCount
                };
            })
        );
        
        res.json({
            message: 'Liste des utilisateurs récupérée avec succès',
            data: usersCounts
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({
            message: 'Erreur serveur lors de la récupération des utilisateurs',
            error: error.message
        });
    }
};

// GET /api/admin/users/:id
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
        }

        const applicationsCount = await Application.countDocuments({ user_id: id });
        
        res.json({
            message: 'Utilisateur récupéré avec succès',
            data: {
                ...user.toObject(),
                applicationsCount
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        res.status(500).json({
            message: 'Erreur serveur lors de la récupération de l\'utilisateur',
            error: error.message
        });
    }
};

// PUT /api/admin/users/:id
export const updateUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().map(err => ({
                field: err.path || err.param,
                message: err.msg
            }));
            
            return res.status(400).json({ 
                message: 'Erreurs de validation',
                errors: formattedErrors
            });
        }

        const { id } = req.params;
        const { firstName, lastName, email, phone, role } = req.body;
        const currentUser = req.user;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
        }
        
        if (email !== undefined && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    message: 'Cet email est déjà utilisé',
                    errors: [{
                        field: 'email',
                        message: 'Cet email est déjà utilisé'
                    }]
                });
            }
        }

        if (role !== undefined) {
            if (currentUser.role !== 'superadmin') {
                return res.status(403).json({
                    message: 'Vous n\'avez pas la permission de modifier les rôles'
                });
            }
            user.role = role;
        }

        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (email !== undefined) user.email = email;
        if (phone !== undefined) user.phone = phone;

        await user.save();

        res.json({
            message: 'Utilisateur mis à jour avec succès',
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        res.status(500).json({
            message: 'Erreur serveur lors de la mise à jour de l\'utilisateur',
            error: error.message
        });
    }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
        }

        await Application.deleteMany({ user_id: id });
        
        await User.findByIdAndDelete(id);

        res.json({
            message: 'Utilisateur supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        res.status(500).json({
            message: 'Erreur serveur lors de la suppression de l\'utilisateur',
            error: error.message
        });
    }
};

