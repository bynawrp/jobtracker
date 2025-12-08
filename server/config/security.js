import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: 'Trop de tentatives, veuillez réessayer plus tard.',
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Trop de tentatives, veuillez réessayer plus tard.',
    standardHeaders: true,
    legacyHeaders: false,
});

