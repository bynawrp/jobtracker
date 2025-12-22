// middleware admin/superadmin only
export async function requireAdmin(req, res, next) {
    // console.log(req.user);
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
        return res.status(403).json({ 
            message: 'Accès refusé' 
        });
    }
    next();
}
