
import React from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ReportsProject, ReportsTask, WorkLoadProject, WorkLoadTask } from '.';
import { Link, useParams } from 'react-router-dom';
import { Listbox, Menu, Tab, Transition, Popover } from '@headlessui/react';
import { select } from 'react-i18next/icu.macro';
import * as HeroIcons from '@heroicons/react/24/outline';
import { setToggle } from '../../redux/Sidebar/actions';
import { getToggle } from '../../redux/Sidebar/selectors';
import { useDispatch, useSelector } from 'react-redux';

const Container = () => {
    const { projectId, projectUrl } = useParams();
    const dispatch = useDispatch();
    const toggle = useSelector(getToggle);
    const handleSidebarToggle = () => {
        dispatch(setToggle(!toggle));
    };

    return (
        <React.Fragment>
            <div className="bg-default">
                <Tab.Group>
                    <Tab.List
                        className="flex flex-row flex-nowrap border-b dark:border-default bg-default">
                        <div className="flex flex-row flex-nowrap border-b dark:border-default bg-default">
                            <button
                                type="button"
                                className={`text-default px-3 ${toggle ? '' : 'hidden'}`}
                                onClick={handleSidebarToggle}
                            >
                                <HeroIcons.ChevronDoubleRightIcon className="icon-x20 mr-0" />
                            </button>
                            <Tab className={({ selected }) => `flex items-center focus:outline-none flex-nowrap px-3 border-b-2 border-b-transparent pb-3.5 pt-4 text-xs text-default uppercase hover:border-b-inherit ${selected ? '!text-pink-400 border-b-pink-500' : ''}`}>
                                <div className="inline-flex flex-nowrap px-3 border-b-2 border-b-transparent pb-3 pt-4 text-xs text-default uppercase cursor-default select-none">
                                    <span className="text-default flex items-center font-bold">
                                        {'Report'}
                                    </span>
                                </div>
                            </Tab>
                            {projectId && projectUrl ? (
                                null
                            ) : (
                                <Tab className={({ selected }) => `flex items-center focus:outline-none flex-nowrap px-3 border-b-2 border-b-transparent pb-3.5 pt-4 text-xs text-default uppercase hover:border-b-inherit ${selected ? '!text-pink-400 border-b-pink-500' : ''}`}>
                                    <div className="inline-flex flex-nowrap px-3 border-b-2 border-b-transparent pb-3 pt-4 text-xs text-default uppercase cursor-default select-none">
                                        <span className="text-default flex items-center font-bold">
                                            {'Workload'}
                                        </span>
                                    </div>
                                </Tab>
                            )
                            }
                        </div>
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel>

                            <div className="bg-default p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 text-sm ">
                                <span className="group-hover:text-white font-semibold text-default text-3xl">
                                    {'Report'}
                                </span>
                                {projectId && projectUrl ? (
                                    <ReportsTask />
                                ) : (<ReportsProject />)
                                }
                            </div>
                        </Tab.Panel>
                        <Tab.Panel>

                            <div className="bg-default p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 text-sm ">
                                <span className="group-hover:text-white font-semibold text-default text-3xl">
                                    {'Workload'}
                                </span>
                                {projectId && projectUrl ? (
                                    <WorkLoadTask />
                                ) : (<WorkLoadProject />)
                                }
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group >
            </div >
        </React.Fragment >
    );

};

export default Container;