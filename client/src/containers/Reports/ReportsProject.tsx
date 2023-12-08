import axios, { AxiosResponse } from 'axios';
import moment from 'moment';
import React from 'react';
import { momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSelector } from 'react-redux';
import { DataTableProject } from '../../components/DataTable';
import { Grid } from '../../components/Grid';
import { getToken } from '../../redux/Authentication/selectors';

interface ContentProject {
    pageNo: number | 0,
    pageSize: number | 0,
    totalElements: number | 0,
    totalPages?: number,
    last: true,
    content: Project[],
}

interface UserProfile {
    project_completed: number | null;
    task: number | null;
    projects: number | null;
    subTasks: number | null;
    sub_task_completed: number | null;
    task_completed: number | null;
}

const Container = () => {

    const localizer = momentLocalizer(moment);
    const token = useSelector(getToken);
    const config = {
        headers: {
            'Authorization': `Bearer ${token!}`
        }
    };

    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [subTasks, setSubTasks] = React.useState<Subtask[]>([]);
    const [project, setProject] = React.useState<Project[]>([]);

    const getProjectByPage = async () => {
        try {
            const response: AxiosResponse<ContentProject> = await axios.get(`${SERVER.API.PROJECT}/page?pageSize=30`, config);
            const { content }: ContentProject = response.data;
            setProject(content);

        } catch (error) {
            throw new Error(`An error occurred: ${error as string}`);
        }
    };

    const columns = [
        {
            Header: 'ID',
            accessor: 'id',
            width: 10,
        },
        { Header: 'PROJECT_NAME', accessor: 'name', width: 32, },
        { Header: 'SPACE_NAME', accessor: 'spaceName', width: 32, },
        { Header: 'TASK', accessor: 'task', width: 32, },
        { Header: 'USER_CREATE', accessor: 'userCreate', width: 32, },
        { Header: 'PROGRESS', accessor: 'progress', width: 32, },
    ];

    React.useEffect(() => {
        void getProjectByPage();
    }, [token]);

    return (
        <React.Fragment>
            <div className="grid p-4 text-sm leading-6 bg-default sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8">
                {/* <div className="flex flex-row border-b flex-nowrap dark:border-default bg-default">
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
                                            title: 'My Space',
                                            is3D: true
                                        }}
                                        width={'100%'}
                                        height={'400px'}
                                    />
                                </div> */}
                {/* <div className="flex flex-row border-b flex-nowrap dark:border-default bg-default">

                                    <Chart
                                        chartType="ComboChart"
                                        width={'100%'}
                                        height={'400px'}
                                        data={data}
                                        options={options}
                                    />
                                </div> */}
                <div className="p-2 ml-5 text-2xl text-default">{'All Project'}</div>
                <Grid column={12} gap={1}>
                    <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12} className="p-5 m-5 overflow-x-auto bg-default" >
                        <DataTableProject columns={columns} project={project} />
                    </Grid.Column>
                </Grid>
            </div>
        </React.Fragment>
    );
};

export default Container;