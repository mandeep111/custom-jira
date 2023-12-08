import { Disclosure, Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { ArrowRightCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import axios, { AxiosResponse } from 'axios';
import React from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';
import { Alert } from '../../components/Alert';
import { FormSubTaskDetail } from '../../components/Form';
import { Grid } from '../../components/Grid';
import { getToken } from '../../redux/Authentication/selectors';
import { setOpenFormSubTaskDetail } from '../../redux/Dialog/actions';
import { setSubtaskId } from '../../redux/Subtask/actions';

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
const initialDateState: DateValueType = {
    startDate: new Date(),
    endDate: new Date()
};
const Container = () => {

    const token = useSelector(getToken);
    const [mySpaceList, setMySpaceList] = React.useState<Space[]>([]);
    const dispatch = useDispatch();
    const [date, setDate] = React.useState<DateValueType>(initialDateState);

    const formattedStartDate = date?.startDate as string;
    const formattedEndDate = date?.endDate as string;
    const [selected, setSelected] = React.useState<Space>();

    const [spaceSubTasks, setSpaceSubTasks] = React.useState<UserBySpace[]>([]);
    const [subTaskList, setSubTaskList] = React.useState<Subtask[]>([]);
    const userArray: UserBySpace[] = [];
    const [subTaskId, setSubTaskId] = React.useState<number | null>(null);
    const all = {
        id: null,
        name: '',
    };
    const spaceId: number | null = selected?.id || null;

    const fetchMySpaceList = async () => {
        try {
            const response: AxiosResponse<Space[]> = await axios.get(`${SERVER.API.SPACE}/all`);
            setMySpaceList(response.data);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const fetchBySpaceSubTask = async () => {
        try {
            const response: AxiosResponse<AdditionalProp> = await axios.get(`${SERVER.API.USERPROFILE}/space-sub-task/${spaceId!}?&startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
            userArray.length = 0;

            for (const key in response.data) {
                const userData = response.data[key];
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
            const response: AxiosResponse<AdditionalProp> = await axios.post(`${SERVER.API.USERPROFILE}/sub-count`, date, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            userArray.length = 0;
            for (const key in response.data) {
                const userData = response.data[key];
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
            const response: AxiosResponse<Subtask[]> = await axios.get(`${SERVER.API.SUBTASK}/get-by-space?&startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
            setSubTaskList(response.data);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const fetchSubTaskBySpace = async () => {
        try {
            const response: AxiosResponse<Subtask[]> = await axios.get(`${SERVER.API.SUBTASK}/get-by-space?&startDate=${formattedStartDate}&endDate=${formattedEndDate}&spaceId=${spaceId!}`);
            setSubTaskList(response.data);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleCalculateDiscount = spaceSubTasks.map((data) => {
        const filteredData = data.waiting + data.completed;
        const filteredDataCompleted = data.completed;
        const progress = (filteredDataCompleted * 100) / filteredData || 0;
        return {
            ...data,
            progress: progress,
        };
    });

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
            <div className="grid p-4 text-sm leading-6 bg-default sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8">
                <div className="grid grid-cols-1 grid-rows-1 mt-8 mb-5 border-2 sm:grid lg:grid xl:block border-default">

                    <div className="p-2 ml-5 text-2xl text-default">{'All User'}</div>
                    <Grid column={12} gap={1} className="mt-5 mb-5 text-center">
                        <Grid.Column sm={4} md={4} lg={1} xl={1} xxl={1}>
                            <label htmlFor="start" className="pt-5 pb-3 pl-5 pr-6 label">{'Start'}</label>
                        </Grid.Column>
                        <Grid.Column sm={4} md={4} lg={3} xl={3} xxl={3}>
                            <Datepicker
                                value={date}
                                onChange={setDate}
                                primaryColor={'pink'}
                                showShortcuts={true}
                                showFooter={true}
                                displayFormat={'YYYY/MM/DD'}
                                inputClassName="inline-block pt-5 pb-3 w-full bg-default outline-none text-default border-b border-transparent text-xs cursor-pointer"
                                popoverDirection="down"
                                useRange={false}
                                // i18n={'en'}
                                configs={{
                                    shortcuts: {
                                        today: 'Today',
                                        weekDa: {
                                            text: 'Week',
                                            period: {
                                                start: new Date().toDateString(),
                                                end: (() => {
                                                    const endDate = new Date();
                                                    endDate.setDate(endDate.getDate() + 7);
                                                    return endDate.toDateString();
                                                })(),
                                            },
                                        },
                                        currentMonth: 'This Month',
                                    },
                                    // footer: {
                                    //     cancel: 'CText',
                                    //     apply: 'AText'
                                    // }
                                }}
                                readOnly
                            />
                        </Grid.Column>
                        <Grid.Column sm={4} md={4} lg={1} xl={1} xxl={1}>
                            <label htmlFor="start" className="pt-5 pb-3 label">{'End'}</label>
                        </Grid.Column>
                        <Grid.Column sm={3} md={3} lg={3} xl={1} xxl={1}>
                            <label htmlFor="start" className="pt-5 pb-3 label">{'Space '}</label>
                        </Grid.Column>
                        <Grid.Column sm={3} md={3} lg={3} xl={3} xxl={3}>
                            <div className="mt-4 w-60">
                                <Listbox value={selected} onChange={setSelected}>
                                    <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                            <span className="block truncate">{selected?.name}</span>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <ChevronUpDownIcon
                                                    className="w-5 h-5 text-gray-400"
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
                                            <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                        <Grid.Column sm={12} md={12} lg={3} xl={1} xxl={1}>
                            <button type="button"
                                className="px-4 py-2 mx-2 mt-4 text-white bg-blue-500 rounded-lg"
                                onClick={handleConfirmClick}
                            >
                                {'Search'}
                            </button>
                        </Grid.Column>
                    </Grid>

                    <div className="justify-center px-6 py-3 mx-3 mb-2 border rounded-lg bg-default border-default ">
                        {spaceSubTasks.length !== 0 ? (
                            <div style={{ maxWidth: '100em', overflowX: 'auto' }}>
                                <div className="flex h-96">
                                    {spaceSubTasks.map((subtask, index: number) => (
                                        <React.Fragment key={index}>
                                            {handleCalculateDiscount.filter((user) => user.id === subtask.id)
                                                .map((data, index) => (
                                                    <div className="items-center m-2 " key={index}>
                                                        <p className="ml-2 text-sm text-default ">{`${data.progress.toFixed(2)}%`}</p>
                                                        <p className="text-xs text-center text-red-500">{subtask.waiting || 0}</p>
                                                        <div className="flex items-end w-5 ml-4 rounded-full bg-default-faded h-60 ">
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
                                                        <p className="text-xs text-center text-green-500">{subtask.completed || 0}</p>
                                                        <div className="items-center mb-2 ml-2.5">
                                                            <div className="flex items-center justify-center text-xs font-bold text-center align-middle border rounded-full w-7 h-7 bg-zinc-400 border-zinc-300 text-zinc-100"
                                                                title={subtask.fullName}
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                {subtask.fullName.toUpperCase().charAt(0)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 text-center text-default">
                                <Alert icon={<InformationCircleIcon className="mr-2 icon-x20" />} message={'There are no SubTasks.'} />
                            </div>
                        )}
                    </div>
                    <div className="justify-center px-4 py-3 mx-3 mb-2 border rounded-lg bg-default border-default ">
                        <Grid column={12} gap={1}>
                            {spaceSubTasks.map((subtask, index: number) => (
                                <React.Fragment key={index}>
                                    <Grid.Column sm={12} md={6} lg={6} xl={4} xxl={4} className="p-1 m-1 bg-default " >
                                        <div className="w-full h-auto px-6 py-3 mx-3 mb-2 border rounded-lg bg-default border-default ">
                                            <div className="flex items-center mb-2">
                                                <span
                                                    className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-zinc-400 border border-zinc-300 align-middle items-center flex text-center justify-center text-zinc-100 font-bold"
                                                    title={subtask.fullName}
                                                >
                                                    {subtask.fullName?.toUpperCase().charAt(0)}
                                                </span>
                                                <h5 className="ml-3 text-sm text-default">{subtask.fullName.toUpperCase()}</h5>
                                            </div>
                                            <Grid column={12} gap={1}>
                                                <Grid.Column sm={12} md={12} lg={12} xl={4} xxl={4} className="p-1 m-1 bg-default " >
                                                    <div className="text-center">
                                                        <p className="text-xl text-default ">{subtask.waiting + subtask.completed}</p>
                                                        <p className="text-sm text-default ">{'All'}</p>
                                                    </div>
                                                </Grid.Column>
                                                <Grid.Column sm={12} md={6} lg={6} xl={4} xxl={4} className="p-1 m-1 bg-default " >
                                                    <div className="text-center">
                                                        <p className="text-xl text-red-500">
                                                            {subtask.waiting || 0}
                                                        </p>
                                                        <p className="text-sm text-red-500">{'Not Done'}</p>
                                                    </div>
                                                </Grid.Column>
                                                <Grid.Column sm={12} md={6} lg={6} xl={4} xxl={4} className="p-1 m-1 bg-default " >
                                                    <div className="text-center">
                                                        <p className="text-xl text-green-500">
                                                            {subtask.completed || 0}
                                                        </p>
                                                        <p className="text-sm text-green-500">{'Done'}</p>
                                                    </div>

                                                </Grid.Column>
                                            </Grid>
                                            {handleCalculateDiscount.filter((user) => user.id === subtask.id)
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
                                                            <span className="font-semibold group-hover:text-blue-200 text-default text-md">{'WAITING'}</span>
                                                            <span className="m-3 text-md text-default">
                                                                {'('}{subtask.waiting || 0}{')'}
                                                            </span>

                                                            <Disclosure.Panel>
                                                                {
                                                                    <DndProvider backend={HTML5Backend}>
                                                                        <React.Fragment>
                                                                            <div className="p-1 mt-3 border bg-default border-default rounded-xs ">
                                                                                <div style={{ maxHeight: '10em', overflowY: 'auto' }}>
                                                                                    <table className="table border w-96" >
                                                                                        <thead>
                                                                                            <tr className=" text-default bg-default border-default">
                                                                                                <th className="p-2 m-2 border-2">{'No'}</th>
                                                                                                <th className="p-2 m-2 border-2">{'SubTask '}</th>
                                                                                                <th className="p-2 m-2 border-2">{'Task'}</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {subTaskList
                                                                                                .filter((subTasks) => subTasks.status === 'WAITING' && subTasks.assignee!.id === subtask.id)
                                                                                                .map((subTasks, index) => (
                                                                                                    <React.Fragment key={index}>
                                                                                                        <tr className="items-center border-2" >
                                                                                                            <td className="p-1 m-1 text-center border-2 text-md text-default">{index + 1}</td>
                                                                                                            <td className="p-1 m-1 text-center border-2 cursor-pointer text-md text-default"
                                                                                                                onClick={() => {
                                                                                                                    dispatch(setOpenFormSubTaskDetail(true));
                                                                                                                    dispatch(setSubtaskId(subTasks.id!));
                                                                                                                }}
                                                                                                            >{subTasks.name}</td>
                                                                                                            <td className="p-1 m-1 text-center border-2 text-md text-default">{subTasks.taskName}</td>
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

                                                            <span className="font-semibold group-hover:text-blue-200 text-default text-md ">{'COMPLETED'}

                                                            </span>
                                                            <span className="m-3 text-md text-default">
                                                                {'('}{subtask.completed || 0}{')'}
                                                            </span>
                                                            <Disclosure.Panel>
                                                                {
                                                                    <DndProvider backend={HTML5Backend}>
                                                                        <React.Fragment>
                                                                            <div className="p-1 mt-3 border bg-default border-default rounded-xs ">
                                                                                <div style={{ maxHeight: '10em', overflowY: 'auto' }}>
                                                                                    <table className="table border w-96" >
                                                                                        <thead>
                                                                                            <tr className=" text-default bg-default border-default">
                                                                                                <th className="p-2 m-2 border-2">{'No'}</th>
                                                                                                <th className="p-2 m-2 border-2">{'SubTask '}</th>
                                                                                                <th className="p-2 m-2 border-2">{'Task'}</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {subTaskList
                                                                                                .filter((subTasks) => subTasks.status === 'COMPLETED' && subTasks.assignee!.id === subtask.id)
                                                                                                .map((subTasks, index) => (
                                                                                                    <React.Fragment key={index}>
                                                                                                        <tr className="items-center border-2">
                                                                                                            <td className="p-1 m-1 text-center border-2 text-md text-default">{index + 1}</td>
                                                                                                            <td className="p-1 m-1 text-center border-2 text-md text-default">{subTasks.name}</td>
                                                                                                            <td className="p-1 m-1 text-center border-2 text-md text-default">{subTasks.taskName}</td>
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
            <FormSubTaskDetail fetchingData={spaceId === null ? fetchSubTask : fetchSubTaskBySpace} />
        </React.Fragment >
    );
};

export default Container;