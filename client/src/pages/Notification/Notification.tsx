import React from 'react';
import { useSelector } from 'react-redux';
import { Sidebar } from '../../components/Sidebar';
import { Spinner } from '../../components/Spinner';
import { Notification } from '../../containers/Notification';
import { getToggle } from '../../redux/Sidebar/selectors';

const Page = ({ isReady }: PageProps) => {

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
                            <Notification />
                        </React.Fragment>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Page;