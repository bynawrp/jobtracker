import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import BlacklistedToken from '../models/BlacklistedToken.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        // console.log(authHeader);
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'Token manquant ou invalide' 
            });
        }

        const token = authHeader.substring(7);
        
        const blacklistedToken = await BlacklistedToken.findOne({ token });
        if (blacklistedToken) {
            return res.status(401).json({ 
                message: 'Token invalide' 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password -createdAt -updatedAt'); 
        // console.log(user);
        if (!user) {
            return res.status(401).json({ 
                message: 'Utilisateur non trouvé' 
            });
        }

        req.user = user;
        req.token = token;

        // console.log(req.token);
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Token invalide' 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expiré' 
            });
        }
        return res.status(500).json({ 
            message: 'Erreur d\'authentification', 
            error: error.message 
        });
    }
};

