import { useState, useEffect, createContext } from 'react';
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
    DocumentDetail,
    Page404,
    Profile,
    CreateDepartment,
    CreateDocumentType,
    DefaultLayout,
    CreateUser,
    CreateDocument,
    Tasks,
    CreateTask,
    AdminTaskDetail,
    MemberTaskDetail,
} from './pages';
import ProtectedRoutes from './pages/Others/ProtectedRoutes';
import PublicRoutes from './pages/Others/PublicRoutes';
import * as authServices from '~/services/authServices';
import BlockPage from './pages/Others/BlockPage';

export const AvatarContext = createContext();

const App = () => {
    const [activeFlag, setActiveFlag] = useState(JSON.parse(localStorage.getItem('activeFlag')) || true);
    const [userRole, setUserRole] = useState(JSON.parse(localStorage.getItem('userRole')) || '');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isChangeAvatar, setIsChangeAvatar] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;
        const decodedToken = jwt_decode(accessToken);
        setUserRole(decodedToken.role);
    }, [isSuccess]);

    useEffect(() => {
        localStorage.setItem('userRole', JSON.stringify(userRole));
    }, [userRole, isSuccess]);

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
    }, [isSuccess]);

    useEffect(() => {
        localStorage.setItem('activeFlag', JSON.stringify(activeFlag));
    }, [activeFlag, isSuccess]);

    return (
        <AvatarContext.Provider value={{ isChangeAvatar, setIsChangeAvatar }}>
            <Router>
                <Routes>
                    <Route element={<PublicRoutes />}>
                        <Route path="/signin" element={<Signin setIsSuccess={() => setIsSuccess(!isSuccess)} />} />
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
                                        userRole === 'Moderator' || userRole === 'Admin' ? (
                                            <DefaultLayout>
                                                <Department />
                                            </DefaultLayout>
                                        ) : (
                                            <Page404 />
                                        )
                                    }
                                />
                                <Route
                                    path="/departments/edit/:id"
                                    element={
                                        userRole === 'Moderator' || userRole === 'Admin' ? (
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
                                        userRole === 'Moderator' || userRole === 'Admin' ? (
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
                                    path="/users/edit/:id"
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
                                        userRole === 'Moderator' || userRole === 'Admin' ? (
                                            <DefaultLayout>
                                                <DocumentType />
                                            </DefaultLayout>
                                        ) : (
                                            <Page404 />
                                        )
                                    }
                                />
                                <Route
                                    path="/document-types/edit/:id"
                                    element={
                                        userRole === 'Moderator' || userRole === 'Admin' ? (
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
                                        userRole === 'Moderator' || userRole === 'Admin' ? (
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
                                    path="/documents/detail/:id"
                                    element={
                                        <DefaultLayout>
                                            <DocumentDetail />
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/documents/documents-out"
                                    element={
                                        <DefaultLayout>
                                            <DocumentOut />
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/documents/documents-out/edit/:id"
                                    element={
                                        <DefaultLayout>
                                            <CreateDocument
                                                title="Sửa văn bản đi"
                                                documentIn={false}
                                                path="documents-out"
                                            />
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/documents/documents-out/create"
                                    element={
                                        <DefaultLayout>
                                            <CreateDocument
                                                title="Thêm văn bản đi mới"
                                                documentIn={false}
                                                path="documents-out"
                                            />
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
                                    path="/documents/documents-in/edit/:id"
                                    element={
                                        <DefaultLayout>
                                            <CreateDocument
                                                title="Sửa văn bản đến"
                                                documentIn={true}
                                                path="documents-in"
                                            />
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/documents/documents-in/create"
                                    element={
                                        <DefaultLayout>
                                            <CreateDocument
                                                title="Thêm văn bản đến mới"
                                                documentIn={true}
                                                path="documents-in"
                                            />
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
                                <Route
                                    path="/tasks"
                                    element={
                                        <DefaultLayout>
                                            <Tasks />
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/tasks/detail/:id"
                                    element={
                                        <DefaultLayout>
                                            {/* <AdminTaskDetail /> */}
                                            <MemberTaskDetail />
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/tasks/create"
                                    element={
                                        <DefaultLayout>
                                            <CreateTask title="Thêm công việc mới" />
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/tasks/edit/:id"
                                    element={
                                        <DefaultLayout>
                                            <CreateTask title="Chỉnh sửa công việc" />
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
        </AvatarContext.Provider>
    );
};

export default App;
