import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Fragment } from 'react';
import { routes } from '~/routes/routes';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {routes.map((route, index) => {
                        const Page = route.component;
                        let Layout;

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                    <Route path="/" element={<Navigate to="/signin" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
