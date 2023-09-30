import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getExpirationDate, getToken } from '../redux/Authentication/selectors';
import { setExpirationDate, setToken } from '../redux/Authentication/actions';

interface Authorization {
    email: string;
    token: string;
    type: 'Bearer';
    lastLogin: number;
    expirationDate: number;
}

const useAuthorize = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector(getToken);
    const expirationDate = useSelector(getExpirationDate);
    const authLocalStorage = localStorage.getItem('authentication');
    const authSessionStorage = sessionStorage.getItem('authentication');
    const authorize: Authorization = (
        authLocalStorage
            ? JSON.parse(authLocalStorage)
            : null
    ) as Authorization || (
        authSessionStorage
            ? JSON.parse(authSessionStorage)
            : null
    ) as Authorization;
    const currentTime = new Date().getTime();

    React.useEffect(() => {
        if (!authorize || authorize === undefined || authorize === null) {
            navigate('/logout');
        } else {
            dispatch(setToken(authorize.token));
        }

        if (expirationDate) {
            if (currentTime < expirationDate) {
                dispatch(setExpirationDate(expirationDate));
            } else {
                navigate('/logout');
            }
        }

    }, [navigate, expirationDate, token, authorize]);

};

export default useAuthorize;