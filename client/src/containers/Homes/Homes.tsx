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
import { getMyTasks } from '../../services/UserProfile';
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
    milestoneId: number;
    milestoneName: string;
    name: string;
    color: string;
    description: string;
    priority: string;
    progress: number;
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
    const token = useSelector(getToken);
    const config = {
        headers: {
            'Authorization': `Bearer ${token!}`
        }
    };


    const [project, setProject] = React.useState<Project>();
    const [taskStages, setTaskStages] = React.useState<TaskStage[]>([]);
    const [tasks, setTasks] = React.useState<TaskList[]>([]);


    const fetchMyTasks = async () => {
        try {
            const response: Project = await getMyTasks(config);
            setProject(response);
            setTaskStages(response.taskStages);
            setTasks(response.tasks);
        } catch (error) {
            throw new Error(error as string);
        }
    };


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
    // const returnItemsForColumn = (columnId: number) => {
    //     return tasks
    //         .filter((item) => item.taskStageId === columnId)
    //         .map((item, index) => (
    //             <TodoItem
    //                 key={item.id}
    //                 name={item.name}
    //                 task={item}
    //                 currentColumnName={item.taskStageId}
    //                 setItems={setTasks}
    //                 index={index}
    //                 moveCardHandler={moveCardHandler}
                    
    //             />

    //         ));
    // };

    React.useEffect(() => {
        void fetchMyTasks();
    }, []);

    return (
        <React.Fragment>
            <div className="flex flex-row flex-nowrap border-b dark:border-default bg-default">
                <div className="inline-flex flex-nowrap px-3 border-b-2 border-b-transparent pb-3 pt-4 text-xs text-default uppercase cursor-default select-none">
                    <span className="text-default flex items-center font-bold">
                        {'Home'}
                    </span>
                </div>
            </div>

            <div className="bg-slate-50 p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 text-sm leading-6">

                <div className="grid sm:block lg:grid xl:block grid-cols-2 grid-rows-2 items-center">
                    <div>
                        <span className="group-hover:text-white font-semibold text-slate-900 text-3xl">
                            My Work
                        </span>
                    </div>
                    <div className="grid sm:block lg:grid xl:block grid-cols-2 grid-rows-2 items-center">
                        <div>
                            <span className="group-hover:text-blue-200 text-xl">Task</span>
                            {/* {
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

                            } */}
                        </div>
                    </div>
                    <div className="grid sm:block lg:grid xl:block grid-cols-2 grid-rows-2 items-center">
                        <div>
                            <span className="group-hover:text-blue-200 text-xl">SubTask</span>
                        </div>
                    </div>
                </div>

            </div>



        </React.Fragment >
    );

};

export default Container;