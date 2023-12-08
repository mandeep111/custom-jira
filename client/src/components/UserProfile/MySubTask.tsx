import { CalendarDaysIcon } from '@heroicons/react/20/solid';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setOpenFormSubTaskDetail } from '../../redux/Dialog/actions';
import { setSubtaskId } from '../../redux/Subtask/actions';
import { Grid } from '../Grid';

interface Props {
    subtask: Subtask;
}

const Component = ({ subtask }: Props) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(setOpenFormSubTaskDetail(true));
        dispatch(setSubtaskId(subtask.id!));
        navigate(subtask.url!);
    };

    return (
        <React.Fragment>
            <div
                className="p-2.5 mx-3 mb-2 border rounded-lg bg-default border-default cursor-pointer has-tooltip"
                onClick={handleClick}
            >
                <Grid column={1} gap={1}>
                    <div className="flex items-center">
                        <h5 className="text-sm text-default">
                            {subtask.status === 'WAITING'
                                ? <label title="Waiting">{'⏳'}</label>
                                : subtask.status === 'DOING'
                                    ? <label title="Doing">{'🏃'}</label>
                                    : subtask.status === 'COMPLETED'
                                        ? <label title="Done">{'✅'}</label>
                                        : <label title="Cancel">{'❌'}</label>
                            }
                        </h5>
                        <div className="flex-grow overflow-hidden">
                            <h5 className="overflow-hidden text-sm text-default whitespace-nowrap text-ellipsis">
                                {`${subtask.spaceName!} » ${subtask.projectName!} » ${subtask.taskName!} » ${subtask.name}`}
                            </h5>
                        </div>
                        <div className="flex items-center ml-14 whitespace-nowrap">
                            <p className="inline-flex items-center py-2 text-xs text-default">
                                <CalendarDaysIcon className="icon-x16" />
                                {subtask?.start && (
                                    new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(subtask.start))
                                )}
                            </p>
                            <p className="inline-flex items-center px-2 py-2 text-xs text-default">
                                {'—'}
                            </p>
                            <p className="inline-flex items-center py-2 text-xs text-default">
                                {subtask?.end && (
                                    new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(subtask.end))
                                )}
                            </p>
                        </div>
                        <span className="tooltip">{`${subtask.spaceName!} » ${subtask.projectName!} » ${subtask.taskName!} » ${subtask.name}`}</span>
                    </div>
                </Grid>
            </div>
        </React.Fragment>
    );
};

export default Component;