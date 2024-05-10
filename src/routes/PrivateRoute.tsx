import {Navigate, Outlet} from 'react-router-dom'

const PrivateRoutes = () => {
    const auth = {'token': true};

    return auth.token ? <Outlet/> : <Navigate to='/tamere'/>
}

export default PrivateRoutes