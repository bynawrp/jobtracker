export async function requireAdmin(req, res, next) {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
        return res.status(403).json({ 
            message: 'Accès refusé' 
        });
    }
    next();
}
