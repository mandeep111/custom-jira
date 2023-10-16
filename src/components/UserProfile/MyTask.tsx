import React from 'react';
import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';
import { getToken } from '../../redux/Authentication/selectors';
import { Task } from '../../types/Task';
import { FormTaskDetail } from '../Form';

interface TodoItem {
    index: number;
    name: string;
    task: Task;
    currentColumnName: number;
    setItems: React.Dispatch<React.SetStateAction<Task[]>>;
    fetchingData: () => Promise<void>;
}

interface Dragged {
    index: number;
    task: Task;
    currentColumnName: number;
    type: string;
}

const Component: React.FunctionComponent<TodoItem> = ({ task, index, currentColumnName, setItems, fetchingData }) => {

    const ref = React.useRef<HTMLDivElement>(null);
    const token = useSelector(getToken);
    const config = {
        headers: {
            'Authorization': `Bearer ${token!}`
        }
    };
    const [dialogTaskDetailOpen, setDialogTaskDetailOpen] = React.useState<boolean>(false);

    const [{ isDragging }, drag] = useDrag<Dragged, void, { isDragging: boolean }>({
        type: 'Our first type',
        item: { index, task, currentColumnName, type: 'Our first type' },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const opacity = isDragging ? 0.4 : 1;

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
                <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2   border-b dark:border-default bg-default ">
                    <div className=" grid-cols-1  justify-items-start   items-center mb-5">
                        <h5 className="text-sm text-default ml-3">{'TASK_STAGE_NAME : '}{task.taskStageName}</h5>
                    </div>
                    <div className="grid grid-cols-1  justify-items-end">
                        <div className="flex ">
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
                    </div>
                </div>

                <div className="inline-flex items-center mb-5">
                    <span className="p-1.5 w-0 rounded-full flex" style={{ backgroundColor: task.color }}></span>
                    <h5 className="text-sm text-default ml-3">{'TASKNAME : '}{task.name}</h5>
                </div>

                <p className="mb-2 text-sm text-default">{new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(task.start))}</p>
                <div className="flex grid-cols-1  justify-items-start  whitespace-nowrap overflow-hidden">

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