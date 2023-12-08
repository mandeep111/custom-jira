import { InformationCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Chart } from 'react-google-charts';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getTheme } from '../../redux/Theme/selectors';
import { Alert } from '../Alert';
import { Grid } from '../Grid';

interface Props {
    taskList: Task[];
}

const Component = ({ taskList }: Props) => {

    const { projectId, projectUrl } = useParams();
    const theme = useSelector(getTheme);
    const convertToString = taskList.map(task => {
        return {
            ...task,
            id: task.id!.toString(),
            start: new Date(task.start!),
            end: new Date(task.end!),
            styles: { progressColor: task.color, progressSelectedColor: '#000000', arrowColor: '#FF00ff' },
        };
    });

    const columns = [
        { type: 'string', label: 'Task ID' },
        { type: 'string', label: 'Task Name' },
        { type: 'date', label: 'Start Date' },
        { type: 'date', label: 'End Date' },
        { type: 'number', label: 'Duration' },
        { type: 'number', label: 'Percent Complete' },
        { type: 'string', label: 'Dependencies' },
    ];

    const rows = taskList.map(task => [
        task.id?.toString(),
        task.name,
        new Date(task.start!),
        new Date(task.end!),
        null,
        task.progress,
        null
    ]);



    const data = [columns, ...rows];
    const options = {
        gantt: {
            trackHeight: 50,
            innerGridTrack: { fill: theme === 'dark' ? 'black' : 'white' },
        },
    };

    return (
        <React.Fragment>
            <Grid column={12} gap={1} className={`${taskList.length !== 0 ? 'bg-default' : 'bg-default-faded'}`} style={{ height: 'calc(100vh - 99px)' }}>
                <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                    {projectId && projectUrl ? (
                        taskList.length !== 0 ? (
                            // <Gantt tasks={convertToString as GanttTask[]} />
                            <Chart
                                chartType="Gantt"
                                width="100%"
                                height="100%"
                                data={data}
                                options={options}
                                className="bg-red-500"
                            />
                        ) : (
                            <Alert icon={<InformationCircleIcon className="mr-2 icon-x20" />} message={'There are no tasks assigned to me.'} />
                        )) : (
                        <Alert icon={<InformationCircleIcon className="mr-2 icon-x20" />} message={'Please select project.'} />
                    )}
                </Grid.Column>
            </Grid>
        </React.Fragment>
    );

};

export default Component;