import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Chart } from 'react-google-charts';
import { useDispatch, useSelector } from 'react-redux';
import { getToken } from '../../redux/Authentication/selectors';
import { API } from '../../utils/api';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Grid } from '../../components/Grid';
import { Disclosure, Listbox, Transition } from '@headlessui/react';
import { ArrowRightCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import SpaceService from '../../services/Space';
import Http from '../../services/Http';
import { Alert } from '../../components/Alert';
import { setOpenFormSubTaskDetail } from '../../redux/Dialog/actions';
import { FormSubTaskDetail } from '../../components/Form';
import { Space } from '../../types/Space';
import { SubTask } from '../../types/SubTask';

interface AdditionalProp {
    [key: string]: {
        COMPLETED: number;
        WAITING: number;
    };
}

interface UserBySpace {
    id: number;
    fullName: string;
    email: string;
    waiting: number | 0;
    completed: number | 0;
}

const Container = () => {

    const token = useSelector(getToken);
    const [mySpaceList, setMySpaceList] = React.useState<Space[]>([]);
    const dispatch = useDispatch();
    const currentDate = new Date(); // สร้างวันที่ปัจจุบัน
    currentDate.setDate(currentDate.getDate() + 7); // ลบ 7 วันออกจากวันที่ปัจจุบัน
    const [startDate, setStartDate] = React.useState<Date>(new Date());
    const [endDate, setEndDate] = React.useState<Date>(currentDate);
    const formattedStartDate = startDate.toISOString().substr(0, 10);
    const formattedEndDate = endDate.toISOString().substr(0, 10);
    const [selected, setSelected] = React.useState<Space>();
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
    const [SpaceSubTasks, setSpaceSubTasks] = React.useState<UserBySpace[]>([]);
    const [subTaskList, setSubTaskList] = React.useState<SubTask[]>([]);
    const userArray: UserBySpace[] = [];
    const [subTaskId, setSubTaskId] = React.useState<number | null>(null);
    const all = {
        id: null,
        name: '',
    };
    const spaceId: number | null = selected?.id || null;


    const fetchMySpaceList = async () => await SpaceService.Fetch(setMySpaceList);
    function inputChangeStartDate(event: React.ChangeEvent<HTMLInputElement>) {
        const dateValue = new Date(event.target.value);
        setStartDate(dateValue);
    }
    function inputChangeEndDate(event: React.ChangeEvent<HTMLInputElement>) {
        const dateValue = new Date(event.target.value);
        setEndDate(dateValue);
    }
    const fetchBySpaceSubTask = async () => {
        try {
            const response: AdditionalProp = await Http.get(`${API.USER_PROFILE}/space-sub-task/${spaceId!}?&startDate=${startDate.toISOString().substr(0, 10)}&endDate=${endDate.toISOString().substr(0, 10)}`);
            userArray.length = 0;
            for (const key in response) {
                const userData = response[key];
                const idMatch = key.match(/id=([^,]+)/);
                const id = idMatch ? idMatch[1] : 'Unknown';
                const fullNameMatch = key.match(/fullName=([^,]+)/);
                const fullName = fullNameMatch ? fullNameMatch[1] : 'Unknown';
                const emailMatch = key.match(/email=([^,]+)/);
                const email = emailMatch ? emailMatch[1] : 'Unknown';
                const waitingCount = userData.WAITING || 0;
                const completedCount = userData.COMPLETED || 0;
                const user: UserBySpace = {
                    id: Number(id),
                    fullName,
                    email,
                    waiting: waitingCount,
                    completed: completedCount,
                };

                userArray.push(user);
            }
            setSpaceSubTasks(userArray);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const fetchBySpaceAllSubTask = async () => {
        try {

            const response: AdditionalProp = await Http.get(`${API.USER_PROFILE}/sub-count?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
            userArray.length = 0;
            for (const key in response) {
                const userData = response[key];
                const idMatch = key.match(/id=([^,]+)/);
                const id = idMatch ? idMatch[1] : 'Unknown';
                const fullNameMatch = key.match(/fullName=([^,]+)/);
                const fullName = fullNameMatch ? fullNameMatch[1] : 'Unknown';
                const emailMatch = key.match(/email=([^,]+)/);
                const email = emailMatch ? emailMatch[1] : 'Unknown';
                const waitingCount = userData.WAITING || 0;
                const completedCount = userData.COMPLETED || 0;
                const user: UserBySpace = {
                    id: Number(id),
                    fullName,
                    email,
                    waiting: waitingCount,
                    completed: completedCount,
                };
                userArray.push(user);
            }
            setSpaceSubTasks(userArray);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const fetchSubTask = async () => {
        try {
            const response: SubTask[] = await Http.get(`${API.SUBTASK}/get-by-space?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
            setSubTaskList(response);
        } catch (error) {
            throw new Error(error as string);
        }
    };
    const fetchSubTaskBySpace = async () => {
        try {
            const response: SubTask[] = await Http.get(`${API.SUBTASK}/get-by-space?&startDate=${formattedStartDate}&endDate=${formattedEndDate}&spaceId=${spaceId!}`);
            setSubTaskList(response);
        } catch (error) {
            throw new Error(error as string);
        }
    };


    // const [subTaskByUserId, setSubTaskByUserId] = React.useState<SubTask[]>([]);


    // const combinedData = SpaceSubTasks.map((user) => {
    //     let progress: number = 0;
    //     const subTasks: SubTask[] = subTaskByUserId.filter((subTask) => subTask.assignee.id === user.id);
    //     return {
    //         ...user,
    //         progress,
    //         subTasks,
    //     };

    // });

    const handleCalculateDiscount = SpaceSubTasks.map((data) => {
        const filteredData = data.waiting + data.completed;
        const filteredDataCompleted = data.completed;
        const progress = (filteredDataCompleted * 100) / filteredData || 0;
        return {
            ...data,
            progress: progress,
        };
    });
    console.log('startDate = ' , startDate);
    console.log('endDate = ' , endDate);
    console.log('startDate = ' , startDate.toISOString().substr(0, 10));
    console.log('endDate = ' , endDate.toISOString().substr(0, 10));

    const handleConfirmClick = () => {

        if (spaceId === null) {
            void fetchBySpaceAllSubTask();
            void fetchSubTask();
        } else {
            void fetchBySpaceSubTask();
            void fetchSubTaskBySpace();
        }


    };


    React.useEffect(() => {
        // void getProjectByPage();
        void fetchMySpaceList();
        void fetchBySpaceAllSubTask();
        void fetchSubTask();
    }, [token]);

    return (
        <React.Fragment>
            <div className="bg-default p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 grid text-sm leading-6">
                <div className="grid sm:grid lg:grid xl:block grid-cols-1 grid-rows-1 mt-8 mb-5 border-default border-2">

                    <div className="text-2xl p-2 ml-5 text-default">{'All User'}</div>
                    <Grid column={12} gap={1} className="mt-5 text-center mb-5">
                        <Grid.Column sm={1} md={3} lg={1} xl={1} xxl={1}>
                            <label htmlFor="start" className="label mt-2.5">{'Start'}</label>
                        </Grid.Column>
                        <Grid.Column sm={2} md={3} lg={2} xl={2} xxl={2}>
                            <input
                                id="start"
                                type="date"
                                value={startDate && new Date(startDate).toISOString().substr(0, 10)}
                                className="flex w-full bg-transparent outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                onChange={(event) => inputChangeStartDate(event)}
                            />
                        </Grid.Column>
                        <Grid.Column sm={1} md={3} lg={1} xl={1} xxl={1}>
                            <label htmlFor="start" className="label mt-2.5">{'End'}</label>
                        </Grid.Column>
                        <Grid.Column sm={2} md={3} lg={2} xl={2} xxl={2}>
                            <input
                                id="end"
                                type="date"
                                value={endDate && new Date(endDate).toISOString().substr(0, 10)}
                                className="flex w-full bg-transparent outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                onChange={(event) => inputChangeEndDate(event)}
                            />
                        </Grid.Column>
                        <Grid.Column sm={1} md={3} lg={1} xl={1} xxl={1}>
                            <label htmlFor="start" className="label mt-2.5">{'Space '}</label>
                        </Grid.Column>
                        <Grid.Column sm={3} md={3} lg={3} xl={3} xxl={3}>
                            <div className=" w-60">
                                <Listbox value={selected} onChange={setSelected}>
                                    <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                            <span className="block truncate">{selected?.name}</span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon
                                                    className="h-5 w-5 text-gray-400"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </Listbox.Button>
                                        <Transition
                                            as={React.Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                <Listbox.Option
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                                        }`
                                                    }
                                                    value={all}
                                                >
                                                    <span
                                                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                                                    >
                                                        {'All'}
                                                    </span>
                                                </Listbox.Option>
                                                {mySpaceList.map((SpaceList, personIdx) => (
                                                    <Listbox.Option
                                                        key={personIdx}
                                                        className={({ active }) =>
                                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                                            }`
                                                        }
                                                        value={SpaceList}
                                                    >

                                                        <span
                                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                                                        >

                                                            {SpaceList.name}
                                                        </span>
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>
                        </Grid.Column>
                        <Grid.Column sm={1} md={2} lg={1} xl={1} xxl={1}>
                            <button type="button"
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg mx-2"
                                onClick={handleConfirmClick}
                            >
                                {'Search'}
                            </button>
                        </Grid.Column>
                    </Grid>

                    <div className="mx-3 mb-2 px-6 py-3  bg-default border border-default rounded-lg  justify-center ">
                        {SpaceSubTasks.length !== 0 ? (
                            <div style={{ maxWidth: '100em', overflowX: 'auto' }}>
                                <div className="flex h-96">
                                    {SpaceSubTasks.map((datas, index: number) => (
                                        <React.Fragment key={index}>
                                            {handleCalculateDiscount.filter((user) => user.id === datas.id)
                                                .map((data, index) => (
                                                    <div className=" items-center  m-2" key={index}>
                                                        <p className="text-sm text-default ml-2 ">{`${data.progress.toFixed(2)}%`}</p>
                                                        <p className="text-xs text-center text-red-500">{datas.waiting || 0}</p>
                                                        <div className="w-5 bg-default-faded rounded-full h-60 ml-4  flex items-end ">
                                                            <div
                                                                className={`w-5 rounded-full ${data.progress <= 19
                                                                    ? 'bg-zinc-300'
                                                                    : data.progress >= 20 && data.progress <= 39
                                                                        ? 'bg-purple-300'
                                                                        : data.progress >= 40 && data.progress <= 59
                                                                            ? 'bg-indigo-300'
                                                                            : data.progress >= 60 && data.progress <= 79
                                                                                ? 'bg-sky-300'
                                                                                : data.progress >= 80 && data.progress <= 99
                                                                                    ? 'bg-teal-300' : data.progress >= 100
                                                                                        ? 'bg-green-300' : ''}`
                                                                } style={{ height: `${data.progress}%` }}>

                                                            </div>

                                                        </div>
                                                        <p className="text-xs text-center text-green-500">{datas.completed || 0}</p>
                                                        <div className="items-center mb-2 ml-2.5">
                                                            <div className="w-7 h-7 text-xs rounded-full bg-zinc-400 border border-zinc-300 align-middle items-center flex text-center justify-center text-zinc-100 font-bold"
                                                                title={datas.fullName}
                                                                style={{ cursor: 'pointer' }}
                                                                onMouseOver={() => setHoveredIndex(index)}
                                                                onMouseOut={() => setHoveredIndex(null)}
                                                            >
                                                                {datas.fullName.toUpperCase().charAt(0)}
                                                            </div>

                                                            {hoveredIndex === index && datas.fullName && (
                                                                <p className="align-middle items-center border-2 p-1 mt-2">{datas.fullName}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-3 text-default">
                                <Alert icon={<InformationCircleIcon className="icon-x20 mr-2" />} message={'There are no SubTasks.'} />
                            </div>
                        )}
                    </div>
                    <div className="mx-3 mb-2 px-4 py-3  bg-default border border-default rounded-lg  justify-center ">
                        <Grid column={12} gap={1}>
                            {SpaceSubTasks.map((datas, index: number) => (
                                <React.Fragment key={index}>
                                    <Grid.Column sm={12} md={6} lg={6} xl={4} xxl={4} className="p-1 m-1 bg-default " >
                                        <div className="mx-3 mb-2 px-6 py-3 bg-default border border-default rounded-lg h-auto w-full ">
                                            <div className="flex items-center mb-2">
                                                <span
                                                    className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-zinc-400 border border-zinc-300 align-middle items-center flex text-center justify-center text-zinc-100 font-bold"
                                                    title={datas.fullName}
                                                >
                                                    {datas.fullName?.toUpperCase().charAt(0)}
                                                </span>
                                                <h5 className="text-sm text-default ml-3">{datas.fullName.toUpperCase()}</h5>
                                            </div>
                                            <Grid column={12} gap={1}>
                                                <Grid.Column sm={12} md={12} lg={12} xl={4} xxl={4} className="p-1 m-1 bg-default " >
                                                    <div className="text-center">
                                                        <p className="text-xl text-default ">{datas.waiting + datas.completed}</p>
                                                        <p className="text-sm text-default ">{'All'}</p>
                                                    </div>
                                                </Grid.Column>
                                                <Grid.Column sm={12} md={6} lg={6} xl={4} xxl={4} className="p-1 m-1 bg-default " >
                                                    <div className="text-center">
                                                        <p className="text-xl  text-red-500">
                                                            {datas.waiting || 0}
                                                        </p>
                                                        <p className="text-sm  text-red-500">{'Not Done'}</p>
                                                    </div>
                                                </Grid.Column>
                                                <Grid.Column sm={12} md={6} lg={6} xl={4} xxl={4} className="p-1 m-1 bg-default " >
                                                    <div className="text-center">
                                                        <p className="text-xl  text-green-500">
                                                            {datas.completed || 0}
                                                        </p>
                                                        <p className="text-sm  text-green-500">{'Done'}</p>
                                                    </div>

                                                </Grid.Column>
                                            </Grid>
                                            {handleCalculateDiscount.filter((user) => user.id === datas.id)
                                                .map((data, index) => (
                                                    <div className="flex items-center" key={index}>
                                                        <div className="w-full bg-default-faded rounded-full h-2.5">
                                                            <div
                                                                className={`h-2.5 rounded-full  ${data.progress <= 19
                                                                    ? 'bg-zinc-300'
                                                                    : data.progress >= 20 && data.progress <= 39
                                                                        ? 'bg-purple-300'
                                                                        : data.progress >= 40 && data.progress <= 59
                                                                            ? 'bg-indigo-300'
                                                                            : data.progress >= 60 && data.progress <= 79
                                                                                ? 'bg-sky-300'
                                                                                : data.progress >= 80 && data.progress <= 99
                                                                                    ? 'bg-teal-300' : data.progress >= 100
                                                                                        ? 'bg-green-300' : ''}`
                                                                } style={{ width: `${data.progress}%` }}>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-default">{`${data.progress.toFixed(2)}%`}</p>
                                                    </div>
                                                ))}
                                            <div className="mt-3">
                                                <Disclosure>
                                                    {({ open }) => (
                                                        <React.Fragment>
                                                            <Disclosure.Button>
                                                                <ArrowRightCircleIcon className={`${open ? 'rotate-90 transform' : ''}     inline-flex icon-x24 text-default mt-2 mb-2 `}
                                                                />

                                                            </Disclosure.Button>
                                                            <span className="w-7 h-7 px-2  py-0.75  text-xs rounded text-white mr-2 bg-yellow-400" />
                                                            <span className="group-hover:text-blue-200 text-default font-semibold text-md">{'WAITING'}</span>
                                                            <span className="m-3 text-md  text-default">
                                                                {'('}{datas.waiting || 0}{')'}
                                                            </span>

                                                            <Disclosure.Panel>
                                                                {
                                                                    <DndProvider backend={HTML5Backend}>
                                                                        <React.Fragment>
                                                                            <div className="p-1 mt-3 bg-default border border-default rounded-xs  ">
                                                                                <div style={{ maxHeight: '10em', overflowY: 'auto' }}>
                                                                                    <table className=" border w-96 table" >
                                                                                        <thead>
                                                                                            <tr className=" text-default bg-default border-default">
                                                                                                <th className="border-2 p-2 m-2">{'No'}</th>
                                                                                                <th className="border-2 p-2 m-2">{'SubTask '}</th>
                                                                                                <th className="border-2 p-2 m-2">{'Task'}</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {subTaskList
                                                                                                .filter((subTasks) => subTasks.status === 'WAITING' && subTasks.assignee!.id === datas.id)
                                                                                                .map((subTasks, index) => (
                                                                                                    <React.Fragment key={index}>
                                                                                                        <tr className="items-center border-2" >
                                                                                                            <td className="border-2 text-md text-default text-center p-1 m-1">{index + 1}</td>
                                                                                                            <td className="border-2 text-md text-default text-center p-1 m-1 cursor-pointer"
                                                                                                                onClick={() => {
                                                                                                                    dispatch(setOpenFormSubTaskDetail(true));
                                                                                                                    setSubTaskId(subTasks.id!);
                                                                                                                }}
                                                                                                            >{subTasks.name}</td>
                                                                                                            <td className="border-2 text-md text-default text-center p-1 m-1">{subTasks.taskName}</td>
                                                                                                        </tr>
                                                                                                    </React.Fragment>
                                                                                                ))}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </React.Fragment>
                                                                    </DndProvider>
                                                                }
                                                            </Disclosure.Panel>
                                                        </React.Fragment>

                                                    )}
                                                </Disclosure>
                                            </div>
                                            <div className="mt-3">
                                                <Disclosure>
                                                    {({ open }) => (
                                                        <React.Fragment>
                                                            <Disclosure.Button>
                                                                <ArrowRightCircleIcon className={`${open ? 'rotate-90 transform' : ''}     inline-flex icon-x24 text-default  mt-2 mb-2 `} />
                                                            </Disclosure.Button>
                                                            <span className="w-7 h-7 px-2  py-0.75  text-xs rounded text-white mr-2 bg-green-500" />

                                                            <span className="group-hover:text-blue-200 text-default font-semibold text-md ">{'COMPLETED'}

                                                            </span>
                                                            <span className="m-3 text-md  text-default">
                                                                {'('}{datas.completed || 0}{')'}
                                                            </span>
                                                            <Disclosure.Panel>
                                                                {
                                                                    <DndProvider backend={HTML5Backend}>
                                                                        <React.Fragment>
                                                                            <div className="p-1 mt-3 bg-default border border-default rounded-xs  ">
                                                                                <div style={{ maxHeight: '10em', overflowY: 'auto' }}>
                                                                                    <table className=" border w-96 table" >
                                                                                        <thead>
                                                                                            <tr className=" text-default bg-default border-default">
                                                                                                <th className="border-2 p-2 m-2">{'No'}</th>
                                                                                                <th className="border-2 p-2 m-2">{'SubTask '}</th>
                                                                                                <th className="border-2 p-2 m-2">{'Task'}</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {subTaskList
                                                                                                .filter((subTasks) => subTasks.status === 'COMPLETED' && subTasks.assignee!.id === datas.id)
                                                                                                .map((subTasks, index) => (
                                                                                                    <React.Fragment key={index}>
                                                                                                        <tr className="items-center border-2">
                                                                                                            <td className=" border-2 text-md text-default text-center p-1 m-1">{index + 1}</td>
                                                                                                            <td className=" border-2 text-md text-default text-center  p-1 m-1">{subTasks.name}</td>
                                                                                                            <td className=" border-2 text-md text-default text-center  p-1 m-1">{subTasks.taskName}</td>
                                                                                                        </tr>
                                                                                                    </React.Fragment>
                                                                                                ))}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </React.Fragment>
                                                                    </DndProvider>
                                                                }
                                                            </Disclosure.Panel>
                                                        </React.Fragment>
                                                    )}
                                                </Disclosure>
                                            </div>
                                        </div>
                                    </Grid.Column >
                                </React.Fragment>
                            ))}
                        </Grid >
                    </div>
                </div>
            </div >
            <FormSubTaskDetail subTaskId={subTaskId} fetchingData={spaceId === null ? fetchSubTask : fetchSubTaskBySpace} />
        </React.Fragment >
    );
};

export default Container;