import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signin from '~/pages/Authentications/Signin';
import ForgotPassword from '~/pages/Authentications/ForgotPassword';
import ResetPassword from '~/pages/Authentications/ResetPassword';
import Dashboard from '~/pages/Others/Dashboard';
import Department from '~/pages/Departments/Department';
import User from '~/pages/Users/User';
import DocumentType from '~/pages/DocumentTypes/DocumentType';
import DocumentIn from '~/pages/Documents/DocumentIn';
import DocumentOut from '~/pages/Documents/DocumentOut';
import Page404 from '~/pages/Others/Page404';
import Profile from '~/pages/Others/Profile';
import CreateDepartment from '~/pages/Departments/CreateDepartment';
import CreateDocumentType from './pages/DocumentTypes/CreateDocumentType';
import DefaultLayout from '~/layouts/DefaultLayout';
import CreateUser from './pages/Users/CreateUser';
import CreateDocument from './pages/Documents/CreateDocument';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/signin" element={<Signin />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
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
                <Route path="*" element={<Page404 />} />
                <Route path="/" element={<Navigate to="/signin" />} />
            </Routes>
        </Router>
    );
};

export default App;
