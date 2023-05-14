import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
    Signin,
    ForgotPassword,
    ResetPassword,
    Dashboard,
    Department,
    User,
    DocumentType,
    DocumentIn,
    DocumentOut,
    Page404,
    Profile,
    CreateDepartment,
    CreateDocumentType,
    DefaultLayout,
    CreateUser,
    CreateDocument,
} from './pages';
import ProtectedRoutes from './pages/Others/ProtectedRoutes';
import PublicRoutes from './pages/Others/PublicRoutes';
import * as authServices from '~/services/authServices';
import BlockPage from './pages/Others/BlockPage';

const App = () => {
    const [activeFlag, setActiveFlag] = useState(JSON.parse(localStorage.getItem('activeFlag')) || true);
    const [userRole, setUserRole] = useState(JSON.parse(localStorage.getItem('userRole')) || '');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;
        const decodedToken = jwt_decode(accessToken);
        setUserRole(decodedToken.role);
    }, [isSuccess]);

    useEffect(() => {
        localStorage.setItem('userRole', JSON.stringify(userRole));
    }, [userRole]);

    useEffect(() => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return;
        const decodedToken = jwt_decode(refreshToken);
        let currentDate = new Date();
        if (decodedToken.exp * 1000 < currentDate.getTime()) {
            return localStorage.clear();
        }
    }, []);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;
        const fetchApi = async () => {
            const res = await authServices.getCurrUser();
            setActiveFlag(res.isActived);
        };
        fetchApi();
    }, []);

    useEffect(() => {
        localStorage.setItem('activeFlag', JSON.stringify(activeFlag));
    }, [activeFlag]);

    console.log(activeFlag);

    return (
        <Router>
            <Routes>
                <Route element={<PublicRoutes />}>
                    <Route path="/signin" element={<Signin setIsSuccess={setIsSuccess} />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Route>
                <Route element={<ProtectedRoutes />}>
                    {activeFlag === true ? (
                        <>
                            <Route
                                path="/dashboard"
                                element={
                                    <DefaultLayout>
                                        <Dashboard />
                                    </DefaultLayout>
                                }
                            />
                            <Route
                                path="/departments"
                                element={
                                    userRole === 'Admin' ? (
                                        <DefaultLayout>
                                            <Department />
                                        </DefaultLayout>
                                    ) : (
                                        <Page404 />
                                    )
                                }
                            />
                            <Route
                                path="/departments/:id"
                                element={
                                    userRole === 'Admin' ? (
                                        <DefaultLayout>
                                            <CreateDepartment title={'Chỉnh sửa phòng ban'} />
                                        </DefaultLayout>
                                    ) : (
                                        <Page404 />
                                    )
                                }
                            />
                            <Route
                                path="/departments/create"
                                element={
                                    userRole === 'Admin' ? (
                                        <DefaultLayout>
                                            <CreateDepartment title={'Thêm phòng ban mới'} />
                                        </DefaultLayout>
                                    ) : (
                                        <Page404 />
                                    )
                                }
                            />
                            <Route
                                path="/users"
                                element={
                                    userRole === 'Admin' ? (
                                        <DefaultLayout>
                                            <User />
                                        </DefaultLayout>
                                    ) : (
                                        <Page404 />
                                    )
                                }
                            />
                            <Route
                                path="/users/:id"
                                element={
                                    userRole === 'Admin' ? (
                                        <DefaultLayout>
                                            <CreateUser title="Chỉnh sửa thành viên" />
                                        </DefaultLayout>
                                    ) : (
                                        <Page404 />
                                    )
                                }
                            />
                            <Route
                                path="/users/create"
                                element={
                                    userRole === 'Admin' ? (
                                        <DefaultLayout>
                                            <CreateUser title="Thêm thành viên mới" />
                                        </DefaultLayout>
                                    ) : (
                                        <Page404 />
                                    )
                                }
                            />
                            <Route
                                path="/document-types"
                                element={
                                    userRole === 'Admin' ? (
                                        <DefaultLayout>
                                            <DocumentType />
                                        </DefaultLayout>
                                    ) : (
                                        <Page404 />
                                    )
                                }
                            />
                            <Route
                                path="/document-types/:id"
                                element={
                                    userRole === 'Admin' ? (
                                        <DefaultLayout>
                                            <CreateDocumentType title="Chỉnh sửa loại văn bản" />
                                        </DefaultLayout>
                                    ) : (
                                        <Page404 />
                                    )
                                }
                            />
                            <Route
                                path="/document-types/create"
                                element={
                                    userRole === 'Admin' ? (
                                        <DefaultLayout>
                                            <CreateDocumentType title="Thêm loại văn bản mới" />
                                        </DefaultLayout>
                                    ) : (
                                        <Page404 />
                                    )
                                }
                            />
                            <Route path="/documents" element={<Navigate to="/documents/documents-in" />} />
                            <Route
                                path="/documents/documents-out"
                                element={
                                    <DefaultLayout>
                                        <DocumentOut />
                                    </DefaultLayout>
                                }
                            />
                            <Route
                                path="/documents/documents-out/:id"
                                element={
                                    <DefaultLayout>
                                        <CreateDocument title="Sửa văn bản đi" />
                                    </DefaultLayout>
                                }
                            />
                            <Route
                                path="/documents/documents-out/create"
                                element={
                                    <DefaultLayout>
                                        <CreateDocument title="Thêm văn bản đi mới" />
                                    </DefaultLayout>
                                }
                            />
                            <Route
                                path="/documents/documents-in"
                                element={
                                    <DefaultLayout>
                                        <DocumentIn />
                                    </DefaultLayout>
                                }
                            />
                            <Route
                                path="/documents/documents-in/:id"
                                element={
                                    <DefaultLayout>
                                        <CreateDocument title="Sửa văn bản đến" />
                                    </DefaultLayout>
                                }
                            />
                            <Route
                                path="/documents/documents-in/create"
                                element={
                                    <DefaultLayout>
                                        <CreateDocument title="Thêm văn bản đến mới" />
                                    </DefaultLayout>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <DefaultLayout>
                                        <Profile />
                                    </DefaultLayout>
                                }
                            />
                        </>
                    ) : (
                        <Route path="*" element={<BlockPage />} />
                    )}
                </Route>
                <Route path="*" element={<Page404 />} />
                <Route path="/" element={<Navigate to="/signin" />} />
            </Routes>
        </Router>
    );
};

export default App;
