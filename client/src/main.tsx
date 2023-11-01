import 'gantt-task-react/dist/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import i18n from './i18n';
import './index.tailwind.css';
import store from './redux/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <App />
            </Provider>
        </I18nextProvider>
    </React.StrictMode>,
);
