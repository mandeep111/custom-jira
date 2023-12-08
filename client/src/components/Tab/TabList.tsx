import { InformationCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setOpenFormTaskDetail } from '../../redux/Dialog/actions';
import { setTaskId } from '../../redux/Task/actions';
import { Alert } from '../Alert';
import { FormTaskDetail } from '../Form';
import { TodoItem, TodoStateList } from '../Todo';

interface Props {
    taskStageList: TaskStage[];
    taskList: Task[];
    setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
    fetchTaskList: () => Promise<void>;
}

const Component = ({ taskStageList, taskList, setTaskList, fetchTaskList }: Props) => {

    const { projectId, projectUrl } = useParams();

    const dispatch = useDispatch();

    const returnItemsForColumn = (columnId: number) => {
        if (Array.isArray(taskList)) {
            return taskList
                .filter((task) => task.taskStageId === columnId)
                .map((task, index) => (
                    <React.Fragment key={index}>
                        <TodoItem
                            index={index}
                            task={task}
                            setTask={setTaskList}
                            currentStage={task.taskStageId}
                            onClick={() => {
                                dispatch(setTaskId(task.id!));
                                dispatch(setOpenFormTaskDetail(true));
                            }}
                        />
                    </React.Fragment>
                ));
        }
    };

    return (
        <React.Fragment>
            {projectId && projectUrl ? (
                taskList && (taskList.length !== 0 ? (
                    <DndProvider backend={HTML5Backend}>
                        {Array.isArray(taskStageList) && taskStageList.map((taskStage, index) => (
                            <React.Fragment key={index}>
                                <TodoStateList
                                    title={taskStage.name!}
                                    task={returnItemsForColumn(taskStage.id!) ? returnItemsForColumn(taskStage.id!)?.length : null}
                                    state={taskStage.id!}
                                    color={taskStage.color!}
                                    className="pl-4 text-left border-t border-b border-l-8 border-r rounded-lg rounded-l-none text-md border-default"
                                >
                                    {
                                        returnItemsForColumn(taskStage.id!)?.length !== 0
                                            ? (
                                                <div className="overflow-y-scroll sm:max-h-96 2xl:max-h-128">
                                                    {returnItemsForColumn(taskStage.id!)}
                                                </div>
                                            ) : (
                                                <Alert
                                                    icon={<InformationCircleIcon className="icon-x20" />}
                                                    message={'There is no task for this stage.'}
                                                    className="my-0 border text-default bg-default border-default"
                                                />
                                            )
                                    }
                                </TodoStateList>
                            </React.Fragment>
                        ))}
                    </DndProvider>
                ) : (
                    <Alert icon={<InformationCircleIcon className="icon-x20" />} message={'There are no tasks assigned to me.'} />
                ))) : (
                <Alert icon={<InformationCircleIcon className="icon-x20" />} message={'Please select project.'} />
            )}
            <FormTaskDetail fetchTaskList={fetchTaskList} />
        </React.Fragment>
    );
};

export default Component;