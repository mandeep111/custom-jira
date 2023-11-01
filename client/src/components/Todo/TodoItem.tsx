import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Http from '../../services/Http';
import { API } from '../../utils/api';
import { ProgressBarTask } from '../ProgressBar';
import { FlagIcon } from '@heroicons/react/24/solid';
import { Grid } from '../Grid';
import { useSelector } from 'react-redux';
import { getIsCheckShow } from '../../redux/Project/selectors';
import { Priority } from '../../enum/Priority';
import { Task } from '../../types/Task';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    index: number;
    task: Task;
    setTask: React.Dispatch<React.SetStateAction<Task[]>>;
    currentStage: number;
}

interface Dragged {
    index: number;
    task: Task;
    currentStage: number;
    type: string;
}

const Component = ({ index, task, setTask, currentStage, onClick }: Props) => {

    const ref = React.useRef<HTMLDivElement>(null);
    const [priorityColor, setPriorityColor] = React.useState('#27AE60');

    const isCheckShow = useSelector(getIsCheckShow);

    const handleMoveTask = (index: number) => {
        setTask((prevState) => {
            const copiedStateArray = [...prevState];
            const prevItem = copiedStateArray.splice(index, 1);
            copiedStateArray.splice(index, 1, prevItem[0]);

            return copiedStateArray;
        });
    };

    const handleChangeStageTask = (currentItem: { task: Task }, columnId: number) => {
        setTask((prevState) => {
            try {
                void Http.change(`${API.TASK}/change/${currentItem.task.id!}/${columnId}`);
            } catch (error) {
                throw new Error(error as string);
            }
            return prevState.map((e) => {
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
            const dragIndex = item.index;
            const hoverIndex = item.index;
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
            handleMoveTask(item.index);
        }
    });

    const [{ isDragging }, drag] = useDrag<Dragged, void, { isDragging: boolean }>({
        type: 'Our first type',
        item: { index, task, currentStage, type: 'Our first type' },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (dropResult) {
                const { taskStageId } = dropResult;
                switch (taskStageId) {
                    case taskStageId:
                        handleChangeStageTask(item, taskStageId);
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

    React.useEffect(() => {
        switch (task.priority) {
            case Priority.URGENT:
                setPriorityColor('#C0392B');
                break;
            case Priority.HIGH:
                setPriorityColor('#F1C40F');
                break;
            case Priority.MEDIUM:
                setPriorityColor('#2980B9');
                break;
            case Priority.LOW:
                setPriorityColor('#27AE60');
                break;
            default:
                setPriorityColor('#27AE60');
        }
    }, [task.priority]);


    return (
        <React.Fragment>
            <div
                ref={ref}
                className="mx-3 mb-2 px-6 py-3 bg-default border border-default rounded-lg"
                onMouseUp={mouseUpHandler}
                onMouseDown={mouseDownHandler}
                style={{ opacity }}
                onClick={onClick}
            >
                <Grid column={12} gap={1}>
                    <Grid.Column sm={10} md={10} lg={10} xl={10} xxl={10}>
                        <div className="flex items-center mb-8">
                            <span className="p-1.5 w-0 rounded-full" style={{ backgroundColor: task.color }}></span>
                            <h5 className="text-lg font-bold text-default ml-3">{task.name}</h5>
                        </div>
                    </Grid.Column>
                    <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2}>
                        <div className="flex justify-end">
                            <FlagIcon className="icon-x16" style={{ color: priorityColor }} />
                        </div>
                    </Grid.Column>
                </Grid>
                <Grid column={12} gap={1}>
                    <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <p className="mb-2 text-sm text-default">{new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(task.end!))}</p>
                    </Grid.Column>
                </Grid>
                <Grid column={12} gap={1}>
                    <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <div className="flex grid-cols-1 justify-items-start whitespace-nowrap overflow-hidden">
                            <div className="flex mt-2 -space-x-3 mb-3">
                                {task?.assignee.slice(0, 5).map((data, index) => (
                                    <span
                                        key={index}
                                        className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-zinc-400 border border-zinc-300 align-middle items-center flex text-center justify-center text-zinc-100 font-bold"
                                        title={data.fullName}
                                    >
                                        {data.fullName?.toUpperCase().charAt(0)}
                                    </span>
                                ))}
                                {Array.isArray(task?.assignee) && task?.assignee.length > 5 && (
                                    <span
                                        className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-indigo-400 border border-indigo-300 align-middle items-center flex text-center justify-center text-indigo-100 font-bold"
                                        title={task.assignee.slice(5).map((item) => item.fullName).join(', ')}
                                    >
                                        {'+'}{task.assignee.length - 5}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Grid.Column>
                </Grid>
                <Grid column={12} gap={1}>
                    <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <ProgressBarTask progress={task.progress ?? 0} />
                    </Grid.Column>
                </Grid>
                <Grid column={12} gap={1}>
                    <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <ol className="relative border-l border-default">
                            {isCheckShow && task.subTasks!.map((data, index) =>
                                <li className="mb-5 ml-4" key={index}>
                                    <div className=""></div>
                                    <div className="absolute w-3 h-3 bg-default-faded rounded-full mt-1.5 -left-1.5 border border-default"></div>
                                    <time className="mb-1 text-xs leading-none text-default">{new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(task.end!))}</time>
                                    <h3 className="text-md text-default">{data.name}</h3>
                                </li>
                            )}
                        </ol>
                    </Grid.Column>
                </Grid>
            </div>
        </React.Fragment>
    );
};

export default Component;