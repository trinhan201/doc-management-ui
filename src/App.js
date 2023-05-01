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
import { auth } from './pages/Others/ProtectedRoutes';

const App = () => {
    const isAuth = auth();
    return (
        <Router>
            <Routes>
                <Route path="/signin" element={isAuth ? <Navigate to="/dashboard" /> : <Signin />} />
                <Route path="/forgot-password" element={isAuth ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
                <Route path="/reset-password" element={isAuth ? <Navigate to="/dashboard" /> : <ResetPassword />} />
                <Route element={<ProtectedRoutes />}>
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
                            <DefaultLayout>
                                <Department />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/departments/:id"
                        element={
                            <DefaultLayout>
                                <CreateDepartment title={'Chỉnh sửa phòng ban'} />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/departments/create"
                        element={
                            <DefaultLayout>
                                <CreateDepartment title={'Thêm phòng ban mới'} />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <DefaultLayout>
                                <User />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/users/:id"
                        element={
                            <DefaultLayout>
                                <CreateUser title="Chỉnh sửa thành viên" />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/users/create"
                        element={
                            <DefaultLayout>
                                <CreateUser title="Thêm thành viên mới" />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/document-types"
                        element={
                            <DefaultLayout>
                                <DocumentType />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/document-types/:id"
                        element={
                            <DefaultLayout>
                                <CreateDocumentType title="Chỉnh sửa loại văn bản" />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/document-types/create"
                        element={
                            <DefaultLayout>
                                <CreateDocumentType title="Thêm loại văn bản mới" />
                            </DefaultLayout>
                        }
                    />
                    <Route path="/documents" element={<Page404 />} />
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
                </Route>
                <Route path="*" element={<Page404 />} />
                <Route path="/" element={<Navigate to="/signin" />} />
            </Routes>
        </Router>
    );
};

export default App;
