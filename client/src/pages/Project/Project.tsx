import React from 'react';
import { useSelector } from 'react-redux';
import { Sidebar } from '../../components/Sidebar';
import { Spinner } from '../../components/Spinner';
import { Project } from '../../containers/Project';
import useAuthorize from '../../hooks/useAuthorize';
import { getToggle } from '../../redux/Sidebar/selectors';

const Page = ({ isReady }: PageProps) => {

    useAuthorize();
    const toggle = useSelector(getToggle);

    return (
        <React.Fragment>
            <div className="flex flex-row w-full h-full bg-default-faded">
                <Sidebar />
                <div className={`flex-1 ${toggle ? '' : 'ml-80'} h-screen`}>
                    {isReady ? (<Spinner />) : (<Project />)}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Page;