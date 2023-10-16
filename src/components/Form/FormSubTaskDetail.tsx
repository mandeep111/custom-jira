import { Menu, Transition } from '@headlessui/react';
import { ClipboardDocumentListIcon, Square2StackIcon, UserCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useSelector } from 'react-redux';
import { getToken } from '../../redux/Authentication/selectors';
import { getUser } from '../../redux/User/selectors';
import { SubTask } from '../../types/Task';
import { Grid } from '../Grid';
import { Modal } from '../Modal';
import { PopoverColor } from '../Popover';
import { getById, updateAssignState } from '../../services/Subtask';

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    subTaskId: number | null;
}

const Component = ({ isOpen, setIsOpen, subTaskId }: Props) => {

    const user: User = useSelector(getUser);
    const token = useSelector(getToken);
    const config = {
        headers: {
            'Authorization': `Bearer ${token!}`
        }
    };

    const [openNewSubTask, setOpenNewSubTask] = React.useState<boolean>(false);

    const [subTask, setSubTask] = React.useState<SubTask>({
        id: 0,
        taskId: 0,
        taskName: '',
        projectId: 0,
        projectName: '',
        name: '',
        color: '',
        description: '',
        assignee: { id: null, fullName: '', email: '' },
        type: '',
        status: '',
        closed: false,
        blocked: false,
        end: '',
        start: '',
    });

    const fetchSubTaskById = async () => {
        try {
            if (subTaskId !== null) {
                const response: SubTask = await getById(subTaskId, config);
                setSubTask(response);
            }
        } catch (error) {
            throw new Error(error as string);
        }
    };

    // const handleMenuItemClick = (assigneeId: number | null) => {
    //     if (assigneeId !== null) {
    //                 try {
    //                     void updateAssignState(item.id,);
    //                     void fetchingData();
    //                 } catch (error) {
    //                     throw new Error(error as string);
    //                 }
    //                 return {
    //                     ...e,
    //                     assignees: [{ id: assigneeId, fullName: '', email: '' }],
    //                 };

    //             });
    //         });

    //     }

    // };

    React.useEffect(() => {
        if (isOpen) {
            void fetchSubTaskById();
        }
    }, [isOpen]);
    return (
        <React.Fragment>
            <Modal
                title={subTask.name}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                className="max-w-2xl"
            >

                <form>
                    <Grid column={12} gap={1}>
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <div className="grid grid-rows-1 grid-flow-col gap-12">
                                <div className="flex grid-cols-1  justify-items-start  whitespace-nowrap overflow-hidden">
                                    <React.Fragment>
                                        <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center bg-blue-100 m-1">
                                            {subTask?.assignee.fullName}
                                        </div>
                                    </React.Fragment>
                                </div>
                                <div className="grid grid-cols-1  justify-items-end">
                                    <Menu as="div" key={subTask?.id} className="relative">
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
                                            {/* <Menu.Items className={'mt-4 w-48 text-sm text-default bg-default border border-zinc-200 dark:border-zinc-200'}>
                                                <div className="absolute z-50  justify-items-end">
                                                    <div className="absolute z-50  justify-items-end">
                                                        {Array.isArray(user) && user.map((assignee: User, index: number) => (
                                                            <Menu.Item key={index}>
                                                                <React.Fragment>
                                                                    <div className="bg-default w-64 p-4 rounded-lg shadow-md" onClick={() => handleMenuItemClick(assignee.id)}>
                                                                        {assignee.fullName}
                                                                    </div>

                                                                </React.Fragment>
                                                            </Menu.Item>
                                                        ))}
                                                    </div>
                                                </div>
                                            </Menu.Items> */}
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                            {subTask.start || subTask.end ? (
                                <div className="inline-flex">
                                    <p className="mb-2 text-sm text-default mr-3">
                                        {'Start : '}
                                        {new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(subTask.start))}
                                    </p>
                                    <p className="mb-2 text-sm text-default">
                                        {'End : '}
                                        {new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(subTask.end))}
                                    </p>
                                </div>
                            ) : null}
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
                                value={subTask?.name || ''}
                                className="flex w-full bg-transparent text-xl outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                autoComplete="off"

                            />
                        </Grid.Column>
                    </Grid>

                    <Grid column={12} gap={1} className="mt-5 text-center">
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <textarea
                                id="description"
                                value={subTask?.description || ''}
                                className="flex w-full bg-transparent outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                placeholder="Write something about this task..."
                                rows={5}
                            />
                        </Grid.Column>
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5 text-start">
                        <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2}>
                            {'Progress :'}
                        </Grid.Column>
                        <Grid.Column sm={10} md={10} lg={10} xl={10} xxl={10}>
                            {subTask?.status}
                        </Grid.Column>
                    </Grid>
                </form >
            </Modal >
        </React.Fragment >
    );

};

export default Component;