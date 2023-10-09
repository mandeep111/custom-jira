import React from 'react';
import background1 from '../../assets/bg-image-1.jpg';
import background2 from '../../assets/bg-image-2.jpg';
import background3 from '../../assets/bg-image-3.jpg';
import background4 from '../../assets/bg-image-4.jpg';
import background5 from '../../assets/bg-image-5.jpg';
import { Login } from '../../containers/Authentication';

const Page = () => {

    const backgrounds = [
        background1,
        background2,
        background3,
        background4,
        background5
    ];

    const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];

    return (
        <React.Fragment>
            <section className="bg-white" style={{ backgroundImage: `url(${randomBackground})`, backgroundSize: '100% 100%' }}>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen">
                    <div className="w-full bg-white rounded-lg shadow mt-0 max-w-md p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-black text-2x">
                                {'Sign in to your account'}
                            </h1>
                            <Login />
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};

export default Page;