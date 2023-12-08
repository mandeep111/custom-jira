
import * as HeroIcons from '@heroicons/react/24/outline';
import axios, { AxiosResponse } from 'axios';
import React from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Grid } from '../../components/Grid';
import { setToggle } from '../../redux/Sidebar/actions';
import { getToggle } from '../../redux/Sidebar/selectors';

interface ContentNotification {
    pageNo: number | 0,
    pageSize: number | 0,
    totalElements: number | 0,
    totalPages: number | 0,
    last: true,
    content: Notify[],
}

const Container = () => {
    const { projectId, projectUrl } = useParams();
    const dispatch = useDispatch();
    const toggle = useSelector(getToggle);
    const handleSidebarToggle = () => {
        dispatch(setToggle(!toggle));
    };
    const [notifications, setNotifications] = React.useState<Notify[]>([]);

    const fetchMyNotification = async () => {
        try {
            const response: AxiosResponse<ContentNotification> = await axios.get(`${SERVER.API.USERPROFILE}/notification`);
            const { content }: ContentNotification = response.data;
            setNotifications(content);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    React.useEffect(() => {

        void fetchMyNotification();
    }, []);

    return (
        <React.Fragment>
            <div className="bg-default">
                <div className="flex flex-row border-b flex-nowrap dark:border-default bg-default">
                    <div className="flex items-center focus:outline-none flex-nowrap px-3 border-b-2 border-b-transparent pb-3.5 pt-4 text-xs text-default uppercase hover:border-b-inherit">
                        <button
                            type="button"
                            className={`text-default px-3 ${toggle ? '' : 'hidden'}`}
                            onClick={handleSidebarToggle}
                        >
                            <HeroIcons.ChevronDoubleRightIcon className="mr-0 icon-x20" />
                        </button>
                        <div className="inline-flex px-3 pt-4 pb-3 text-xs uppercase border-b-2 cursor-default select-none flex-nowrap border-b-transparent text-default">
                            <span className="flex items-center font-bold text-default">
                                {'Notifications'}
                            </span>
                        </div>
                    </div>
                </div>
                <Grid column={12} gap={5} className="py-5">
                    <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12} className="mx-auto">
                        <div className="p-2 m-2 border-2 border-default ">
                            {notifications.map((notification, index) => (
                                <React.Fragment key={index}>
                                    <div className="px-6 py-3 m-5 border-2 rounded-lg bg-default border-default " >
                                        <div className="grid grid-flow-col grid-rows-1 gap-12 border-b dark:border-default bg-default ">
                                            <div className="flex items-center grid-cols-1 mb-5 justify-items-start">
                                                <span className="w-4 h-4 px-2  py-0.75  text-xs rounded text-white mr-2 bg-red-600" />
                                                <h5 className="ml-3 text-sm text-default">{'Subject : '}{notification.subject}</h5>
                                            </div>
                                        </div>
                                        <div className="items-center grid-cols-1 mb-5 justify-items-start">
                                            <h5 className="mt-3 ml-3 text-sm text-default">{'Body : '}{notification.body}</h5>
                                            <Link to={notification.url} className="mt-3 ml-3 text-sm text-default">{notification.url}</Link>
                                        </div>
                                        <div className="items-center grid-cols-1 mb-5 text-right justify-items-end">
                                            <p className="inline-flex items-center py-2 text-sm text-default">
                                                <HeroIcons.CalendarDaysIcon className="icon-x16" />
                                                {notification?.creationDate && (
                                                    new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(notification.creationDate))
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </Grid.Column>
                </Grid>
            </div >
        </React.Fragment >
    );

};

export default Container;