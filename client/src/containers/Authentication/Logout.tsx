import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Container = () => {

    const navigate = useNavigate();

    const handleDestroySession = async () => {
        try {
            await axios.get(`${SERVER.API.AUTHENTICATION}/logout`);
        } catch (error) {
            throw new Error(error as string);
        } finally {
            localStorage.removeItem('user_id');
            localStorage.removeItem('session_expiration_time');
            localStorage.removeItem('keycloak_user_id');
            localStorage.removeItem('remember_me');
            navigate('/login');
        }
    };

    React.useEffect(() => void handleDestroySession(), []);

    return null;
};

export default Container;