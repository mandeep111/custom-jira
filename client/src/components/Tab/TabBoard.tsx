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
import { Grid } from '../Grid';
import { TodoItem, TodoState } from '../Todo';

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
                taskList.length !== 0 ? (
                    <DndProvider backend={HTML5Backend}>
                        <Grid column={12} gap={0}>
                            {taskStageList.map((taskStage, index) => (
                                <Grid.Column sm={3} md={3} lg={3} xl={3} xxl={3} key={index}>
                                    <TodoState
                                        title={taskStage.name!}
                                        state={taskStage.id!}
                                        color={taskStage.color!}
                                        className="border-t-4 border-r border-r-default">
                                        {returnItemsForColumn(taskStage.id!)}
                                    </TodoState>
                                </Grid.Column>
                            ))}
                        </Grid>
                    </DndProvider>
                ) : (
                    <Alert icon={<InformationCircleIcon className="mr-2 icon-x20" />} message={'There are no tasks assigned to me.'} />
                )) : (
                <Alert icon={<InformationCircleIcon className="mr-2 icon-x20" />} message={'Please select project.'} />
            )}
            <FormTaskDetail fetchTaskList={fetchTaskList} />
        </React.Fragment>
    );
};

export default Component;