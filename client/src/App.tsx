import React from 'react';
import store from './redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { NotFound } from './components/NotFound';
import { Home } from './pages/Home';
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
                        {/* Home */}
                        <Route path="/" element={<Home isReady={loading} />} />
                        <Route path="/:spaceId/:spaceUrl" element={<Home isReady={loading} />} />
                        <Route path="/:spaceId/:spaceUrl/:projectId/:projectUrl" element={<Home isReady={loading} />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        </React.Fragment>
    );
};

export default App;