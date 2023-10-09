import React from 'react';
import { Tab } from '@headlessui/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Gantt, Task } from 'gantt-task-react';
import {
    ChartBarIcon,
    ClipboardDocumentListIcon,
    EllipsisHorizontalIcon,
    EyeIcon,
    FunnelIcon,
    ListBulletIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    ShareIcon,
    Square3Stack3DIcon,
    UserGroupIcon,
    UserIcon,
    ChevronUpIcon
} from '@heroicons/react/24/outline';
import { Grid } from '../../components/Grid';
import { TodoItem, TodoState, TodoStateList } from '../../components/Todo';
import { useSelector } from 'react-redux';
import { getToken } from '../../redux/Authentication/selectors';
import { getByIdAndUrl } from '../../services/Sapce';
import { useParams } from 'react-router-dom';
import { getById } from '../../services/Project';
import { InformationCircleIcon } from '@heroicons/react/20/solid';
import { FormNewTask } from '../../components/Form';
import { Alert } from '../../components/Alert';


interface Space {
    id: number | null;
    name: string;
    color: string;
    url: string;
}

interface Project {
    id: number | null;
    stageName: string;
    color: string;
    name: string;
    taskStages: TaskStage[];
    tasks: TaskList[];
    url: string;
}

interface TaskStage {
    id: number | null;
    name: string;
    color: string;
}

interface TaskList {
    id: number;
    taskStageId: number;
    taskStageName: string;
    projectId: number;
    milestoneId:number;
    milestoneName:string;
    name: string;
    color: string;
    description: string;
    priority:string;
    progress:number;
    tags: [];
    assignees: User[];
    subTasks: SubTask[];
    start: Date;
    end: Date;
    type: string;
    isDisabled: boolean;
}

interface User {
    id: number | null;
    fullName: string;
    email: string;
}

interface SubTask {
    id: number;
    taskId: number;
    taskName: string;
    projectId: number;
    projectName: string;
    name: string;
    color: string;
    description: string;
    assignee: UserSubTask[];
    type: string;
    progressStatus: string;
    closed: boolean;
    blocked: boolean;
    end: string;
    start: string;
  }

  interface UserSubTask {
    id: number | null;
    fullName: string;
    email: string;
}


const Container = () => {

    const { spaceId, spaceUrl, projectId, projectUrl } = useParams();
    const token = useSelector(getToken);
    const config = {
        headers: {
            'Authorization': `Bearer ${token!}`
        }
    };

    const [dialogNewTasktOpen, setDialogNewTaskOpen] = React.useState<boolean>(false);

    const tabs = [
        { id: 1, name: 'List', icon: () => <ListBulletIcon className="icon-x16" /> },
        { id: 2, name: 'Board', icon: () => <ClipboardDocumentListIcon className="icon-x16" /> },
        { id: 3, name: 'Chart', icon: () => <ChartBarIcon className="icon-x16" /> }
    ];

    const [project, setProject] = React.useState<Project>();
    const [taskStages, setTaskStages] = React.useState<TaskStage[]>([]);
    const [tasks, setTasks] = React.useState<TaskList[]>([]);


    const fetchProject = async () => {
        try {
            const response: Project = await getById(parseInt(projectId!), config);
            setProject(response);
            setTaskStages(response.taskStages);
            setTasks(response.tasks);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const [space, setSpace] = React.useState<Space>({
        id: null,
        name: 'No Space',
        color: '#9CA3AF',
        url: ''
    });

    const fetchSpace = async () => {
        try {
            const response: Space = await getByIdAndUrl(parseInt(spaceId!), spaceUrl!, config);
            setSpace(response);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const convertToString = tasks.map(task => {
        return {
            ...task,
            id: task.id.toString(),
            start: new Date(task.start),
            end: new Date(task.end),
            styles: { progressColor: task.color, progressSelectedColor: '#000000', arrowColor: '#FF00ff' },
        };
    });


    const moveCardHandler = (dragIndex: number, hoverIndex: number) => {
        const dragItem = tasks[dragIndex];

        if (dragItem) {
            setTasks((prevState) => {
                const copiedStateArray = [...prevState];
                const prevItem = copiedStateArray.splice(hoverIndex, 1, dragItem);
                copiedStateArray.splice(dragIndex, 1, prevItem[0]);

                return copiedStateArray;
            });
        }
    };
    const returnItemsForColumn = (columnId: number) => {
        return tasks
            .filter((item) => item.taskStageId === columnId)
            .map((item, index) => (
                <TodoItem
                    key={item.id}
                    name={item.name}
                    task={item}
                    currentColumnName={item.taskStageId}
                    setItems={setTasks}
                    index={index}
                    moveCardHandler={moveCardHandler}
                    fetchingData={fetchProject} 
                />

            ));
    };

    React.useEffect(() => {
        spaceId && spaceUrl ? void fetchSpace() : console.error('Error');
        projectId && projectUrl ? void fetchProject() : console.error('Error');
    }, [spaceId, spaceUrl, projectId, projectUrl]);

    return (
        <React.Fragment>
            <main>
                <Tab.Group>
                    <Tab.List
                        className="flex flex-row flex-nowrap border-b dark:border-default bg-default">
                        <div className="inline-flex flex-nowrap px-3 border-b-2 border-b-transparent pb-3 pt-4 text-xs text-default uppercase cursor-default select-none">
                            {space.id === null ? (
                                <React.Fragment>
                                    <span
                                        className="w-7 h-7 px-2.5 py-1.5 text-xs rounded text-white mr-2"
                                        style={{ backgroundColor: space.color }}
                                    >
                                        {space.name.charAt(0)}
                                    </span>
                                    <span className="text-default flex items-center font-bold">
                                        {'Everything'}
                                    </span>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <span
                                        className="w-7 h-7 px-2.5 py-1.5 text-xs rounded text-white mr-2"
                                        style={{ backgroundColor: space.color }}
                                    >
                                        {space.name.charAt(0)}
                                    </span>
                                    <span className="text-default flex items-center font-bold">
                                        {space.name}
                                    </span>
                                </React.Fragment>
                            )}
                        </div>
                        {tabs.map((tab, index) => (
                            <Tab
                                key={index}
                                className={({ selected }) => `flex items-center focus:outline-none flex-nowrap px-3 border-b-2 border-b-transparent pb-3.5 pt-4 text-xs text-default uppercase hover:border-b-inherit ${selected ? '!text-pink-400 border-b-pink-500' : ''}`}
                            >
                                {tab.icon && tab.icon()}{tab.name}
                            </Tab>
                        ))}
                        <div className="flex items-center flex-nowrap text-default uppercase px-2.5 py-1">
                            <button
                                type="button"
                                className="flex items-center bg-default hover:bg-default-faded rounded-lg text-sm text-default p-1">
                                <PlusIcon className="icon-x16" />
                                {'View'}
                            </button>
                        </div>
                        <div className="flex items-center flex-nowrap text-default uppercase px-2.5 py-1 ml-auto">
                            {spaceId && spaceUrl && projectId && projectUrl && (
                                <button
                                    type="button"
                                    className="button !text-sm px-3 py-1 mr-2"
                                    onClick={() => setDialogNewTaskOpen(true)}
                                >
                                    <PlusIcon className="icon-x12" />{'New Task'}
                                </button>
                            )}
                            <button type="button" className="button !text-sm px-3 py-1">
                                <ShareIcon className="icon-x12" />{'Share'}
                            </button>
                        </div>
                    </Tab.List>
                    <header className="bg-default">
                        <nav className="flex items-center justify-center p-1">
                            <div className="hidden lg:flex lg:gap-x-12">
                                <div className="relative">
                                    <div
                                        className="absolute -inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-default">
                                        <MagnifyingGlassIcon className="icon-x16" />
                                    </div>
                                    <input
                                        type="text"
                                        className="text-default text-sm bg-default outline-none rounded-lg block w-full pl-10 p-1.5"
                                        placeholder="Search Task..."
                                    />
                                </div>
                            </div>
                            <div className="flex flex-auto justify-end">
                                <div className="flex items-center flex-nowrap text-default uppercase px-2.5 py-1">
                                    <button
                                        type="button"
                                        className="flex items-center bg-default hover:bg-default-faded rounded-lg text-sm text-default px-1.5 mr-2"
                                    >
                                        <FunnelIcon className="icon-x16" />
                                        {'Filter'}
                                    </button>
                                    <button
                                        type="button"
                                        className="flex items-center bg-default hover:bg-default-faded rounded-lg text-sm text-default px-1.5 mr-2"
                                    >
                                        <Square3Stack3DIcon className="icon-x16" />
                                        {'Group By'}
                                    </button>
                                    <button
                                        type="button"
                                        className="flex items-center bg-default hover:bg-default-faded rounded-lg text-sm text-default px-1.5 mr-2"
                                    >
                                        <UserIcon className="icon-x16" />
                                        {'Me'}
                                    </button>
                                    <button
                                        type="button"
                                        className="flex items-center bg-default hover:bg-default-faded rounded-lg text-sm text-default px-1.5 mr-2"
                                    >
                                        <UserGroupIcon className="icon-x16" />
                                        {'Assignees'}
                                    </button>
                                    <button
                                        type="button"
                                        className="flex items-center bg-default hover:bg-default-faded rounded-lg text-sm text-default px-1.5 mr-2"
                                    >
                                        <EyeIcon className="icon-x16" />
                                        {'Show'}
                                    </button>
                                    <button
                                        type="button"
                                        className="flex items-center bg-default hover:bg-default-faded rounded-lg text-sm text-default px-1.5">
                                        <EllipsisHorizontalIcon className="icon-x16 mr-0" />
                                    </button>
                                </div>
                            </div>
                        </nav>
                    </header>
                    <Tab.Panels>
                        <Tab.Panel>
                            {projectId && projectUrl ? (
                                tasks.length !== 0 ? (
                                    <DndProvider backend={HTML5Backend}>

                                        {taskStages.map((taskStage, index) => (
                                            <React.Fragment key={index}>
                                                <TodoStateList
                                                    title={taskStage.name}
                                                    state={taskStage.id!}
                                                    color={taskStage.color}
                                                    className="border-t-4 border-r border-r-default">
                                                    {returnItemsForColumn(taskStage.id!)}
                                                </TodoStateList>
                                            </React.Fragment>
                                        ))}

                                    </DndProvider>
                                ) : (
                                    <Alert icon={<InformationCircleIcon className="icon-x20 mr-2" />} message={'There are no tasks assigned to me.'} />
                                )) : (
                                <Alert icon={<InformationCircleIcon className="icon-x20 mr-2" />} message={'Please select project. 555'} />
                            )}
                        </Tab.Panel>
                        <Tab.Panel>
                            {projectId && projectUrl ? (
                                tasks.length !== 0 ? (
                                    <DndProvider backend={HTML5Backend}>
                                        <Grid column={12} gap={0}>
                                            {taskStages.map((taskStage, index) => (
                                                <Grid.Column sm={3} md={3} lg={3} xl={3} xxl={3} key={index}>
                                                    <TodoState
                                                        title={taskStage.name}
                                                        state={taskStage.id!}
                                                        color={taskStage.color}
                                                        className="border-t-4 border-r border-r-default">
                                                        {returnItemsForColumn(taskStage.id!)}
                                                    </TodoState>
                                                </Grid.Column>
                                            ))}
                                        </Grid>
                                    </DndProvider>
                                ) : (
                                    <Alert icon={<InformationCircleIcon className="icon-x20 mr-2" />} message={'There are no tasks assigned to me.'} />
                                )) : (
                                <Alert icon={<InformationCircleIcon className="icon-x20 mr-2" />} message={'Please select project.'} />
                            )}
                        </Tab.Panel>
                        <Tab.Panel>
                            <Grid column={12} gap={1} className={`${tasks.length !== 0 ? 'bg-white' : 'bg-default-faded'}`} style={{ height: 'calc(100vh - 99px)' }}>
                                <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                    {projectId && projectUrl ? (
                                        tasks.length !== 0 ? (
                                            // <Gantt tasks={convertToString as Task[]} />
                                            null
                                        ) : (
                                            <Alert icon={<InformationCircleIcon className="icon-x20 mr-2" />} message={'There are no tasks assigned to me.'} />
                                        )) : (
                                        <Alert icon={<InformationCircleIcon className="icon-x20 mr-2" />} message={'Please select project.'} />
                                    )}
                                </Grid.Column>
                            </Grid>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
                {/* Form Create Task */}
                <FormNewTask isOpen={dialogNewTasktOpen} setIsOpen={setDialogNewTaskOpen} fetchingData={fetchProject} />
            </main>
        </React.Fragment>
    );

};

export default Container;