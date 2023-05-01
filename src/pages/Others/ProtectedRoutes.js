import { Navigate, Outlet } from 'react-router-dom';

export const auth = () => {
    const token = localStorage.getItem('accessToken') || '';
    if (!token) {
        return false;
    }
    return true;
};
const ProtectedRoutes = () => {
    const isAuth = auth();
    return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
