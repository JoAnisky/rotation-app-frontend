import {Navigate, Outlet} from 'react-router-dom'

const PrivateRoutes = () => {
    const auth = {'token': false};

    return auth.token ? <Outlet/> : <Navigate to='/'/>
}

export default PrivateRoutes