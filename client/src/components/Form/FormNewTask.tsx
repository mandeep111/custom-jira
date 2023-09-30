import React from 'react';
import useInputChange, { InputChangeHandler } from '../../hooks/useInputChange';
import { Modal } from '../Modal';
import { Grid } from '../Grid';
import { Color } from '../Color';
import { useParams } from 'react-router-dom';
import { save } from '../../services/Task';
import { useSelector } from 'react-redux';
import { getToken } from '../../redux/Authentication/selectors';

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    fetchingData: () => Promise<void>;
}

const Component = ({ isOpen, setIsOpen, fetchingData }: Props) => {

    const inputChange: InputChangeHandler = useInputChange();
    const token = useSelector(getToken);
    const config = {
        headers: {
            'Authorization': `Bearer ${token!}`
        }
    };
    const { projectId } = useParams();

    const [task, setTask] = React.useState({
        id: null,
        taskStageId: 1,
        projectId: parseInt(projectId!),
        name: '',
        color: '#FCA5A5',
        type: 'task',
        progress: 0,
        assignee: [],
        tags: [],
        start: new Date(),
        end: ''
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
            await fetchingData();
            setTask({
                id: null,
                taskStageId: 1,
                projectId: parseInt(projectId!),
                name: '',
                color: '#FCA5A5',
                type: 'task',
                progress: 0,
                assignee: [],
                tags: [],
                start: new Date(),
                end: ''
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

    return (
        <React.Fragment>
            <Modal
                title={'Create new Task'}
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
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5 text-center">
                        <Grid.Column sm={6} md={6} lg={6} xl={6} xxl={6}>
                            <input
                                id="start"
                                type="date"
                                value={task.start ? new Date(task.start).toISOString().substr(0, 10) : ''}
                                className="flex w-full bg-transparent outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                onChange={(event) => inputChange(event, setTask)}
                            />
                        </Grid.Column>
                        <Grid.Column sm={6} md={6} lg={6} xl={6} xxl={6}>
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