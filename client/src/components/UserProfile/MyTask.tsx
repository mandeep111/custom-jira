import { CalendarDaysIcon } from '@heroicons/react/20/solid';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setOpenFormTaskDetail } from '../../redux/Dialog/actions';
import { setTaskId } from '../../redux/Task/actions';
import { FormTaskDetail } from '../Form';
import { Grid } from '../Grid';
import { ProgressBarTask } from '../ProgressBar';
import { setSpaceId } from '../../redux/Sidebar/actions';

interface Props {
    task: Task;
    fetchingData: () => Promise<void>;
}

const Component = ({ task, fetchingData }: Props) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(setOpenFormTaskDetail(true));
        dispatch(setTaskId(task.id!));
        dispatch(setSpaceId(task.spaceId!));
        navigate(task.url!);
    };

    return (
        <React.Fragment>
            <div className="p-2.5 mx-3 mb-2 border rounded-lg bg-default border-default">
                <Grid column={1} gap={1}>
                    <div className="flex items-center">
                        <span className="p-1.5 w-0 rounded-full mr-2.5" style={{ backgroundColor: task.color }}></span>
                        <div className="flex-grow">
                            <h5 className="text-sm text-default">{`${task.projectName!} » ${task.name}`}</h5>
                        </div>
                        <div className="flex items-center">
                            <p className="inline-flex items-center py-2 text-xs text-default">
                                <CalendarDaysIcon className="icon-x16" />
                                {task?.start && (
                                    new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(task.start))
                                )}
                            </p>
                            <p className="inline-flex items-center px-2 py-2 text-xs text-default">
                                {'—'}
                            </p>
                            <p className="inline-flex items-center py-2 text-xs text-default">
                                {task?.end && (
                                    new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(task.end))
                                )}
                            </p>
                        </div>
                    </div>
                    <hr />
                </Grid>
                <div className="cursor-pointer" onClick={handleClick}>
                    <div className="grid grid-cols-1 justify-items-end">
                        <div className="flex mt-2 mb-3 -space-x-3">
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
                    <ProgressBarTask progress={task.progress ?? 0} />
                </div>
            </div>
            <FormTaskDetail fetchTaskList={fetchingData} />
        </React.Fragment >
    );
};

export default Component;