import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: { message: 'Trop de tentatives, veuillez réessayer plus tard.' },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Trop de tentatives, veuillez réessayer plus tard.' },
    standardHeaders: true,
    legacyHeaders: false,
});

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Trop de tentatives, veuillez réessayer plus tard.' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.user?._id?.toString() || req.user?.id?.toString() || req.ip;
    }
});

