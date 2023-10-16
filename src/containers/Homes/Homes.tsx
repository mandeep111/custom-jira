import { Disclosure, Tab } from '@headlessui/react';
import ArrowRightCircleIcon from '@heroicons/react/24/outline/esm/ArrowRightCircleIcon';
import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Chart } from 'react-google-charts';
import { useSelector } from 'react-redux';
import { MySubTask, MyTask, UserProfileList } from '../../components/UserProfile';
import { getToken } from '../../redux/Authentication/selectors';
import { getMySubTasks, getMyTasks, getUserProfiles } from '../../services/UserProfile';
import { API } from '../../utils/api';
import { SubTask, Task, TaskStage } from '../../types/Task';
import {
    Calendar,
    Views,
    DateLocalizer,
    momentLocalizer,
} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
interface ContentTaskStage {
    pageNo: number | 0,
    pageSize: number | 0,
    totalElements: number | 0,
    totalPages?: number,
    last: true,
    content: TaskStage[],
}

interface UserProfile {
    project_completed: number | null;
    task: number | null;
    projects: number | null;
    subTasks: number | null;
    sub_task_completed: number | null;
    task_completed: number | null;
}

const Container = () => {
    const localizer = momentLocalizer(moment);
    const token = useSelector(getToken);
    const config = {
        headers: {
            'Authorization': `Bearer ${token!}`
        }
    };

    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [subTasks, setSubTasks] = React.useState<SubTask[]>([]);
    const [taskStages, setTaskStages] = React.useState<TaskStage[]>([]);
    const [userProfiles, setUserProfiles] = React.useState<UserProfile>();

    const getAllTaskStage = async () => {

        try {
            const response: AxiosResponse<ContentTaskStage> = await axios.get(`${API.TASK_STAGE}/page`, config);
            const { content }: ContentTaskStage = response.data;
            // const checkLot: Lot = content.map((templateId: productVariantList) => response.data.content
            setTaskStages(content);

        } catch (error) {
            throw new Error(`An error occurred: ${error as string}`);
        }
    };

    const fetchMyTasks = async () => {
        try {
            const response: Task[] = await getMyTasks(config);
            setTasks(response);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const fetchMySubTasks = async () => {
        try {
            const response: SubTask[] = await getMySubTasks(config);
            setSubTasks(response);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const response: UserProfile = await getUserProfiles(config);
            setUserProfiles(response);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const data = [
        ['Name', 'Task', 'Done'],
        ['Task', userProfiles?.task, userProfiles?.task_completed],
    ];

    const options = {
        title: 'My Tasks',
        vAxis: { title: 'Value' },
        hAxis: { title: 'Tasks' },
        seriesType: 'bars',
        colors: ['red', 'green'], // Specify custom colors for the series here
    };

    const dataSubTask = [
        ['Name', 'SubTask', 'Done'],
        ['SubTask', userProfiles?.subTasks, userProfiles?.sub_task_completed],
    ];

    const optionsSubTask = {
        title: 'My SubTasks',
        vAxis: { title: 'Value' },
        hAxis: { title: 'SubTasks' },
        seriesType: 'bars',
        colors: ['red', 'green'], // Specify custom colors for the series here
    };

    const [taskStageId, setTaskStageId] = React.useState<number | null>(null);

    const returnItemsForColumn = (columnId: number | null) => {
        if (columnId !== null) {
            return tasks
                .filter((item) => item.taskStageId === columnId)
                .map((item, index) => (
                    <MyTask
                        key={item.id}
                        name={item.name}
                        task={item}
                        currentColumnName={item.taskStageId}
                        setItems={setTasks}
                        index={index}
                        fetchingData={fetchMyTasks}
                    />
                ));
        }
    };

    const returnSubItemsForColumn = () => {
        return subTasks
            .map((item, index) => (
                <MySubTask
                    key={item.id}
                    subTask={item}
                    // setItems={setSubTasks}
                    index={index}
                // fetchingData={fetchMySubTasks}
                />
            ));
    };

    const events = tasks.map((task) => ({
        title: task.name,
        start: new Date(task.start),
        end: new Date(task.end),
    }));

    React.useEffect(() => {
        void fetchMyTasks();
        void fetchMySubTasks();
        void getAllTaskStage();
        void fetchUserProfile();
    }, [token]);

    return (
        <React.Fragment>
            <Tab.Group>
                <Tab.List
                    className="flex flex-row flex-nowrap border-b dark:border-default bg-default">
                    <div className="flex flex-row flex-nowrap border-b dark:border-default bg-default">
                        <Tab className={({ selected }) => `flex items-center focus:outline-none flex-nowrap px-3 border-b-2 border-b-transparent pb-3.5 pt-4 text-xs text-default uppercase hover:border-b-inherit ${selected ? '!text-pink-400 border-b-pink-500' : ''}`}>
                            <div className="inline-flex flex-nowrap px-3 border-b-2 border-b-transparent pb-3 pt-4 text-xs text-default uppercase cursor-default select-none">
                                <span className="text-default flex items-center font-bold">
                                    {'Home'}
                                </span>
                            </div>
                        </Tab>
                        <Tab className={({ selected }) => `flex items-center focus:outline-none flex-nowrap px-3 border-b-2 border-b-transparent pb-3.5 pt-4 text-xs text-default uppercase hover:border-b-inherit ${selected ? '!text-pink-400 border-b-pink-500' : ''}`}>
                            <div className="inline-flex flex-nowrap px-3 border-b-2 border-b-transparent pb-3 pt-4 text-xs text-default uppercase cursor-default select-none">
                                <span className="text-default flex items-center font-bold">
                                    {'Calendar'}
                                </span>
                            </div>
                        </Tab>
                    </div>
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel>
                        <div className="bg-default   p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 grid  sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-2 text-sm leading-6">
                            <div className="flex flex-row flex-nowrap border-b dark:border-default bg-default">
                                <Chart
                                    chartType="PieChart"
                                    data={[
                                        ['Profile', 'Completed'],
                                        ['Projects', userProfiles?.projects],
                                        ['Project_Completed', userProfiles?.project_completed],
                                        ['Task', userProfiles?.task],
                                        ['Task_Completed', userProfiles?.task_completed],
                                        ['SubTasks', userProfiles?.subTasks],
                                        ['SuTask_Completed', userProfiles?.sub_task_completed],
                                    ]}
                                    options={{
                                        title: 'My Project',
                                        is3D: true
                                    }}
                                    width={'100%'}
                                    height={'400px'}
                                />
                            </div>
                            <div className="flex flex-row flex-nowrap border-b dark:border-default bg-default">

                                <Chart
                                    chartType="ComboChart"
                                    width={'100%'}
                                    height={'400px'}
                                    data={data}
                                    options={options}
                                />
                            </div>
                        </div>


                        <div className="bg-default p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4 text-sm leading-6">

                            <div className="grid grid-cols-1  ">
                                <span className="group-hover:text-white font-semibold text-default text-3xl">
                                    {'My Work'}
                                </span>
                                <div className="grid sm:block lg:block xl:block mt-8 mb-5  border-2 border-default">
                                    <Disclosure>
                                        {({ open }) => (
                                            <React.Fragment>
                                                <div className="inline-flex flex-nowrap items-center rounded transition duration-200  hover:bg-default-faded w-full">
                                                    <Disclosure.Button>
                                                        <ArrowRightCircleIcon className={`${open ? 'rotate-90 transform' : ''}     inline-flex icon-x24 text-default ml-3 mt-5 mb-2  `} />
                                                    </Disclosure.Button>
                                                    <span className="group-hover:text-blue-200 text-default font-semibold text-xl mt-5 mb-2">{'Task'}</span>
                                                </div>
                                                <Disclosure.Panel>
                                                    <Tab.Group>
                                                        <Tab.List
                                                            className="flex flex-row flex-nowrap border-b dark:border-default bg-default">
                                                            <div className="grid sm:block lg:grid-cols-5 xl:grid-cols-5 px-3 border-b-2 border-b-transparent pb-3 pt-4 text-xs text-default uppercase cursor-default select-none">
                                                                <div className="flex flex-wrap">
                                                                    {
                                                                        <DndProvider backend={HTML5Backend}>
                                                                            {taskStages
                                                                                .map((taskStage, index) => (
                                                                                    <Tab
                                                                                        key={index}
                                                                                        className={({ selected }) => `flex items-start focus:outline-none flex-nowrap px-3 border-b-2 border-b-transparent pb-3.5 pt-4 text-xs text-default bg-default uppercase hover: ${selected ? ' border-b-blue-600 border-b-4 border-width: 4px' : ''}`}
                                                                                        onClick={() => setTaskStageId(taskStage.id)}
                                                                                    >
                                                                                        <UserProfileList
                                                                                            title={taskStage.name}
                                                                                            state={taskStage.id}
                                                                                            color={taskStage.color}
                                                                                            className="border-t-4 border-r border-r-default">
                                                                                        </UserProfileList>
                                                                                    </Tab>
                                                                                ))}
                                                                        </DndProvider>
                                                                    }
                                                                </div>
                                                            </div>

                                                        </Tab.List>
                                                        <Tab.Panels className="mt-5 ">
                                                            {taskStages.map((_taskStage, index) => (
                                                                <Tab.Panel key={index}>
                                                                    <DndProvider backend={HTML5Backend}>
                                                                        <React.Fragment key={index}>
                                                                            {returnItemsForColumn(taskStageId)} {/* Use the corresponding taskStageId */}
                                                                        </React.Fragment>
                                                                    </DndProvider>
                                                                </Tab.Panel>
                                                            ))}
                                                        </Tab.Panels>

                                                    </Tab.Group>
                                                </Disclosure.Panel>
                                            </React.Fragment>

                                        )}
                                    </Disclosure>
                                </div>
                                <div className="grid sm:grid lg:grid xl:block grid-cols-1 grid-rows-1 mt-8 mb-5 border-default border-2">
                                    <Disclosure>
                                        {({ open }) => (
                                            <React.Fragment>
                                                <div className="inline-flex flex-nowrap items-center rounded transition duration-200  hover:bg-default-faded w-full">
                                                    <Disclosure.Button>
                                                        <ArrowRightCircleIcon className={`${open ? 'rotate-90 transform' : ''}     inline-flex icon-x24 text-default ml-3 mt-5 mb-5 `} />
                                                    </Disclosure.Button>
                                                    <span className="group-hover:text-blue-200 text-default font-semibold text-xl mt-5 mb-5">{'SubTask'}</span>
                                                </div>
                                                <Disclosure.Panel>
                                                    {
                                                        <DndProvider backend={HTML5Backend}>
                                                            <React.Fragment>
                                                                {returnSubItemsForColumn()}
                                                            </React.Fragment>
                                                        </DndProvider>
                                                    }
                                                </Disclosure.Panel>
                                            </React.Fragment>

                                        )}
                                    </Disclosure>
                                </div>
                            </div>
                            <div className="flex flex-row flex-nowrap  border-b dark:border-default bg-default">
                                <div className="height600">
                                    <Chart
                                        chartType="ComboChart"
                                        width={'100%'}
                                        height={'400px'}
                                        data={dataSubTask}
                                        options={optionsSubTask}
                                    />
                                </div>
                            </div>
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <DndProvider backend={HTML5Backend}>
                            <React.Fragment>
                                <div className="border-b dark:border-default bg-default">
                                    <Calendar
                                        localizer={localizer}
                                        events={events}
                                        startAccessor="start"
                                        endAccessor="end"
                                        style={{ height: 500 }}
                                    />
                                </div>
                            </React.Fragment>
                        </DndProvider>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group >
        </React.Fragment >
    );

};

export default Container;