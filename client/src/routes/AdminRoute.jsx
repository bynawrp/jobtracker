import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
    const { user } = useAuth();
    
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
        return <Navigate to="/dashboard?error=no_admin" replace />;
    }
    
    return children;
}