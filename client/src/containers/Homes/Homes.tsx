import { Disclosure, Tab } from '@headlessui/react';
import * as HeroIcons from '@heroicons/react/24/outline';
import ArrowRightCircleIcon from '@heroicons/react/24/outline/esm/ArrowRightCircleIcon';
import axios, { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import React from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Chart } from 'react-google-charts';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '../../components/Grid';
import { MySubTask, MyTask, UserProfileList } from '../../components/UserProfile';
import { setToggle } from '../../redux/Sidebar/actions';
import { getToggle } from '../../redux/Sidebar/selectors';
import pieOptions from './pie.config';
import './styles.css';
import subTaskOptions from './subtask.config';
import taskOptions from './task.config';

type UserProfile = {
    project_completed: number | null;
    task: number | null;
    projects: number | null;
    subTasks: number | null;
    sub_task_completed: number | null;
    task_completed: number | null;
}

const Container = () => {

    const dispatch = useDispatch();

    const toggle = useSelector(getToggle);
    const handleSidebarToggle = () => {
        dispatch(setToggle(!toggle));
    };

    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [subTasks, setSubTasks] = React.useState<Subtask[]>([]);
    const [taskStages, setTaskStages] = React.useState<TaskStage[]>([]);
    const [taskStageId, setTaskStageId] = React.useState<number | null>(null);
    const [userProfiles, setUserProfiles] = React.useState<UserProfile>();

    const fetchTaskStage = async () => {
        try {
            const response: AxiosResponse<APIResponse<TaskStage>> = await axios.get(`${SERVER.API.TASKSTAGE}/page`);
            const { content } = response.data;
            setTaskStages(content);
        } catch (error) {
            throw new Error(`${error as string}`);
        }
    };

    const fetchMyTasks = async () => {
        try {
            const response: AxiosResponse<Task[]> = await axios.get(`${SERVER.API.USERPROFILE}/my-tasks`);
            setTasks(response.data);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const fetchMySubTasks = async () => {
        try {
            const response: AxiosResponse<Subtask[]> = await axios.get(`${SERVER.API.USERPROFILE}/my-sub-tasks`);
            setSubTasks(response.data);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const response: AxiosResponse<UserProfile> = await axios.get(`${SERVER.API.USERPROFILE}`);
            setUserProfiles(response.data);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const returnItemsForColumn = (columnId: number | null) => {
        if (columnId !== null) {
            return tasks.filter((item) => item.taskStageId === columnId).map((item, index) => (
                <MyTask
                    key={index}
                    task={item}
                    fetchingData={fetchMyTasks}
                />
            ));
        }
    };

    const returnSubItemsForColumn = () => {
        return subTasks.map((item, index) => (
            <MySubTask
                key={index}
                subtask={item}
            />
        ));
    };

    const calendarEvents = tasks.map((task) => ({
        title: task.name,
        start: new Date(task.start!),
        end: new Date(task.end!),
    }));

    React.useEffect(() => {
        void fetchMyTasks();
        void fetchMySubTasks();
        void fetchTaskStage();
        void fetchUserProfile();
    }, []);

    return (
        <React.Fragment>
            <Tab.Group>
                <Tab.List className="flex flex-row border-b flex-nowrap dark:border-default bg-default">
                    <div className="flex flex-row border-b flex-nowrap dark:border-default bg-default">
                        <button
                            type="button"
                            className={`text-default px-3 ${toggle ? '' : 'hidden'}`}
                            onClick={handleSidebarToggle}
                        >
                            <HeroIcons.ChevronDoubleRightIcon className="mr-0 icon-x20" />
                        </button>
                        <Tab className={({ selected }) => `flex items-center focus:outline-none flex-nowrap px-3 border-b-2 border-b-transparent pb-3.5 pt-4 text-xs text-default uppercase hover:border-b-inherit ${selected ? '!text-pink-400 border-b-pink-500' : ''}`}>
                            <div className="inline-flex px-3 pt-4 pb-3 text-xs uppercase border-b-2 cursor-default select-none flex-nowrap border-b-transparent text-default">
                                <span className="flex items-center font-bold text-default">
                                    {'Home'}
                                </span>
                            </div>
                        </Tab>
                        <Tab className={({ selected }) => `flex items-center focus:outline-none flex-nowrap px-3 border-b-2 border-b-transparent pb-3.5 pt-4 text-xs text-default uppercase hover:border-b-inherit ${selected ? '!text-pink-400 border-b-pink-500' : ''}`}>
                            <div className="inline-flex px-3 pt-4 pb-3 text-xs uppercase border-b-2 cursor-default select-none flex-nowrap border-b-transparent text-default">
                                <span className="flex items-center font-bold text-default">
                                    {'Calendar'}
                                </span>
                            </div>
                        </Tab>
                    </div>
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel className="p-5">
                        <Grid column={12} gap={5} className="py-5">
                            <Grid.Column sm={12} md={12} lg={12} xl={6} xxl={6}>
                                <div className="mb-10 border border-default">
                                    <Disclosure>
                                        {({ open }) => (
                                            <React.Fragment>
                                                <div className="inline-flex items-center w-full transition duration-200 rounded flex-nowrap">
                                                    <Disclosure.Button>
                                                        <div className="flex items-end px-3 py-5">
                                                            <ArrowRightCircleIcon className={`${open ? 'rotate-90 transform' : ''} icon-x24 text-default`} />
                                                            <span className="text-xl font-semibold text-default">{'Task'}</span>
                                                        </div>
                                                    </Disclosure.Button>
                                                </div>
                                                <Disclosure.Panel>
                                                    <Tab.Group>
                                                        <Tab.List className="flex justify-center w-full flex-nowrap border-default bg-default">
                                                            <div className="text-xs uppercase cursor-pointer select-none border-b-transparent text-default">
                                                                <div className="flex flex-wrap">
                                                                    <DndProvider backend={HTML5Backend}>
                                                                        {taskStages.map((taskStage, index) => (
                                                                            <Tab
                                                                                key={index}
                                                                                className="flex justify-center text-xs uppercase border-b-2 flex-nowrap border-b-transparent text-default"
                                                                                onClick={() => setTaskStageId(taskStage.id)}
                                                                            >
                                                                                <UserProfileList
                                                                                    title={taskStage.name!}
                                                                                    state={taskStage.id}
                                                                                    color={taskStage.color!}
                                                                                    className="border-t-4 border-b border-default hover:text-pink-400">
                                                                                </UserProfileList>
                                                                            </Tab>
                                                                        ))}
                                                                    </DndProvider>
                                                                </div>
                                                            </div>
                                                        </Tab.List>
                                                        <Tab.Panels className="mt-5">
                                                            {taskStages.map((_taskStage, index) => (
                                                                <Tab.Panel key={index}>
                                                                    <DndProvider backend={HTML5Backend}>
                                                                        <React.Fragment key={index}>
                                                                            <div style={{ maxHeight: '30em', overflowY: 'auto' }}>
                                                                                {returnItemsForColumn(taskStageId)}
                                                                            </div>
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
                                <div className="border border-default">
                                    <Disclosure>
                                        {({ open }) => (
                                            <React.Fragment>
                                                <div className="inline-flex items-center w-full transition duration-200 rounded flex-nowrap">
                                                    <Disclosure.Button>
                                                        <div className="flex items-end px-3 py-5">
                                                            <ArrowRightCircleIcon className={`${open ? 'rotate-90 transform' : ''} icon-x24 text-default`} />
                                                            <span className="text-xl font-semibold text-default">{'SubTask'}</span>
                                                        </div>
                                                    </Disclosure.Button>
                                                </div>
                                                <Disclosure.Panel>
                                                    <DndProvider backend={HTML5Backend}>
                                                        <React.Fragment>
                                                            <div style={{ maxHeight: '30em', overflowY: 'auto' }}>
                                                                {returnSubItemsForColumn()}
                                                            </div>
                                                        </React.Fragment>
                                                    </DndProvider>
                                                </Disclosure.Panel>
                                            </React.Fragment>
                                        )}
                                    </Disclosure>
                                </div>
                            </Grid.Column>
                            <Grid.Column sm={12} md={12} lg={12} xl={6} xxl={6}>
                                <div className="border flex-nowrap border-default bg-default">
                                    <Chart
                                        graphID="pieChart"
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
                                        options={pieOptions}
                                        width={'100%'}
                                        height={'400px'}
                                    />
                                </div>
                            </Grid.Column>
                        </Grid>
                        <Grid column={12} gap={5}>
                            <Grid.Column sm={12} md={12} lg={12} xl={6} xxl={6}>
                                <div className="border flex-nowrap border-default bg-default">
                                    <Chart
                                        graphID="taskChart"
                                        chartType="ComboChart"
                                        width={'100%'}
                                        height={'400px'}
                                        data={[
                                            ['Name', 'Task', 'Done'],
                                            ['Task', userProfiles?.task, userProfiles?.task_completed],
                                        ]}
                                        options={taskOptions}
                                        className={'bg-default'}
                                    />
                                </div>
                            </Grid.Column>
                            <Grid.Column sm={12} md={12} lg={12} xl={6} xxl={6}>
                                <div className="border flex-nowrap border-default bg-default">
                                    <Chart
                                        graphID="subTaskChart"
                                        chartType="ComboChart"
                                        width={'100%'}
                                        height={'400px'}
                                        data={[
                                            ['Name', 'SubTask', 'Done'],
                                            ['SubTask', userProfiles?.subTasks, userProfiles?.sub_task_completed],
                                        ]}
                                        options={subTaskOptions}
                                    />
                                </div>
                            </Grid.Column>
                        </Grid>
                    </Tab.Panel>
                    <Tab.Panel>
                        <DndProvider backend={HTML5Backend}>
                            <div
                                className="border-b dark:border-default bg-default text-default"
                                style={{ height: 'calc(100vh - 80px)' }}
                            >
                                <Calendar
                                    localizer={dayjsLocalizer(dayjs)}
                                    events={calendarEvents}
                                    startAccessor="start"
                                    endAccessor="end"
                                />
                            </div>
                        </DndProvider>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </React.Fragment>
    );

};

export default Container;