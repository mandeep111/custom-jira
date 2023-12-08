import axios from 'axios';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setExpirationDate, setToken, setUserId } from '../redux/Authentication/actions';

const useAuthorize = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
    const userId = Number(localStorage.getItem('user_id')) || Number(sessionStorage.getItem('user_id'));
    const expirationDate = Number(localStorage.getItem('expiration_date')) || Number(sessionStorage.getItem('expiration_date'));
    const currentTime = new Date().getTime();

    React.useEffect(() => {
        dispatch(setToken(localStorage.getItem('jwt')! || sessionStorage.getItem('jwt')!));
        dispatch(setUserId(Number(localStorage.getItem('user_id')!) || Number(sessionStorage.getItem('user_id')!)));
        dispatch(setExpirationDate(Number(localStorage.getItem('expiration_date')!) || Number(sessionStorage.getItem('expiration_date')!)));

        if (!token) {
            navigate('/logout');
        }

        if (!userId) {
            navigate('/logout');
        }

        if (!expirationDate) {
            navigate('/logout');
        }

        if (expirationDate && currentTime > expirationDate) {
            navigate('/logout');
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token!}`;
    }, [token, userId, expirationDate]);

};

export default useAuthorize;