import { useAuth } from '@/providers/AuthProvider';
import {Navigate, Outlet} from 'react-router-dom'

const PrivateRoutes = () => {
    const auth = useAuth();

    const {authToken} = auth;

    return authToken ? <Outlet/> : <Navigate to='/'/>
}

export default PrivateRoutes