import React from 'react';
import { Modal } from '../Modal';
import { Grid } from '../Grid';
import { PopoverColor } from '../Popover';
import FormNewSubTask from './FormNewSubTask';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { updateAssignState, updateState } from '../../services/Task';
import { getAll } from '../../services/User';
import { useSelector } from 'react-redux';
import { getToken } from '../../redux/Authentication/selectors';


interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    item: TodoState;
    setItem: React.Dispatch<React.SetStateAction<TodoState[]>>;
    fetchingData: () => Promise<void>;
}

interface TodoState {
    id: number;
    taskStageId: number;
    taskStageName: string;
    projectId: number;
    milestoneId: number;
    milestoneName: string;
    name: string;
    color: string;
    description: string;
    priority: string;
    progress: number;
    tags: [];
    assignees: User[];
    subTasks: SubTask[];
    start: Date;
    end: Date;
    type: string;
    isDisabled: boolean;
}

interface User {
    id: number | null;
    fullName: string;
    email: string;
}

interface SubTask {
    id: number;
    taskId: number;
    taskName: string;
    projectId: number;
    projectName: string;
    name: string;
    color: string;
    description: string;
    assignee: UserSubTask[];
    type: string;
    progressStatus: string;
    closed: boolean;
    blocked: boolean;
    end: string;
    start: string;
}

interface UserSubTask {
    id: number | null;
    fullName: string;
    email: string;
}

const Component = ({ isOpen, setIsOpen, item, setItem, fetchingData }: Props) => {

    const ref = React.useRef<HTMLDivElement>(null);
    const token = useSelector(getToken);
    const config = {
        headers: {
            'Authorization': `Bearer ${token!}`
        }
    };


    const [openNewSubTask, setOpenNewSubTask] = React.useState<boolean>(false);

    const handleMenuItemClick = (assigneeId: number | null) => {
        console.info('assigneeId = ', assigneeId);
        if (assigneeId !== null) {
            setItem((prevState) => {
                return prevState.map((e) => {
                    try {
                        void updateAssignState(item.id, assigneeId, config);
                        void fetchingData();
                    } catch (error) {
                        throw new Error(error as string);
                    }
                    return {
                        ...e,
                        assignees: [{ id: assigneeId, fullName: '', email: '' }],
                    };

                });
            });

        }
       
    };



    const [user, setUser] = React.useState<User[]>([]);

    const fetchUser = async () => {
        try {
            const response: User[] = await getAll(config);
            setUser(response);

        } catch (error) {
            throw new Error(error as string);
        }
    };

    React.useEffect(() => {
        void fetchUser();
    }, []);

    return (
        <React.Fragment>
            <Modal
                title={item.name}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                className="max-w-xl"
            >
                {/* <form onSubmit={(event) => void handleFormSubmit(event)}> */}
                <form>
                    <Grid column={12} gap={1}>
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <div className="grid grid-rows-1 grid-flow-col gap-12">
                                <PopoverColor item={item} />
                                <div className="flex grid-cols-1  justify-items-start  whitespace-nowrap overflow-hidden">

                                    {item.assignees ? (
                                        item.assignees.map((assignee: User, index: number) => (
                                            <React.Fragment key={index}>
                                                <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center bg-blue-100 m-1">
                                                    {assignee.fullName}
                                                </div>
                                            </React.Fragment>
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
                                                    {user.map((assignee: User, index: number) => (
                                                        <Menu.Item key={index}>
                                                            <React.Fragment>
                                                                <div className="bg-default w-64 p-4 rounded-lg shadow-md" onClick={() => handleMenuItemClick(assignee.id)}>
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
                        </Grid.Column>
                    </Grid>
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
                    <Grid column={12} gap={1} className="mt-5 text-center">
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            {/* <button type="submit" className="button w-full bg-pink-400 hover:bg-pink-500 focus:bg-pink-500 text-white">{'Create'}</button> */}

                        </Grid.Column>
                    </Grid>
                </form>
            </Modal>
            <FormNewSubTask isOpen={openNewSubTask} setIsOpen={setOpenNewSubTask} />
        </React.Fragment>
    );

};

export default Component;