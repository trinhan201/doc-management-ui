import Signin from '~/pages/Signin';
import ForgotPassword from '~/pages/ForgotPassword';
import ResetPassword from '~/pages/ResetPassword';
import Home from '~/pages/Home';
import Department from '~/pages/Department';
import User from '~/pages/User';
import DocumentType from '~/pages/DocumentType';
import DocumentIn from '~/pages/DocumentIn';
import DocumentOut from '~/pages/DocumentOut';
import Page404 from '~/pages/Page404';
import DefaultLayout from '~/layouts/DefaultLayout';

const routes = [
    { path: '/signin', component: Signin, layout: null },
    { path: '/forgot-password', component: ForgotPassword, layout: null },
    { path: '/reset-password', component: ResetPassword, layout: null },
    { path: '/home', component: Home, layout: DefaultLayout },
    { path: '/departments', component: Department, layout: DefaultLayout },
    { path: '/users', component: User, layout: DefaultLayout },
    { path: '/document-types', component: DocumentType, layout: DefaultLayout },
    { path: '/documents', component: Page404, layout: null },
    { path: '/documents/documents-out', component: DocumentOut, layout: DefaultLayout },
    { path: '/documents/documents-in', component: DocumentIn, layout: DefaultLayout },
    { path: '*', component: Page404, layout: null },
];

export { routes };
