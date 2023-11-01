import React from 'react';
import useAuthorize from '../../hooks/useAuthorize';
import { Sidebar } from '../../components/Sidebar';
import { Spinner } from '../../components/Spinner';
import { Homes } from '../../containers/Homes';
import { useSelector } from 'react-redux';
import { getToggle } from '../../redux/Sidebar/selectors';

const Page = ({ isReady }: PageProps) => {

    useAuthorize();
    const toggle = useSelector(getToggle);

    return (
        <React.Fragment>
            <div className="flex flex-row w-full h-full bg-default-faded">
                <Sidebar />
                <div className={`flex-1 ${toggle ? '' : 'ml-80'}`}>
                    {isReady ? (
                        <React.Fragment>
                            <Spinner />
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Homes />
                        </React.Fragment>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Page;