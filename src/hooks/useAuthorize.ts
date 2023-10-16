import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setExpirationDate, setToken, setUserId } from '../redux/Authentication/actions';
import { getExpirationDate, getToken, getUserId } from '../redux/Authentication/selectors';
import Http from '../services/Http';

const useAuthorize = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector(getToken);
    const userId = useSelector(getUserId);
    const expirationDate = useSelector(getExpirationDate);
    const currentTime = new Date().getTime();

    React.useEffect(() => {
        if (!token) {
            dispatch(setToken(localStorage.getItem('jwt')! || sessionStorage.getItem('jwt')!));
        }

        if (!userId) {
            dispatch(setUserId(Number(localStorage.getItem('user_id')!) || Number(sessionStorage.getItem('user_id')!)));
        }

        if (!expirationDate) {
            dispatch(setExpirationDate(Number(localStorage.getItem('expiration_date')!) || Number(sessionStorage.getItem('expiration_date')!)));
        }

        if (expirationDate && currentTime > expirationDate) {
            navigate('/logout');
        }
        Http.authentication(localStorage.getItem('jwt')! || sessionStorage.getItem('jwt')!);
    }, []);

};

export default useAuthorize;