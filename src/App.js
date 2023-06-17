import { useState, useEffect, createContext, useRef } from 'react';
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
    Task,
    CreateTask,
    AdminTaskDetail,
    MemberTaskDetail,
    DocumentStatistics,
    TaskStatistics,
    SystemStatistics,
} from './pages';
import ProtectedRoutes from './pages/Others/ProtectedRoutes';
import PublicRoutes from './pages/Others/PublicRoutes';
import * as authServices from '~/services/authServices';
import BlockPage from './pages/Others/BlockPage';

//Start--------------------------------------------------------------------------//
// Socket io
import { io } from 'socket.io-client';
//End--------------------------------------------------------------------------//

export const AvatarContext = createContext();

const App = () => {
    const [activeFlag, setActiveFlag] = useState(JSON.parse(localStorage.getItem('activeFlag')) || true);
    const [userRole, setUserRole] = useState(JSON.parse(localStorage.getItem('userRole')) || '');
    const [userId, setUserId] = useState(JSON.parse(localStorage.getItem('userId')) || '');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isChangeAvatar, setIsChangeAvatar] = useState(false);

    //Start--------------------------------------------------------------------------//
    // Socket io
    const socket = useRef();
    useEffect(() => {
        socket.current = io('http://localhost:5000');
    }, []);

    useEffect(() => {
        socket.current?.emit('addUser', userId);
        socket.current?.on('getUsers', (users) => {
            console.log(users);
        });
    }, [userId]);

    //End--------------------------------------------------------------------------//

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;
        const decodedToken = jwt_decode(accessToken);
        setUserRole(decodedToken.role);
        setUserId(decodedToken._id);
    }, [isSuccess]);

    useEffect(() => {
        localStorage.setItem('userRole', JSON.stringify(userRole));
    }, [userRole, isSuccess]);

    useEffect(() => {
        localStorage.setItem('userId', JSON.stringify(userId));
    }, [userId, isSuccess]);

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
                                        <DefaultLayout socket={socket}>
                                            <Dashboard socket={socket} />
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/departments"
                                    element={
                                        userRole === 'Moderator' || userRole === 'Admin' ? (
                                            <DefaultLayout socket={socket}>
                                                <Department socket={socket} />
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
                                            <DefaultLayout socket={socket}>
                                                <CreateDepartment socket={socket} title={'Chỉnh sửa phòng ban'} />
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
                                            <DefaultLayout socket={socket}>
                                                <CreateDepartment socket={socket} title={'Thêm phòng ban mới'} />
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
                                            <DefaultLayout socket={socket}>
                                                <User socket={socket} />
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
                                            <DefaultLayout socket={socket}>
                                                <CreateUser socket={socket} title="Chỉnh sửa thành viên" />
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
                                            <DefaultLayout socket={socket}>
                                                <CreateUser socket={socket} title="Thêm thành viên mới" />
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
                                            <DefaultLayout socket={socket}>
                                                <DocumentType socket={socket} />
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
                                            <DefaultLayout socket={socket}>
                                                <CreateDocumentType socket={socket} title="Chỉnh sửa loại văn bản" />
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
                                            <DefaultLayout socket={socket}>
                                                <CreateDocumentType socket={socket} title="Thêm loại văn bản mới" />
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
                                        <DefaultLayout socket={socket}>
                                            <DocumentDetail socket={socket} />
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/documents/documents-out"
                                    element={
                                        <DefaultLayout socket={socket}>
                                            <DocumentOut socket={socket} />
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/documents/documents-out/edit/:id"
                                    element={
                                        userRole === 'Moderator' || userRole === 'Admin' ? (
                                            <DefaultLayout socket={socket}>
                                                <CreateDocument
                                                    socket={socket}
                                                    title="Sửa văn bản đi"
                                                    documentIn={false}
                                                    path="documents-out"
                                                />
                                            </DefaultLayout>
                                        ) : (
                                            <Page404 />
                                        )
                                    }
                                />
                                <Route
                                    path="/documents/documents-out/create"
                                    element={
                                        userRole === 'Moderator' || userRole === 'Admin' ? (
                                            <DefaultLayout socket={socket}>
                                                <CreateDocument
                                                    socket={socket}
                                                    title="Thêm văn bản đi mới"
                                                    documentIn={false}
                                                    path="documents-out"
                                                />
                                            </DefaultLayout>
                                        ) : (
                                            <Page404 />
                                        )
                                    }
                                />
                                <Route
                                    path="/documents/documents-in"
                                    element={
                                        <DefaultLayout socket={socket}>
                                            <DocumentIn socket={socket} />
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/documents/documents-in/edit/:id"
                                    element={
                                        userRole === 'Moderator' || userRole === 'Admin' ? (
                                            <DefaultLayout socket={socket}>
                                                <CreateDocument
                                                    socket={socket}
                                                    title="Sửa văn bản đến"
                                                    documentIn={true}
                                                    path="documents-in"
                                                />
                                            </DefaultLayout>
                                        ) : (
                                            <Page404 />
                                        )
                                    }
                                />
                                <Route
                                    path="/documents/documents-in/create"
                                    element={
                                        userRole === 'Moderator' || userRole === 'Admin' ? (
                                            <DefaultLayout socket={socket}>
                                                <CreateDocument
                                                    socket={socket}
                                                    title="Thêm văn bản đến mới"
                                                    documentIn={true}
                                                    path="documents-in"
                                                />
                                            </DefaultLayout>
                                        ) : (
                                            <Page404 />
                                        )
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <DefaultLayout socket={socket}>
                                            <Profile socket={socket} />
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/tasks"
                                    element={
                                        <DefaultLayout socket={socket}>
                                            <Task socket={socket} />
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/tasks/detail/:id"
                                    element={
                                        userRole === 'Moderator' || userRole === 'Admin' ? (
                                            <DefaultLayout socket={socket}>
                                                <AdminTaskDetail socket={socket} />
                                            </DefaultLayout>
                                        ) : (
                                            <DefaultLayout socket={socket}>
                                                <MemberTaskDetail socket={socket} />
                                            </DefaultLayout>
                                        )
                                    }
                                />
                                <Route
                                    path="/tasks/create"
                                    element={
                                        userRole === 'Moderator' || userRole === 'Admin' ? (
                                            <DefaultLayout socket={socket}>
                                                <CreateTask socket={socket} title="Thêm công việc mới" />
                                            </DefaultLayout>
                                        ) : (
                                            <Page404 />
                                        )
                                    }
                                />
                                <Route
                                    path="/tasks/edit/:id"
                                    element={
                                        userRole === 'Moderator' || userRole === 'Admin' ? (
                                            <DefaultLayout socket={socket}>
                                                <CreateTask socket={socket} title="Chỉnh sửa công việc" />
                                            </DefaultLayout>
                                        ) : (
                                            <Page404 />
                                        )
                                    }
                                />
                                <Route path="/statistics" element={<Navigate to="/statistics/documents" />} />
                                <Route
                                    path="/statistics/documents"
                                    element={
                                        <DefaultLayout socket={socket}>
                                            <DocumentStatistics socket={socket} />
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/statistics/tasks"
                                    element={
                                        <DefaultLayout socket={socket}>
                                            <TaskStatistics socket={socket} />
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/statistics/systems"
                                    element={
                                        <DefaultLayout socket={socket}>
                                            <SystemStatistics socket={socket} />
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
