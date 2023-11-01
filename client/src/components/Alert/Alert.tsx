import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    icon: JSX.Element;
    message: string;
}

const Component = ({ icon, message, className }: Props) => {

    return (
        <React.Fragment>
            <div className={`${className ? className : 'text-blue-800 bg-blue-100 border border-blue-300 my-3'} flex items-center p-4 text-sm mx-3 rounded-lg`} role="alert">
                {icon}
                <div>
                    {message}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Component;