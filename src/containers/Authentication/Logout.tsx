import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../../redux/Authentication/actions';

const Container = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    React.useEffect(() => {
        localStorage.removeItem('jwt');
        sessionStorage.removeItem('jwt');

        localStorage.removeItem('user_id');
        sessionStorage.removeItem('user_id');

        localStorage.removeItem('expiration_date');
        sessionStorage.removeItem('expiration_date');

        dispatch(setToken(null));
        navigate('/login');
    }, [navigate, setToken]);

    return null;
};

export default Container;