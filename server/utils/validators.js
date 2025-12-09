import { body } from 'express-validator';

export const registerValidation = [
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('Le prénom est requis')
        .isLength({ min: 2, max: 50 })
        .withMessage('Le prénom doit contenir entre 2 et 50 caractères'),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Le nom est requis')
        .isLength({ min: 2, max: 50 })
        .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('L\'email est requis')
        .isEmail()
        .withMessage('Format d\'email invalide')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Le mot de passe est requis')
        .custom((value) => {
            if (value.length < 8 || !/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
                throw new Error('Le mot de passe n\'est pas au format attendu');
            }
            return true;
        }),
    body('confirmPassword')
        .notEmpty()
        .withMessage('La confirmation du mot de passe est requise')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Les mots de passe ne correspondent pas');
            }
            return true;
        }),
    body('phone')
        .optional()
        .trim()
        .matches(/^[0-9+\-\s()]+$/)
        .withMessage('Format de téléphone invalide')
];

export const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('L\'email est requis')
        .isEmail()
        .withMessage('Format d\'email invalide')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Le mot de passe est requis')
];

