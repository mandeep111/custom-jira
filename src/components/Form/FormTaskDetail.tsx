import { Menu, Transition } from '@headlessui/react';
import { ClipboardDocumentListIcon, Square2StackIcon, UserCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useSelector } from 'react-redux';
import { getToken } from '../../redux/Authentication/selectors';
import { getUser } from '../../redux/User/selectors';
import { deleteTask, duplicate, removeAssignState } from '../../services/Task';
import { updateAssignState } from '../../services/Task';
import { updateStatusState } from '../../services/Subtask';
import { SubTask, Task } from '../../types/Task';
import { Grid } from '../Grid';
import { Modal } from '../Modal';
import { PopoverColor } from '../Popover';
import { FormNewSubTask, FormSubTaskDetail } from './index';

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    item: Task;
    setItem: React.Dispatch<React.SetStateAction<Task[]>>;
    fetchingData: () => Promise<void>;
}

interface StatusSubtask {
    id: number;
    status: string;
}
const Component = ({ isOpen, setIsOpen, item, setItem, fetchingData }: Props) => {

    const user: User = useSelector(getUser);
    const token = useSelector(getToken);
    const config = {
        headers: {
            'Authorization': `Bearer ${token!}`
        }
    };

    const [openNewSubTask, setOpenNewSubTask] = React.useState<boolean>(false);
    const [openSubTaskDetail, setOpenSubTaskDetail] = React.useState<boolean>(false);

    const [subTaskId, setSubTaskId] = React.useState<number | null>(null);

    const handleMenuItemClick = async (assigneeId: number | null) => {
        if (assigneeId !== null) {
            try {
                const response: Task = await updateAssignState(item.id, assigneeId, config);
                setItem([response]);
                await fetchingData();
            } catch (error) {
                throw new Error(error as string);
            }
        }

    };

    const handleDuplicateTask = async (taskId: number) => {
        try {
            const response: Task = await duplicate(taskId, config);
            setItem([response]);
            await fetchingData();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleDeleteTask = async () => {
        try {
            await deleteTask(item.id, config);
            await fetchingData();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>, subTaskId: number) => {
        try {
            const isChecked = event.target.checked;
            const newStatus = isChecked ? 'COMPLETED' : 'WAITING';
            const data = {
                id: subTaskId,
                status: newStatus
            };
            await updateStatusState(data, config);
            void fetchingData();
        } catch (error) {
            throw new Error(error as string);
        }
    };


    const handleDeleteAssignee = async (assigneeId: number | null) => {
        if (assigneeId !== null) {
            try {
                await removeAssignState(item.id, assigneeId, config);
                await fetchingData();
            } catch (error) {
                throw new Error(error as string);
            }
        }
    };

    return (
        <React.Fragment>
            <Modal
                title={item.name}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                className="max-w-2xl"
            >
                {/* <form onSubmit={(event) => void handleFormSubmit(event)}> */}
                <form>
                    <Grid column={12} gap={1}>
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <div className="grid grid-rows-1 grid-flow-col gap-12">
                                <div className="flex grid-cols-1  justify-items-start  whitespace-nowrap overflow-hidden">
                                    {item.assignees ? (
                                        item.assignees.map((assignee: User, index: number) => (
                                            <div
                                                key={index}
                                                className="relative inline-flex items-center m-1 group"
                                            >
                                                <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center bg-blue-100 m-1">
                                                    {assignee.fullName}
                                                </div>
                                                <button type="button"
                                                    className="rounded-full ml-2 w-4 h-4 text-red-600 bg-red-100 focus:outline-none transition duration-300 ease-in-out invisible group-hover:visible absolute top-0 right-0 -mt-1 mb-1"
                                                    onClick={() => void handleDeleteAssignee(assignee.id)}
                                                >
                                                    <label className="text-sm">{'X'}</label>
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        null
                                    )}
                                </div>
                                <div className="grid grid-cols-1  justify-items-end">
                                    <Menu as="div" key={item.id} className="relative">
                                        <Menu.Button className="grid w-full  justify-items-end ">
                                            <UserCircleIcon
                                                className="icon-x36"
                                            />
                                        </Menu.Button>
                                        <Transition
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className={'mt-4 w-48 text-sm text-default bg-default border border-zinc-200 dark:border-zinc-200'}>
                                                <div className="absolute z-50  justify-items-end">
                                                    {Array.isArray(user) && user.map((assignee: User, index: number) => (
                                                        <Menu.Item key={index}>
                                                            <React.Fragment>
                                                                <div className="bg-default w-64 p-4 rounded-lg shadow-md" onClick={() => void handleMenuItemClick(assignee.id)}>
                                                                    {assignee.fullName}
                                                                </div>

                                                            </React.Fragment>
                                                        </Menu.Item>
                                                    ))}
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                            <div className="inline-flex">
                                <p className="mb-2 text-sm text-default mr-3">
                                    {'Start : '}
                                    {new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(item.start))}
                                </p>
                                <p className="mb-2 text-sm text-default">
                                    {'End : '}
                                    {new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(item.end))}
                                </p>
                            </div>
                        </Grid.Column >
                    </Grid >
                    <Grid column={12} gap={1} className="mt-5">
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <label htmlFor="name" className="label">{'Project name'}</label>
                            <input
                                id="name"
                                type="text"
                                maxLength={32}
                                title="Only alphanumeric characters are allowed."
                                value={item.name || ''}
                                className="flex w-full bg-transparent text-xl outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                autoComplete="off"
                            // onChange={handleNameChange}
                            />
                        </Grid.Column>
                    </Grid>

                    <Grid column={12} gap={1} className="mt-5 text-center">
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <textarea
                                id="description"
                                value={item.description || ''}
                                className="flex w-full bg-transparent outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                placeholder="Write something about this task..."
                                rows={5}
                            // onChange={(event) => textAreaChange(event, setTask)}
                            />
                        </Grid.Column>
                    </Grid>
                    <Grid column={12} gap={1}>
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <PopoverColor item={item} />
                        </Grid.Column>
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5 text-center">
                        <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2}>
                            {'Progress :'}
                        </Grid.Column>
                        <Grid.Column sm={10} md={10} lg={10} xl={10} xxl={10}>
                            {item ? (
                                <div className="flex items-center">
                                    <div className="w-full bg-default-faded rounded-full h-2.5 mr-5">
                                        <div
                                            className={`h-2.5 rounded-full ${item.progress <= 19
                                                ? 'bg-zinc-300'
                                                : item.progress >= 20 && item.progress <= 39
                                                    ? 'bg-purple-300'
                                                    : item.progress >= 40 && item.progress <= 59
                                                        ? 'bg-indigo-300'
                                                        : item.progress >= 60 && item.progress <= 79
                                                            ? 'bg-sky-300'
                                                            : item.progress >= 80 && item.progress <= 99
                                                                ? 'bg-teal-300' : item.progress >= 100
                                                                    ? 'bg-green-300' : ''}`
                                            } style={{ width: `${item.progress}%` }}>
                                        </div>
                                    </div>
                                    <p className="text-sm text-default">{`${item.progress}%`}</p>
                                </div>
                            ) : null}
                        </Grid.Column>
                    </Grid>

                    <Grid column={12} gap={1}>
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <label htmlFor="name" className="label text-2xl mt-3">{'TO DO'}</label>
                        </Grid.Column>
                    </Grid>

                    <Grid column={12} gap={1}>
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <label htmlFor="name" className="label text-lg">{'SubTask'}</label>

                            <div className="grid-cols-1  justify-items-start  whitespace-nowrap overflow-hidden">
                                {item.subTasks ? (
                                    item.subTasks.map((subTask: SubTask, index: number) => (
                                        <React.Fragment key={index}>
                                            <Grid column={12} gap={1}>
                                                <Grid.Column sm={10} md={10} lg={10} xl={10} xxl={10} className="flex  justify-items-start mb-3">
                                                    <input
                                                        id="status"
                                                        type="checkbox"
                                                        maxLength={32}
                                                        defaultChecked={subTask.status === 'COMPLETED' ? true : false}
                                                        className="w-5 bg-transparent text-xl outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus.border-blue-300 me-3"
                                                        autoComplete="off"
                                                        onChange={(event) => void handleCheckboxChange(event, subTask.id)}
                                                    />
                                                    <button type="button" className="text-lg text-default  hover:text-blue-500 " onClick={() => { setIsOpen(false); setOpenSubTaskDetail(true); setSubTaskId(subTask.id); }}> {subTask.name}</button>

                                                </Grid.Column>
                                                <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2} className="flex  justify-items-start mb-3 pt-1">
                                                    <div className="w-6 h-6 rounded-full border border-black flex items-center justify-center bg-blue-100 m-1">
                                                        {subTask.assignee.fullName}
                                                    </div>
                                                </Grid.Column>
                                            </Grid>
                                        </React.Fragment>
                                    ))
                                ) : (
                                    null
                                )}
                            </div>
                        </Grid.Column>
                    </Grid>


                    <Grid column={12} gap={1} className="mt-5">
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <button
                                type="button"
                                className="inline-flex items-center hover:text-pink-500 text-sm"
                                onClick={() => { setIsOpen(false); setOpenNewSubTask(true); }}
                            >
                                <ClipboardDocumentListIcon className="icon-x16" />{'Add Subtask'}
                            </button>
                        </Grid.Column>
                    </Grid>

                    <Grid column={12} gap={1} className="mt-5">
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <button
                                type="button"
                                className="inline-flex items-center hover:text-pink-500 text-sm"
                                onClick={() => void handleDuplicateTask(item.id)}
                            >
                                <Square2StackIcon className="icon-x16" />{'Duplicate Task'}
                            </button>
                        </Grid.Column>
                    </Grid>

                    <Grid column={12} gap={1} className="mt-5">
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <button
                                type="button"
                                className="inline-flex items-center hover:text-pink-500 text-sm"
                                onClick={() => void handleDeleteTask()}
                            >
                                <div className="flex text-red-400">
                                    <TrashIcon className="icon-x16" />{'Delete'}
                                </div>
                            </button>
                        </Grid.Column>
                    </Grid>

                </form >
            </Modal >
            <FormNewSubTask isOpen={openNewSubTask} setIsOpen={setOpenNewSubTask} taskId={item.id} fetchingData={fetchingData} />

            <FormSubTaskDetail isOpen={openSubTaskDetail} setIsOpen={setOpenSubTaskDetail} subTaskId={subTaskId} />
        </React.Fragment >
    );

};

export default Component;