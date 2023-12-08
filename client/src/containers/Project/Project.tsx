import { Listbox, Tab, Transition } from '@headlessui/react';
import * as HeroIcons from '@heroicons/react/24/outline';
import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Snowfall from 'react-snowfall';
import { toast } from 'react-toastify';
import { FormNewTask, FormPlatformShare } from '../../components/Form';
import { PopoverFilter } from '../../components/Popover';
import { TabBoard, TabGanttChart, TabList } from '../../components/Tab';
import { setOpenFormNewTask, setOpenFormPlatformShare } from '../../redux/Dialog/actions';
import { setIsCheckMe, setIsCheckShow, setSortDir } from '../../redux/Project/actions';
import { getIsCheckMe, getIsCheckShow, getSortDir } from '../../redux/Project/selectors';
import { setSpaceId, setToggle } from '../../redux/Sidebar/actions';
import { getProjectName, getToggle } from '../../redux/Sidebar/selectors';
import { setSearch } from '../../redux/Task/actions';
import { getSearch } from '../../redux/Task/selectors';

const Container = () => {

    const [snow, setSnow] = React.useState(false);

    // Todo: Group By and Assignee

    const { spaceId, spaceUrl, projectId, projectUrl } = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const search = useSelector(getSearch);
    const isCheckMe = useSelector(getIsCheckMe);
    const isCheckShow = useSelector(getIsCheckShow);
    const projectName = useSelector(getProjectName);
    const sortDir = useSelector(getSortDir);
    const toggle = useSelector(getToggle);
    const handleSidebarToggle = () => {
        dispatch(setToggle(!toggle));
    };

    const isCheckMeState = localStorage.getItem('checked_me');
    const isCheckShowState = localStorage.getItem('checked_show');
    const isFilterState = localStorage.getItem('filter_task');

    const viewList = [
        {
            id: 1, name: 'List', value: 'list', icon: () => <HeroIcons.ListBulletIcon className="icon-x16" />, tab: () =>
                <TabList
                    taskStageList={taskStagesList}
                    taskList={taskList}
                    setTaskList={setTaskList}
                    fetchTaskList={fetchTaskList}
                />
        },
        {
            id: 2, name: 'Board', value: 'board', icon: () => <HeroIcons.ClipboardDocumentListIcon className="icon-x16" />, tab: () =>
                <TabBoard
                    taskStageList={taskStagesList}
                    taskList={taskList}
                    setTaskList={setTaskList}
                    fetchTaskList={fetchTaskList}
                />
        },
        {
            id: 3, name: 'Chart', value: 'chart', icon: () => <HeroIcons.ChartBarIcon className="icon-x16" />, tab: () =>
                <TabGanttChart taskList={taskList} />
        }
    ];

    const [selectedView, setSelectedView] = React.useState<string[]>(() => {
        const storedView = localStorage.getItem('view_list');
        return storedView ? JSON.parse(storedView) as string[] : ['list', 'board'];
    });
    const [filterView, setFilterView] = React.useState<string[]>([]);
    const filteredTabs = filterView.map(value => viewList.find(tab => tab.value === value));
    const [taskStagesList, setTaskStagesList] = React.useState<TaskStage[]>([]);
    const [taskList, setTaskList] = React.useState<Task[]>([]);

    const [space, setSpace] = React.useState<Space>();

    const fetchSpace = async () => {
        try {
            const response: AxiosResponse<Space> = await axios.get(`${SERVER.API.SPACE}/${spaceId!}`);
            setSpace(response.data);
        } catch (error) {
            navigate('/no-space');
            throw new Error(error as string);
        }
    };

    const fetchTaskStage = async () => {
        try {
            const response: AxiosResponse<TaskStage[]> = await axios.get(`${SERVER.API.TASKSTAGE}/find-by-project/${projectId!}`);
            setTaskStagesList(response.data);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const fetchTaskList = async () => {
        try {
            const response: AxiosResponse<Task[]> = await axios.get(`${SERVER.API.TASK}/find-by-project/${projectId!}`);
            setTaskList(response.data);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const fetchMeList = async () => {
        try {
            const response: AxiosResponse<Task[]> = await axios.get(`${SERVER.API.USERPROFILE}/my-tasks`);
            const taskByProject = response.data.filter((task) => task.projectId?.toString() === projectId);
            setTaskList(taskByProject);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleCheckedMe = () => {
        if (isFilterState === 'true') {
            toast.warning('Can\'t use this feature with filter.');
        } else {
            const newValue = !isCheckMe;
            dispatch(setIsCheckMe(newValue));
            localStorage.setItem('checked_me', newValue.toString());
        }
    };

    const handleCheckedShow = () => {
        const newValue = !isCheckShow;
        dispatch(setIsCheckShow(newValue));
        localStorage.setItem('checked_show', newValue.toString());
    };

    const handleToggleSortDir = () => {
        dispatch(setSortDir(sortDir === 'asc' ? 'desc' : 'asc'));
    };

    React.useEffect(() => {
        if (spaceId) {
            void fetchSpace();
            if (projectId) {
                void fetchTaskStage();
                if (isCheckMeState === 'true') {
                    void fetchMeList();
                }
            } else {
                setTaskStagesList([]);
                setTaskList([]);
            }
            isCheckMeState !== null && dispatch(setIsCheckMe(isCheckMeState === 'true'));
            isCheckShowState !== null && dispatch(setIsCheckShow(isCheckShowState === 'true'));
        }
    }, [spaceId, projectId, isCheckMe]);

    React.useEffect(() => {
        localStorage.setItem('view_list', JSON.stringify(selectedView));
    }, [selectedView]);

    React.useEffect(() => {
        const storedView = localStorage.getItem('view_list');
        if (storedView) {
            setFilterView(JSON.parse(storedView) as string[]);
        }
    }, [selectedView]);

    return (
        <React.Fragment>
            <main>
                <Tab.Group>
                    <Tab.List
                        className="flex flex-row border-b flex-nowrap dark:border-default bg-default">
                        <button
                            type="button"
                            className={`text-default px-3 ${toggle ? '' : 'hidden'}`}
                            onClick={handleSidebarToggle}
                        >
                            <HeroIcons.ChevronDoubleRightIcon className="mr-0 icon-x20" />
                        </button>
                        <div className="flex px-3 pt-4 pb-3 text-xs border-b-2 cursor-default select-none flex-nowrap border-b-transparent text-default">
                            {space ? (
                                <React.Fragment>
                                    <span
                                        className="w-7 h-7 px-2.5 py-1.5 text-xs rounded uppercase text-white mr-2"
                                        style={{ backgroundColor: space.color }}
                                    >
                                        {space.name.charAt(0)}
                                    </span>
                                    <div className={`${projectName ? 'inline-block truncate w-20' : 'flex items-center'}`} >
                                        <span className="w-20 font-bold uppercase truncate text-default" title={space.name}>
                                            {space.name}
                                        </span>
                                        {projectName && (
                                            <span className="flex w-20 text-xs font-thin truncate text-default">
                                                {`${projectName}`}
                                            </span>
                                        )}
                                    </div>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <span
                                        className="w-7 h-7 px-2.5 py-1.5 text-xs rounded text-white mr-2 bg-pink-500"
                                    >
                                        {String('Everything').charAt(0)}
                                    </span>
                                    <span className="flex items-center font-bold text-default">
                                        {'Everything'}
                                    </span>
                                </React.Fragment>
                            )}
                        </div>
                        {Array.isArray(filteredTabs) && filteredTabs.map((tab, index) => (
                            <Tab
                                key={index}
                                className={({ selected }) => `flex items-center focus:outline-none flex-nowrap px-3 border-b-2 border-b-transparent pb-3.5 pt-4 text-xs text-default uppercase hover:border-b-inherit ${selected ? '!text-pink-400 border-b-pink-500' : ''}`}
                            >
                                {tab?.icon && tab.icon()}{tab?.name}
                            </Tab>
                        ))}
                        <div className="z-10 flex items-center flex-nowrap text-default">
                            <Listbox value={selectedView} onChange={setSelectedView} multiple>
                                <div className="relative w-48">
                                    <Listbox.Button className="flex items-center text-sm rounded-lg bg-default hover:bg-default-faded text-default">
                                        <HeroIcons.PlusIcon className="icon-x16" />
                                        {'View'}
                                    </Listbox.Button>
                                    <Transition
                                        as={React.Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute w-full py-1 mt-3 overflow-auto text-xs border rounded-md max-h-60 bg-default border-default">
                                            {viewList.map((view, index) => (
                                                <Listbox.Option
                                                    key={index}
                                                    className={({ active }) =>
                                                        `relative select-none py-2 pl-10 pr-4 text-default cursor-pointer ${active ? 'bg-default-faded' : ''}`
                                                    }
                                                    value={view.value}
                                                >
                                                    {({ selected }) => (
                                                        <React.Fragment>
                                                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`} >
                                                                {view.name}
                                                            </span>
                                                            {selected ? (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                                    <HeroIcons.CheckIcon className="icon-x16 text-default" />
                                                                </span>
                                                            ) : null}
                                                        </React.Fragment>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </Listbox>
                        </div>
                        <div className="flex items-center flex-nowrap text-default uppercase px-2.5 py-1 ml-auto">
                            {spaceId && spaceUrl && projectId && projectUrl && (
                                <button
                                    type="button"
                                    className="button !text-sm px-3 py-1 mr-2"
                                    onClick={() => {
                                        dispatch(setOpenFormNewTask(true));
                                        dispatch(setSpaceId(Number(spaceId)));
                                    }}
                                >
                                    <HeroIcons.PlusIcon className="icon-x12" />{'New Task'}
                                </button>
                            )}
                            <button type="button" className="button !text-sm px-3 py-1" onClick={() => dispatch(setOpenFormPlatformShare(true))}>
                                <HeroIcons.ShareIcon className="icon-x12" />{'Share'}
                            </button>
                        </div>
                    </Tab.List>
                    <header className="bg-default">
                        <nav className="flex items-center justify-center p-1">
                            <div className="hidden lg:flex lg:gap-x-12">
                                <div className="relative">
                                    <div
                                        className="absolute -inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-default">
                                        <HeroIcons.MagnifyingGlassIcon className="icon-x16" />
                                    </div>
                                    <input
                                        type="text"
                                        className="text-default text-sm bg-default outline-none rounded-lg block w-full pl-10 p-1.5"
                                        placeholder="Search Task..."
                                        value={search}
                                        onChange={(event) => dispatch(setSearch(event.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end flex-auto">
                                <div className="flex items-center flex-nowrap text-default uppercase px-2.5 py-1">
                                    <button
                                        type="button"
                                        className={`flex items-center rounded-lg bg-default hover:bg-default-faded text-default text-sm px-1.5 mr-2 ${sortDir === 'desc' ? 'text-pink-400' : ''}`}
                                        onClick={handleToggleSortDir}
                                    >
                                        {sortDir === 'asc' ? (<HeroIcons.BarsArrowDownIcon className="icon-x16" />) : (<HeroIcons.BarsArrowUpIcon className="icon-x16" />)}
                                        {'Sort'}
                                    </button>
                                    <PopoverFilter setTaskList={setTaskList} fetchTaskList={fetchTaskList} fetchMeList={fetchMeList} />
                                    <button
                                        type="button"
                                        className={`flex items-center rounded-lg bg-default hover:bg-default-faded text-default text-sm px-1.5 mr-2 ${isCheckMeState === 'true' ? 'text-pink-400' : ''}`}
                                        onClick={handleCheckedMe}
                                    >
                                        <HeroIcons.UserIcon className="icon-x16" />
                                        {'Me'}
                                    </button>
                                    <button
                                        type="button"
                                        className={`flex items-center rounded-lg bg-default hover:bg-default-faded text-default text-sm px-1.5 mr-2 ${isCheckShowState === 'true' ? 'text-pink-400' : ''}`}
                                        onClick={handleCheckedShow}
                                    >
                                        <HeroIcons.EyeIcon className="icon-x16" />
                                        {'Show'}
                                    </button>
                                    {/* <button
                                        type="button"
                                        className="flex items-center bg-default hover:bg-default-faded rounded-lg text-sm text-default px-1.5"
                                        onClick={() => setSnow(!snow)}
                                    >
                                        <HeroIcons.EllipsisHorizontalIcon className="mr-0 icon-x1" />
                                    </button> */}
                                </div>
                            </div>
                        </nav>
                    </header>
                    <Tab.Panels>
                        {Array.isArray(filteredTabs) && filteredTabs.map((tab, index) => (
                            <Tab.Panel key={index}>
                                {tab?.tab && tab.tab()}
                            </Tab.Panel>
                        ))}
                    </Tab.Panels>
                </Tab.Group>
            </main>
            {/* Form Create Task */}
            <FormNewTask fetchingData={fetchTaskList} />
            {/* Form Platform Sharing */}
            <FormPlatformShare />
            {snow ? (<Snowfall />) : null}
        </React.Fragment >
    );
};

export default Container;