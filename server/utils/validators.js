import { body } from 'express-validator';

const validatePhone = (value) => {
    if (!value || value === '') {
        return true;
    }
    const digitsOnly = value.replace(/[^\d+]/g, '');
    const digitCount = digitsOnly.replace(/\+/g, '').length;
    if (digitCount < 10) {
        throw new Error('Le numéro de téléphone doit contenir au moins 10 chiffres');
    }
    return true;
};

const validateUrl = (value) => {
    if (!value || value === '') {
        return true;
    }
    try {
        new URL(value);
        return true;
    } catch {
        throw new Error('Lien invalide. Utilisez une URL complète (ex: https://exemple.com)');
    }
};

const validateReminderDate = (value, { req }) => {
    if (!value || value === '' || value === null) {
        return true;
    }
    if (!/^\d{4}-\d{2}-\d{2}/.test(value)) {
        throw new Error('Date de rappel invalide (format AAAA-MM-JJ)');
    }
    if (req.body.dateApplied && new Date(value) < new Date(req.body.dateApplied)) {
        throw new Error('La date de rappel doit être après la date de candidature');
    }
    return true;
};

// validations register form
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
        .optional({ checkFalsy: true })
        .trim()
        .custom(validatePhone)
        .withMessage('Format de téléphone invalide'),
];

// validations login form
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

// validations application form
export const applicationValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Le titre est requis')
        .isLength({ min: 2, max: 120 })
        .withMessage('Le titre doit contenir entre 2 et 120 caractères'),
    body('company')
        .trim()
        .notEmpty()
        .withMessage('Le nom de l\'entreprise est requis')
        .isLength({ min: 2, max: 120 })
        .withMessage('Le nom de l\'entreprise doit contenir entre 2 et 120 caractères'),
    body('link')
        .optional({ checkFalsy: true })
        .trim()
        .custom(validateUrl),
    body('status')
        .optional()
        .isIn(['pending', 'interview', 'rejected', 'applied'])
        .withMessage('Statut invalide'),
    body('dateApplied')
        .optional()
        .isISO8601()
        .withMessage('Date de candidature invalide (format AAAA-MM-JJ)'),
    body('reminderDate')
        .optional({ checkFalsy: true })
        .custom(validateReminderDate),
    body('notes')
        .optional()
        .trim()
        .isString()
        .withMessage('Le champ notes doit être du texte')
];


// validations users form
export const userValidation = [
    body('firstName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Le prénom ne peut pas être vide')
        .isLength({ min: 2, max: 50 })
        .withMessage('Le prénom doit contenir entre 2 et 50 caractères'),
    body('lastName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Le nom ne peut pas être vide')
        .isLength({ min: 2, max: 50 })
        .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
    body('email')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('L\'email ne peut pas être vide')
        .isEmail()
        .withMessage('Format d\'email invalide')
        .normalizeEmail(),
    body('phone')
        .optional({ checkFalsy: true })
        .trim()
        .custom(validatePhone)
        .withMessage('Format de téléphone invalide'),
    body('role')
        .optional()
        .isIn(['user', 'admin', 'superadmin'])
        .withMessage('Rôle invalide')
];

