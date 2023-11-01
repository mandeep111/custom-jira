import { Gantt, Task as GanttTask } from 'gantt-task-react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '../Grid';
import { Alert } from '../Alert';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Task } from '../../types/Task';
import { Chart } from 'react-google-charts';
import { getTheme } from '../../redux/Theme/selectors';
import { useSelector } from 'react-redux';

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
        { type: 'string', label: 'Resource' },
        { type: 'date', label: 'Start Date' },
        { type: 'date', label: 'End Date' },
        { type: 'number', label: 'Duration' },
        { type: 'number', label: 'Percent Complete' },
        { type: 'string', label: 'Dependencies' },
    ];

    const rows = [
        [
            '2014Spring',
            'Spring 2014',
            'spring',
            new Date(2014, 2, 22),
            new Date(2014, 5, 20),
            null,
            100,
            null,
        ],
        [
            '2014Summer',
            'Summer 2014',
            'summer',
            new Date(2014, 5, 21),
            new Date(2014, 8, 20),
            null,
            100,
            null,
        ],
        [
            '2014Autumn',
            'Autumn 2014',
            'autumn',
            new Date(2014, 8, 21),
            new Date(2014, 11, 20),
            null,
            100,
            null,
        ],
        [
            '2014Winter',
            'Winter 2014',
            'winter',
            new Date(2014, 11, 21),
            new Date(2015, 2, 21),
            null,
            100,
            null,
        ],
    ];

    const data = [columns, ...rows];
    const options = {
        height: 400,
        backgroundColor: '#FF2',
        colors: ['black'],
        gantt: {
            trackHeight: 50,
            innerGridTrack: { fill: theme === 'dark' ? 'black' : 'white', textStyle: { color: 'red' } },
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
                            />
                        ) : (
                            <Alert icon={<InformationCircleIcon className="icon-x20 mr-2" />} message={'There are no tasks assigned to me.'} />
                        )) : (
                        <Alert icon={<InformationCircleIcon className="icon-x20 mr-2" />} message={'Please select project.'} />
                    )}
                </Grid.Column>
            </Grid>
        </React.Fragment>
    );

};

export default Component;