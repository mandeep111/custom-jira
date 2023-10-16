import React from 'react';

interface Props {
    icon: JSX.Element;
    message: string;
}

const Component = ({ icon, message }: Props) => {
    
    return (
        <React.Fragment>
            <div className="flex items-center p-4 text-sm text-blue-800 rounded-lg bg-blue-100 border border-blue-300 m-5" role="alert">
                {icon}
                <div>
                    {message}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Component;