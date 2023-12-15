import axios from 'axios';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setExpirationDate, setUserId } from '../../redux/Authentication/actions';

interface Response {
    id: number | null;
    email: string;
    token: string;
    type: 'Bearer';
    lastLogin: string;
    sessionExpirationTime: number | null;
}

interface OAuth {
    email: string,
    password: string,
    grantType: string
}

const Container = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();
    const [remember, setRemember] = React.useState(false);
    const [authentication, setAuthentication] = React.useState<OAuth>({
        email: '',
        password: '',
        grantType: 'password'
    });
    const [email, setEmail] = React.useState<string>();

    const handleRemember = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRemember(event.target.checked);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post<Response>(`${SERVER.API.AUTHENTICATION}/login`, authentication, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            setEmail(response.data.email);
            dispatch(setUserId(response.data.id));
            dispatch(setExpirationDate(response.data.sessionExpirationTime));
            localStorage.setItem('user_id', response.data.id!.toString());
            if (remember) {
                localStorage.setItem('remember_me', 'true');
            } else {
                localStorage.setItem('remember_me', 'false');
                localStorage.setItem('session_expiration_time', (response.data.sessionExpirationTime! * 1000).toString());
            }
            toast.success('Welcome', {
                position: 'top-center',
                onOpen: () => {
                    navigate('/');
                },
            });
        } catch (error) {
            throw new Error(error as string);
        }
    };

    React.useEffect(() => {
        if (localStorage.getItem('keycloak_user_id')) {
            navigate(-1);
        }
    }, [navigate]);

    React.useEffect(() => {
        if (email) {
            const getUserId = async () => {
                const response = await axios.get<Response[]>(`${SERVER.API.KEYCLOAK}/users?user=${email}`);
                localStorage.setItem('keycloak_user_id', response.data[0].id!.toString());
            };
            void getUserId();
        }
    }, [email]);

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
                        onChange={(event) => setAuthentication({ ...authentication, email: event.target.value })}
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
                        onChange={(event) => setAuthentication({ ...authentication, password: event.target.value })}
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