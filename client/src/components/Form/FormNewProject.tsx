import React from 'react';
import useCheckboxChecked, { CheckboxCheckedHandler } from '../../hooks/useCheckboxChecked';
import { Modal } from '../Modal';
import { Grid } from '../Grid';
import { useSelector } from 'react-redux';
import { getToken } from '../../redux/Authentication/selectors';
import { save } from '../../services/Project';
import { Color } from '../Color';

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    spaceId: number | null;
    fetchingData: () => Promise<void>;
}

interface Project {
    id: number | null;
    spaceId: number | null;
    stageId: number | null;
    name: string;
    color: string;
    url: string;
    taskStages: TaskStage[];
    isPrivate: boolean;
    isActive: boolean;
}

interface TaskStage {
    id: number | null;
    name?: string;
}

const Component = ({ isOpen, setIsOpen, spaceId, fetchingData }: Props) => {

    const checkboxChange: CheckboxCheckedHandler = useCheckboxChecked();

    const token = useSelector(getToken);
    const config = {
        headers: {
            'Authorization': `Bearer ${token!}`
        }
    };

    const [project, setProject] = React.useState<Project>({
        id: null,
        spaceId,
        stageId: 1,
        name: '',
        color: '#94a3b8',
        url: '',
        taskStages: [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 }
        ],
        isPrivate: false,
        isActive: true
    });

    const handleColorChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.currentTarget;
        setProject((prevState) => ({
            ...prevState,
            color: target.value
        }));
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const { id, value } = target;
        const filteredValue = value.replace(/[^0-9a-z\s]/gi, '');
        setProject((prevState) => ({
            ...prevState,
            [id]: filteredValue
        }));
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await save(project, config);
            setIsOpen(false);
            await fetchingData();
            setProject({
                id: null,
                spaceId,
                stageId: 1,
                name: '',
                color: '#94a3b8',
                url: '',
                taskStages: [
                    { id: 1 },
                    { id: 2 },
                    { id: 3 },
                    { id: 4 }
                ],
                isPrivate: false,
                isActive: true
            });
        } catch (error) {
            throw new Error(error as string);
        }
    };

    React.useEffect(() => {
        if (spaceId) {
            setProject((prevState) => ({
                ...prevState,
                spaceId: spaceId
            }));
        }
    }, [spaceId]);

    React.useEffect(() => {
        setProject((prevState) => ({
            ...prevState,
            url: project.name.toLowerCase().replace(/\s+/g, '-')
        }));
    }, [project.name]);

    return (
        <React.Fragment>
            <Modal
                title={'Create new Project'}
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
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <label htmlFor="name" className="label">{'Project name'}</label>
                            <input
                                id="name"
                                type="text"
                                maxLength={32}
                                title="Only alphanumeric characters are allowed."
                                value={project.name || ''}
                                className="flex w-full bg-transparent text-xl outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                autoComplete="off"
                                onChange={handleNameChange}
                            />
                        </Grid.Column>
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5">
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <div className="checkbox-group">
                                <input
                                    id="isPrivate"
                                    type="checkbox"
                                    checked={project.isPrivate}
                                    onChange={(event) => checkboxChange(event, setProject)}
                                />
                                <label htmlFor="isPrivate" className="label cursor-pointer inline-flex ml-1">{'Private'}</label>
                            </div>
                        </Grid.Column>
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5">
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <label htmlFor="name" className="label">{'Link :'} {'/' + (project.url || 'your-url')}</label>
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