import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Chart } from 'react-google-charts';
import { useSelector } from 'react-redux';
import { getToken } from '../../redux/Authentication/selectors';
import { API } from '../../utils/api';
import { DataTableProject } from '../../components/DataTable';
import { TableColumnWithCell } from '../../components/DataTable/DataTableProject';
import {
    Calendar,
    momentLocalizer,
} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Grid } from '../../components/Grid';
import { Project } from '../../types/Project';
import { Task } from '../../types/Task';
import { SubTask } from '../../types/SubTask';

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
    const [subTasks, setSubTasks] = React.useState<SubTask[]>([]);
    const [project, setProject] = React.useState<Project[]>([]);

    const getProjectByPage = async () => {

        try {
            const response: AxiosResponse<ContentProject> = await axios.get(`${API.PROJECT}/page?pageSize=30`, config);
            const { content }: ContentProject = response.data;
            // const checkLot: Lot = content.map((templateId: productVariantList) => response.data.content
            setProject(content);

        } catch (error) {
            throw new Error(`An error occurred: ${error as string}`);
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




    // const returnItemsForColumn = (columnId: number | null) => {
    //     if (columnId !== null) {
    //         return tasks
    //             .filter((item) => item.taskStageId === columnId)
    //             .map((item, index) => (
    //                 <MyTask
    //                     key={item.id}
    //                     name={item.name}
    //                     task={item}
    //                     currentColumnName={item.taskStageId}
    //                     setItems={setTasks}
    //                     index={index}
    //                     fetchingData={fetchMyTasks}
    //                 />
    //             ));
    //     }
    // };

    // const returnSubItemsForColumn = () => {
    //     return subTasks
    //         .map((item, index) => (
    //             <MySubTask
    //                 key={item.id}
    //                 subTask={item}
    //                 setItems={setSubTasks}
    //                 index={index}
    //             fetchingData={fetchMySubTasks}
    //             />
    //         ));
    // };


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

    // const events = tasks.map((task) => ({
    //     title: task.name,
    //     start: new Date(task.start),
    //     end: new Date(task.end),
    // }));

    React.useEffect(() => {
        void getProjectByPage();
    }, [token]);

    return (
        <React.Fragment>
            <div className="bg-default p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 grid text-sm leading-6">

                {/* <div className="flex flex-row flex-nowrap border-b dark:border-default bg-default">
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
                {/* <div className="flex flex-row flex-nowrap border-b dark:border-default bg-default">

                                    <Chart
                                        chartType="ComboChart"
                                        width={'100%'}
                                        height={'400px'}
                                        data={data}
                                        options={options}
                                    />
                                </div> */}


                <div className="text-2xl p-2 ml-5 text-default">{'All Project'}</div>
                <Grid column={12} gap={1}>
                    <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12} className="p-5 m-5 bg-default " >
                        <DataTableProject columns={columns} project={project} />
                    </Grid.Column >
                </Grid >
            </div>
        </React.Fragment >
    );
};

export default Container;