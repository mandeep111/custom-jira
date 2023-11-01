import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { NotFound } from './components/NotFound';
import { Logout } from './containers/Authentication';
import { Login } from './pages/Authentication';
import { Homes } from './pages/Homes';
import { Project } from './pages/Project';
import { Reports } from './pages/Reports';
import { getTheme } from './redux/Theme/selectors';

const App = () => {

    const [loading, setLoading] = React.useState<boolean>(true);
    const theme = useSelector(getTheme);

    React.useEffect(() => {
        const delay: number = (window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart) + 100;
        const timer: NodeJS.Timeout = setTimeout(() => {
            setLoading(false);
        }, delay);
        return () => {
            clearTimeout(timer);
        };
    }, [setLoading]);

    return (
        <React.Fragment>
            <BrowserRouter>
                <Routes>
                    {/* Not Found */}
                    <Route path="*" element={<NotFound />} />
                    {/* Authentication */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                    {/* Homes */}
                    <Route path="/" element={<Homes isReady={loading} />} />
                    {/* Project */}
                    <Route path="/no-space" element={<Project isReady={loading} />} />
                    <Route path="/:spaceId/:spaceUrl" element={<Project isReady={loading} />} />
                    <Route path="/:spaceId/:spaceUrl/:projectId/:projectUrl" element={<Project isReady={loading} />} />
                    {/* Report */}
                    <Route path="/report" element={<Reports isReady={loading} />} />
                    <Route path="/report/:projectId/:projectUrl" element={<Reports isReady={loading} />} />
                </Routes>
            </BrowserRouter>
            <ToastContainer
                style={{ minWidth: '400px', width: 'auto' }}
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                theme={theme}
                pauseOnHover
            />
        </React.Fragment>
    );
};

export default App;