import Application from '../models/Application.js';
import { validationResult } from 'express-validator';

// GET /api/applications
export const getApplications = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const { status, company } = req.query;
        const filter = { user_id: userId };
        
        if (status) {
            filter.status = status;
        }
        
        if (company) {
            filter.company = { $regex: company, $options: 'i' };
        }
        
        const applications = await Application.find(filter)
            .sort({ createdAt: -1 })
            .select('-__v');
        
        res.json({
            message: 'Candidatures récupérées avec succès',
            data: applications
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des candidatures:', error);
        res.status(500).json({
            message: 'Erreur serveur lors de la récupération des candidatures',
            error: error.message
        });
    }
};

// POST /api/applications
export const createApplication = async (req, res) => {
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

        const userId = req.user._id;
        const { title, company, link, status, dateApplied, reminderDate, notes } = req.body;

        const application = await Application.create({
            user_id: userId,
            title,
            company,
            link: link || undefined,
            status: status || 'pending',
            dateApplied: dateApplied ? new Date(dateApplied) : undefined,
            reminderDate: reminderDate ? new Date(reminderDate) : undefined,
            notes: notes || undefined
        });

        res.status(201).json({
            message: 'Candidature créée avec succès',
            data: application
        });
    } catch (error) {
        console.error('Erreur lors de la création de la candidature:', error);
        res.status(500).json({
            message: 'Erreur serveur lors de la création de la candidature',
            error: error.message
        });
    }
};

// GET /api/applications/:id
export const getApplication = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const application = await Application.findOne({
            _id: id,
            user_id: userId
        }).select('-__v');

        if (!application) {
            return res.status(404).json({
                message: 'Candidature non trouvée'
            });
        }

        res.json({
            message: 'Candidature récupérée avec succès',
            data: application
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la candidature:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'ID de candidature invalide'
            });
        }
        
        res.status(500).json({
            message: 'Erreur serveur lors de la récupération de la candidature',
            error: error.message
        });
    }
};

// PUT /api/applications/:id
export const updateApplication = async (req, res) => {
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

        const userId = req.user._id;
        const { id } = req.params;
        const { title, company, link, status, dateApplied, reminderDate, notes } = req.body;

        const application = await Application.findOne({
            _id: id,
            user_id: userId
        });

        if (!application) {
            return res.status(404).json({
                message: 'Candidature non trouvée'
            });
        }

        if (title !== undefined) application.title = title;
        if (company !== undefined) application.company = company;
        if (link !== undefined) application.link = link || undefined;
        if (status !== undefined) application.status = status;
        if (dateApplied !== undefined) application.dateApplied = dateApplied ? new Date(dateApplied) : undefined;
        if (reminderDate !== undefined) {
            application.reminderDate = (reminderDate && reminderDate !== '' && reminderDate !== null) 
                ? new Date(reminderDate) 
                : null;
        }
        if (notes !== undefined) application.notes = notes || undefined;

        await application.save();

        res.json({
            message: 'Candidature mise à jour avec succès',
            data: application
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la candidature:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'ID de candidature invalide'
            });
        }
        
        res.status(500).json({
            message: 'Erreur serveur lors de la mise à jour de la candidature',
            error: error.message
        });
    }
};

// DELETE /api/applications/:id
export const deleteApplication = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const application = await Application.findOneAndDelete({
            _id: id,
            user_id: userId
        });

        if (!application) {
            return res.status(404).json({
                message: 'Candidature non trouvée'
            });
        }

        res.json({
            message: 'Candidature supprimée avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de la candidature:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'ID de candidature invalide'
            });
        }
        
        res.status(500).json({
            message: 'Erreur serveur lors de la suppression de la candidature',
            error: error.message
        });
    }
};

