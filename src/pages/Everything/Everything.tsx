import React from 'react';
import useAuthorize from '../../hooks/useAuthorize';
import { Sidebar } from '../../components/Sidebar';
import { Spinner } from '../../components/Spinner';
import { Everything } from '../../containers/Everything';

const Page = ({ isReady }: PageProps) => {

    useAuthorize();

    return (
        <React.Fragment>
            <div className="flex flex-row w-full h-full bg-default-faded">
                <Sidebar />
                <div className="flex-1">
                    {isReady ? (
                        <React.Fragment>
                            <Spinner />
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Everything />
                        </React.Fragment>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Page;