import React from 'react';
import axios from 'axios';
import useInputChange, { InputChangeHandler } from '../../hooks/useInputChange';
import { API } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { ToastContent, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setExpirationDate, setToken } from '../../redux/Authentication/actions';

interface Auth {
    email: string;
    token: string;
    type: 'Bearer';
    lastLogin: string;
    expirationDate: number;
}

interface Response {
    data: Auth
}

interface Error {
    response: {
        data: {
            detail: string;
        }
    }
}

const Container = () => {

    const dispatch = useDispatch();

    const localStorageData = localStorage.getItem('authentication');
    const sessionStorageData = sessionStorage.getItem('authentication');
    const storedAuthData: Auth = (
        localStorageData
            ? JSON.parse(localStorageData)
            : null
    ) as Auth || (
        sessionStorageData
            ? JSON.parse(sessionStorageData)
            : null
    ) as Auth;

    const [auth, setAuth] = React.useState<Auth>(storedAuthData);

    const navigate = useNavigate();
    const inputChange: InputChangeHandler = useInputChange();

    const [remember, setRemember] = React.useState(false);
    const [user, setUser] = React.useState({
        email: '',
        password: ''
    });

    const handleRemember = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRemember(event.target.checked);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response: Response = await axios.post(API.AUTHENTICATION, user);
            setAuth(response.data);
            dispatch(setToken(response.data.token));
            dispatch(setExpirationDate(response.data.expirationDate));
            if (remember) {
                localStorage.setItem('authentication', JSON.stringify(response.data));
            } else {
                sessionStorage.setItem('authentication', JSON.stringify(response.data));
            }
            toast.success('Welcome', {
                position: 'top-center',
                onOpen: () => {
                    navigate('/');
                }
            });
        } catch (error) {
            toast.error((error as Error).response.data.detail as ToastContent<Error>, {
                position: 'top-center'
            });
        }
    };

    React.useEffect(() => {
        if (auth) {
            navigate(-1);
        }
    }, []);

    return (
        <React.Fragment>
            <form className="space-y-6" onSubmit={(event) => void handleSubmit(event)}>
                <div>
                    <label htmlFor="email" className="label text-gray-800">{'Your email'}</label>
                    <input
                        id="email"
                        type="email"
                        className="text-gray-800 bg-white border outline-none rounded-lg block w-full p-2"
                        placeholder="name@company.com"
                        onChange={(event) => inputChange(event, setUser)}
                        required={true}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="label text-gray-800">{'Password'}</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="text-gray-800 bg-white border outline-none rounded-lg block w-full p-2"
                        onChange={(event) => inputChange(event, setUser)}
                        required={true}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="remember"
                                type="checkbox"
                                className="w-4 h-4 border border-default rounded bg-default"
                                onChange={handleRemember}
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="remember" className="text-gray-800 select-none">{'Remember me'}</label>
                        </div>
                    </div>
                    <a href="#" className="text-sm font-medium text-gray-800 hover:underline">{'Forgot password?'}</a>
                </div>
                <button type="submit" className="text-white button w-full bg-gradient-to-r from-cyan-500 to-blue-500 border-0">{'Sign in'}</button>
                <p className="text-sm font-light text-gray-800 select-none">
                    {'Don\'t have an account yet? '}<a href="#" className="font-medium hover:underline text-blue-500">{'Sign up'}</a>
                </p>
            </form>
        </React.Fragment>
    );

};

export default Container;