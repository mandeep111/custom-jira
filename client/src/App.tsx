import React from 'react';
import store from './redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { NotFound } from './components/NotFound';
import { Homes } from './pages/Homes';
import { Everything } from './pages/Everything';
import { Login } from './pages/Authentication';
import { Logout } from './containers/Authentication';

const App = () => {

    const [loading, setLoading] = React.useState<boolean>(true);

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
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        {/* Not Found */}
                        <Route path="*" element={<NotFound />} />
                        {/* Authentication */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/logout" element={<Logout />} />
                        {/* Homes */}
                        <Route path="/home" element={<Homes isReady={loading} />} />
                        {/* <Route path="/:spaceId/:spaceUrl" element={<Home isReady={loading} />} />
                        <Route path="/:spaceId/:spaceUrl/:projectId/:projectUrl" element={<Home isReady={loading} />} /> */}
                        {/* Everything */}
                        <Route path="/" element={<Everything isReady={loading} />} />
                        <Route path="/:spaceId/:spaceUrl" element={<Everything isReady={loading} />} />
                        <Route path="/:spaceId/:spaceUrl/:projectId/:projectUrl" element={<Everything isReady={loading} />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        </React.Fragment>
    );
};

export default App;