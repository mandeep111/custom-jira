import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    progress: number;
}

const Component = ({ progress, className }: Props) => {

    return (
        <React.Fragment>
            <div className="flex items-center">
                <div className={`${className!} w-full bg-default-faded rounded-full h-2.5 mr-5`}>
                    <div className={`h-2.5 rounded-full ${progress <= 19
                        ? 'bg-zinc-300'
                        : progress >= 20 && progress <= 39
                            ? 'bg-purple-300'
                            : progress >= 40 && progress <= 59
                                ? 'bg-indigo-300'
                                : progress >= 60 && progress <= 79
                                    ? 'bg-sky-300'
                                    : progress >= 80 && progress <= 99
                                        ? 'bg-teal-300' : progress >= 100
                                            ? 'bg-green-300' : ''}`
                    } style={{ width: `${progress}%` }}>
                    </div>
                </div>
                <p className="text-sm text-default">{`${progress.toFixed(2)}%`}</p>
            </div>
        </React.Fragment >
    );
};

export default Component;