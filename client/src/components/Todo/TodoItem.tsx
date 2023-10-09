import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FormTaskDetail } from '../Form';
import { updateState } from '../../services/Task';
import { useSelector } from 'react-redux';
import { getToken } from '../../redux/Authentication/selectors';
import { getAll } from '../../services/User';
import { getById, getTaskAll } from '../../services/Task';
interface TodoItem {
    index: number;
    name: string;
    task: TodoState;
    currentColumnName: number;
    moveCardHandler: (index: number, newColumn: number) => void;
    setItems: React.Dispatch<React.SetStateAction<TodoState[]>>;
    fetchingData: () => Promise<void>;
}

interface TodoState {
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

interface Dragged {
    index: number;
    task: TodoState;
    currentColumnName: number;
    type: string;
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

const Component: React.FunctionComponent<TodoItem> = ({ task, index, currentColumnName, moveCardHandler, setItems, fetchingData }) => {

    const ref = React.useRef<HTMLDivElement>(null);
    const token = useSelector(getToken);
    const config = {
        headers: {
            'Authorization': `Bearer ${token!}`
        }
    };
    const [dialogTaskDetailOpen, setDialogTaskDetailOpen] = React.useState<boolean>(false);

    const changeItemColumn = (currentItem: { task: TodoState }, columnId: number) => {
        setItems((prevState) => {
            return prevState.map((e) => {
                try {
                    void updateState(currentItem.task.id, columnId, config);
                } catch (error) {
                    throw new Error(error as string);
                }
                return {
                    ...e,
                    taskStageId: e.id === currentItem.task.id ? columnId : e.taskStageId,
                };
            });
        });
    };

    const [, drop] = useDrop({
        accept: 'Our first type',
        hover(item: { index: number }, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex: number = item.index;
            const hoverIndex: number = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = (ref.current as HTMLElement)?.getBoundingClientRect();
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            let hoverClientY: number | undefined;

            if (clientOffset) {
                hoverClientY = clientOffset.y - hoverBoundingRect.top;
            }

            if (hoverClientY !== undefined) {
                if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                    return;
                }
                if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                    return;
                }
            }
            moveCardHandler(dragIndex, hoverIndex);
            item.index = hoverIndex;
        }
    });

    const [{ isDragging }, drag] = useDrag<Dragged, void, { isDragging: boolean }>({
        type: 'Our first type',
        item: { index, task, currentColumnName, type: 'Our first type' },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();

            if (dropResult) {
                const { taskStageId } = dropResult;
                switch (taskStageId) {
                    case taskStageId:
                        changeItemColumn(item, taskStageId);
                        break;
                    default:
                        break;
                }
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const opacity = isDragging ? 0.4 : 1;
    drag(drop(ref));

    const mouseDownHandler = () => {
        if (ref.current) {
            ref.current.style.cursor = 'grabbing';
            ref.current.style.userSelect = 'none';
        }
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = () => {
        if (ref.current) {
            ref.current.style.cursor = 'grab';
        }
    };

    const mouseUpHandler = () => {
        if (ref.current) {
            ref.current.style.cursor = 'grab';
            ref.current.style.removeProperty('user-select');
        }
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);



    const [user, setUser] = React.useState<User[]>([]);

    const fetchUser = async () => {
        try {
            const response: User[] = await getAll(config);
            setUser(response);

        } catch (error) {
            throw new Error(error as string);
        }
    };

    // const fetchTaskList = async () => {
    //     try {
    //         const response: TodoState[] = await getTaskAll(config);
    //         setItems(response);
    //     } catch (error) {
    //         throw new Error(error as string);
    //     }
    // };

    console.info('task 555 = ', task);

    React.useEffect(() => {
        void fetchUser();
    }, []);

    return (
        <React.Fragment>
            <div
                ref={ref}
                className="mx-3 mb-2 px-6 py-3 bg-default border border-default rounded-lg"
                onMouseUp={mouseUpHandler}
                onMouseDown={mouseDownHandler}
                style={{ opacity }}
                onClick={() => setDialogTaskDetailOpen(true)}
            >
                <div className="inline-flex items-center mb-5">
                    <span className="p-1.5 w-0 rounded-full flex" style={{ backgroundColor: task.color }}></span>
                    <h5 className="text-sm text-default ml-3">{task.name}</h5>
                </div>

                <p className="mb-2 text-sm text-default">{new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(task.start))}</p>
                <div className="flex grid-cols-1  justify-items-start  whitespace-nowrap overflow-hidden">

                    {task.assignees ? (
                        task.assignees.map((assignee: User, index: number) => (
                            <React.Fragment key={index}>
                                <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center bg-blue-100 m-1">
                                    {assignee.fullName}
                                </div>
                            </React.Fragment>
                        ))
                    ) : (
                        null
                    )}
                </div>
                <div className="flex items-center">
                    <div className="w-full bg-default-faded rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full ${task.progress <= 19
                                ? 'bg-zinc-300'
                                : task.progress >= 20 && task.progress <= 39
                                    ? 'bg-purple-300'
                                    : task.progress >= 40 && task.progress <= 59
                                        ? 'bg-indigo-300'
                                        : task.progress >= 60 && task.progress <= 79
                                            ? 'bg-sky-300'
                                            : task.progress >= 80 && task.progress <= 99
                                                ? 'bg-teal-300' : task.progress >= 100
                                                    ? 'bg-green-300' : ''}`
                            } style={{ width: `${task.progress}%` }}>
                        </div>
                    </div>
                    <p className="text-sm text-default">{`${task.progress}%`}</p>
                </div>
            </div>
            <FormTaskDetail isOpen={dialogTaskDetailOpen} setIsOpen={setDialogTaskDetailOpen} item={task} setItem={setItems} fetchingData={fetchingData} />
        </React.Fragment>
    );
};

export default Component;