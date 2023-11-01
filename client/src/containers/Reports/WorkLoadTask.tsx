import { BackspaceIcon } from '@heroicons/react/20/solid';
import moment from 'moment';
import React from 'react';
import { momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { DataTableTask } from '../../components/DataTable';
import { Grid } from '../../components/Grid';
import { getToken } from '../../redux/Authentication/selectors';
import Http from '../../services/Http';
import { API } from '../../utils/api';
import { Task } from '../../types/Task';
import { SubTask } from '../../types/SubTask';
import { Project } from '../../types/Project';

const Container = () => {

    const { projectId, projectUrl } = useParams();
    const localizer = momentLocalizer(moment);
    const token = useSelector(getToken);

    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [subTasks, setSubTasks] = React.useState<SubTask[]>([]);
    const [project, setProject] = React.useState<Project[]>([]);
    const [taskList, setTaskList] = React.useState<Task[]>([]);
    const [projectById, setProjectById] = React.useState<Project>();


    const fetchTaskLists = async () => {
        try {
            const response: Project = await Http.getById(`${API.PROJECT}/${projectId!}`);
            setProjectById(response);
            setTaskList(response.tasks as Task[]);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    // const data = [
    //     ['Name', 'Task', 'Done'],
    //     ['Task', userProfiles?.task, userProfiles?.task_completed],
    // ];

    // const options = {
    //     title: 'My Tasks',
    //     vAxis: { title: 'Value' },
    //     hAxis: { title: 'Tasks' },
    //     seriesType: 'bars',
    //     colors: ['red', 'green'], // Specify custom colors for the series here
    // };

    const columns = [
        { Header: 'NO', accessor: 'no', },
        { Header: 'TASK_NAME', accessor: 'name' },
        { Header: 'ASSIGNEES', accessor: 'assignees' },
        { Header: 'SUB_TASK', accessor: 'subTasks' },
        { Header: 'START_DATE', accessor: 'start' },
        { Header: 'END_DATE', accessor: 'end' },
        { Header: 'PROGRESS', accessor: 'progress' },
        { Header: 'STAGE_NAME', accessor: 'taskStageName' },
    ];

    const events = tasks.map((task) => ({
        title: task.name,
        start: new Date(task.start!),
        end: new Date(task.end!),
    }));

    React.useEffect(() => {
        if (projectId && projectUrl) {
            void fetchTaskLists();
        }
    }, [projectId]);

    return (
        <React.Fragment>
            <div className="bg-default p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 grid text-sm leading-6">
                <Link to="/report" className="flex items-center ml-10 w-full">
                    <div className="flex">
                        <BackspaceIcon className="icon-x24 mt-1 text-red-600" />
                        <div className="text-2xl text-red-600"> {'Back to Project'} </div>
                    </div>
                </Link>
                {/* <div className="bg-default   p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 grid  sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-2 text-sm leading-6">
                            <div className="flex flex-row flex-nowrap border-b dark:border-default bg-default">
                                <Chart
                                    chartType="PieChart"
                                    data={[
                                        ['Profile', 'Completed'],
                                        ['Projects', userProfiles?.projects],
                                        ['Project_Completed', userProfiles?.project_completed],
                                        ['Task', userProfiles?.task],
                                        ['Task_Completed', userProfiles?.task_completed],
                                        ['SubTasks', userProfiles?.subTasks],
                                        ['SuTask_Completed', userProfiles?.sub_task_completed],
                                    ]}
                                    options={{
                                        title: 'My Project',
                                        is3D: true
                                    }}
                                    width={'100%'}
                                    height={'400px'}
                                />
                            </div>
                            <div className="flex flex-row flex-nowrap border-b dark:border-default bg-default">

                                <Chart
                                    chartType="ComboChart"
                                    width={'100%'}
                                    height={'400px'}
                                    data={data}
                                    options={options}
                                />
                            </div>
                        </div> */}

                <div className="text-2xl p-2 ml-5 text-default">{'All Task In Project Name : '}{projectById?.name}</div>
                <Grid column={12} gap={1}>
                    <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12} className="p-5 m-5 bg-default " >
                        <DataTableTask columns={columns} task={taskList} />
                    </Grid.Column >
                </Grid >
            </div>
        </React.Fragment>
    );
};

export default Container;