import { Navigate, Outlet } from 'react-router-dom';

const auth = () => {
    const token = localStorage.getItem('accessToken') || '';
    if (!token) {
        return false;
    }
    return true;
};

const PublicRoutes = () => {
    const isAuth = auth();
    return isAuth ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoutes;
