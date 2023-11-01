import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useInputChange, { InputChangeHandler } from '../../hooks/useInputChange';
import { setExpirationDate, setToken, setUserId } from '../../redux/Authentication/actions';
import Http from '../../services/Http';
import { API } from '../../utils/api';

interface Response {
    id: number | null;
    email: string;
    token: string;
    type: 'Bearer';
    lastLogin: string;
    expirationDate: number | null;
}

interface Auth {
    email: string,
    password: string
}

const Container = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();
    const inputChange: InputChangeHandler = useInputChange();
    const [remember, setRemember] = React.useState(false);
    const [user, setUser] = React.useState<Auth>({
        email: '',
        password: ''
    });

    const handleRemember = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRemember(event.target.checked);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await Http.login<Auth, Response>(API.AUTHENTICATION, user, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            Http.authentication(localStorage.getItem('jwt')! || sessionStorage.getItem('jwt')!);
            dispatch(setToken(response.token));
            dispatch(setUserId(response.id));
            dispatch(setExpirationDate(response.expirationDate));
            if (remember) {
                localStorage.setItem('jwt', response.token);
                localStorage.setItem('user_id', response.id!.toString());
                localStorage.setItem('expiration_date', response.expirationDate!.toString());
            } else {
                sessionStorage.setItem('jwt', response.token);
                sessionStorage.setItem('user_id', response.id!.toString());
                sessionStorage.setItem('expiration_date', response.expirationDate!.toString());
            }
            toast.success('Welcome', {
                position: 'top-center',
                onOpen: () => {
                    navigate('/');
                }
            });
        } catch (error) {
            throw new Error(error as string);
        }
    };

    React.useEffect(() => {
        if (localStorage.getItem('jwt') || sessionStorage.getItem('jwt')) {
            navigate(-1);
        }
    }, [navigate]);

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