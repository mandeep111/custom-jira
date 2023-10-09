import React from 'react';
import useInputChange, { InputChangeHandler } from '../../hooks/useInputChange';
import useTextAreaChange, { TextAreaChangeHandler } from '../../hooks/useTextAreaChange';
import { Modal } from '../Modal';
import { Grid } from '../Grid';
import { Color } from '../Color';
import { useParams } from 'react-router-dom';
import { save } from '../../services/Task';
import { useSelector } from 'react-redux';
import { getToken } from '../../redux/Authentication/selectors';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { Listbox } from '@headlessui/react';

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    // fetchingData: () => Promise<void>;
}

interface Task {
    id: number | null;
    taskStageId: number | null;
    projectId: number | null;
    name: string;
    description: string;
    color: string;
    type: string;
    progress: number | null;
    assignee: [];
    tags: [];
    start?: Date;
    end?: Date;
}

const Component = ({ isOpen, setIsOpen }: Props) => {

    const inputChange: InputChangeHandler = useInputChange();
    const textAreaChange: TextAreaChangeHandler = useTextAreaChange();
    const token = useSelector(getToken);
    const config = {
        headers: {
            'Authorization': `Bearer ${token!}`
        }
    };
    const { projectId } = useParams();

    const [task, setTask] = React.useState<Task>({
        id: null,
        taskStageId: 1,
        projectId: parseInt(projectId!),
        name: '',
        description: '',
        color: '#FCA5A5',
        type: 'task',
        progress: 0,
        assignee: [],
        tags: [],
        start: new Date(),
        end: undefined
    });

    const handleColorChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.currentTarget;
        setTask((prevState) => ({
            ...prevState,
            color: target.value
        }));
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await save(task, config);
            setIsOpen(false);
            // await fetchingData();
            setTask({
                id: null,
                taskStageId: 1,
                projectId: parseInt(projectId!),
                name: '',
                description: '',
                color: '#FCA5A5',
                type: 'task',
                progress: 0,
                assignee: [],
                tags: [],
                start: new Date(),
                end: undefined
            });
        } catch (error) {
            throw new Error(error as string);
        }
    };

    React.useEffect(() => {
        setTask((prevState) => ({
            ...prevState,
            projectId: parseInt(projectId!)
        }));
    }, [projectId]);

    const people = [
        { id: 1, name: 'Durward Reynolds' },
        { id: 2, name: 'Kenton Towne' },
        { id: 3, name: 'Therese Wunsch' },
        { id: 4, name: 'Benedict Kessler' },
        { id: 5, name: 'Katelyn Rohan' },
    ];

    const [selectedPeople, setSelectedPeople] = React.useState([people[0], people[1]]);

    return (
        <React.Fragment>
            <Modal
                title={'Create new Subtask'}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                className="max-w-xl"
            >
                <form onSubmit={(event) => void handleFormSubmit(event)}>
                    <Grid column={12} gap={1}>
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <Color onClick={handleColorChange} />
                        </Grid.Column>
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5">
                        <Grid.Column sm={10} md={10} lg={10} xl={10} xxl={10}>
                            <label htmlFor="name" className="label">{'Task name'}</label>
                            <input
                                id="name"
                                type="text"
                                maxLength={32}
                                title="Only alphanumeric characters are allowed."
                                value={task.name || ''}
                                className="flex w-full bg-transparent text-xl outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                autoComplete="off"
                                onChange={(event) => inputChange(event, setTask)}
                            />
                        </Grid.Column>
                        <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2} className="flex justify-center items-end">
                            <Listbox value={selectedPeople} onChange={setSelectedPeople} multiple>
                                <Listbox.Button>
                                    <UserPlusIcon className="icon-x24" title="Assign" />
                                </Listbox.Button>
                                <Listbox.Options className="absolute mt-1 max-h-60 max-w-sm w-full overflow-auto rounded-md bg-default py-1 text-base shadow-lg ring-1 ring-default ring-opacity-5 focus:outline-none sm:text-sm right-2">
                                    {people.map((person) => (
                                        <Listbox.Option
                                            key={person.id}
                                            value={person}
                                            className={({ active }) => `relative text-default cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-default-faded' : ''}`}
                                        >
                                            {person.name}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Listbox>
                        </Grid.Column>
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5 text-center">
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <textarea
                                id="description"
                                value={task.description || ''}
                                className="flex w-full bg-transparent outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                placeholder="Write something about this task..."
                                rows={5}
                                onChange={(event) => textAreaChange(event, setTask)}
                            />
                        </Grid.Column>
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5 text-center">
                        <Grid.Column sm={1} md={1} lg={1} xl={1} xxl={1}>
                            <label htmlFor="start" className="label mt-2.5">{'Start'}</label>
                        </Grid.Column>
                        <Grid.Column sm={5} md={5} lg={5} xl={5} xxl={5}>
                            <input
                                id="start"
                                type="date"
                                value={task.start ? new Date(task.start).toISOString().substr(0, 10) : ''}
                                className="flex w-full bg-transparent outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                onChange={(event) => inputChange(event, setTask)}
                            />
                        </Grid.Column>
                        <Grid.Column sm={1} md={1} lg={1} xl={1} xxl={1}>
                            <label htmlFor="start" className="label mt-2.5">{'End'}</label>
                        </Grid.Column>
                        <Grid.Column sm={5} md={5} lg={5} xl={5} xxl={5}>
                            <input
                                id="end"
                                type="date"
                                value={task.end ? new Date(task.end).toISOString().substr(0, 10) : ''}
                                className="flex w-full bg-transparent outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                onChange={(event) => inputChange(event, setTask)}
                            />
                        </Grid.Column>
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5 text-center">
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <button type="submit" className="button w-full bg-pink-400 hover:bg-pink-500 focus:bg-pink-500 text-white">{'Create'}</button>
                        </Grid.Column>
                    </Grid>
                </form>
            </Modal>
        </React.Fragment>
    );
};

export default Component;