import {Navigate, Outlet} from 'react-router-dom'
import { useAuth } from '@/hooks';

const PrivateRoutes = () => {
    const { authToken, isAuthenticated, userRole } = useAuth();
  
    const checkAuthorization = () => {
        // Si l'utilisateur a un token et le bon rôle, il est autorisé
        if (authToken && (userRole === 'ROLE_GAMEMASTER' || userRole === 'ROLE_ADMIN')) {
          return true;
        }
        
        // Si pas de token mais authentifié via code PIN
        // et si le rôle est celui d'un participant ou animateur
        if (isAuthenticated && (userRole === 'ROLE_PARTICIPANT' || userRole === 'ROLE_ANIMATOR')) {
          return true;
        }
    
        // Par défaut, pas autorisé
        return false;
      };
  
    return checkAuthorization() ? <Outlet /> : <Navigate to="/" />;
  };

export default PrivateRoutes