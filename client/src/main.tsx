import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import './index.tailwind.css';
import 'react-toastify/dist/ReactToastify.css';
import 'gantt-task-react/dist/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <I18nextProvider i18n={i18n}>
            <App />
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
                pauseOnHover
            />
        </I18nextProvider>
    </React.StrictMode>,
);
