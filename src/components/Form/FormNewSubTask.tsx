import React from 'react';
import { useSelector } from 'react-redux';
import useCheckboxChecked, { CheckboxCheckedHandler } from '../../hooks/useCheckboxChecked';
import useInputChange, { InputChangeHandler } from '../../hooks/useInputChange';
import useTextAreaChange, { TextAreaChangeHandler } from '../../hooks/useTextAreaChange';
import { getToken } from '../../redux/Authentication/selectors';
import { save } from '../../services/Subtask';
import { Color } from '../Color';
import { Grid } from '../Grid';
import { ListboxAssignee, ListboxForm } from '../Listbox';
import { Modal } from '../Modal';

enum Status {
    WAITING = 'WAITING',
    COMPLETED = 'COMPLETED',
    DOING = 'DOING',
    CANCELLED = 'CANCELLED'
}

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    taskId: number | null;
    fetchingData: () => Promise<void>;
}

interface SubTask {
    id: number | null;
    taskId: number | null;
    name: string;
    description: string;
    color: string;
    isBlocked?: boolean,
    isClosed?: boolean,
    assigneeId: number | null;
    assigneeName: string;
    status: Status
    type: string;
    needApproval: boolean;
    requestCode: string;
    formId: number | null;
    start?: Date;
    end?: Date;
}

const Component = ({ isOpen, setIsOpen, taskId, fetchingData }: Props) => {

    const inputChange: InputChangeHandler = useInputChange();
    const checkboxChange: CheckboxCheckedHandler = useCheckboxChecked();

    const textAreaChange: TextAreaChangeHandler = useTextAreaChange();
    const token = useSelector(getToken);
    const config = {
        headers: {
            'Authorization': `Bearer ${token!}`
        }
    };

    const [form, setForm] = React.useState<number | null>(null);
    const [assigneeId, setAssigneeId] = React.useState<number | null>(null);
    const [assigneeName, setAssigneeName] = React.useState<string>('');
    const [subTask, setSubTask] = React.useState<SubTask>({
        id: null,
        taskId: taskId,
        name: '',
        description: '',
        color: '#FCA5A5',
        assigneeId: null,
        assigneeName: '',
        status: Status.WAITING,
        type: 'task',
        needApproval: false,
        formId: null,
        requestCode: '',
        start: new Date(),
        end: undefined
    });

    const handleColorChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.currentTarget;
        setSubTask((prevState) => ({
            ...prevState,
            color: target.value
        }));
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await save(subTask, config);
            setIsOpen(false);
            // await fetchingData();
            setSubTask({
                id: null,
                taskId: taskId,
                name: '',
                description: '',
                color: '#FCA5A5',
                assigneeId: null,
                assigneeName: '',
                status: Status.WAITING,
                type: 'task',
                needApproval: false,
                formId: null,
                requestCode: '',
                start: new Date(),
                end: undefined
            });
            await fetchingData();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    React.useEffect(() => {
        setSubTask((prevState) => ({
            ...prevState,
            formId: Number(form)
        }));
    }, [form]);

    React.useEffect(() => {
        setSubTask((prevState) => ({
            ...prevState,
            assigneeId: Number(assigneeId),
            assigneeName: assigneeName
        }));
    }, [assigneeId]);

    // console.clear();
    // console.table(subTask);

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
                                value={subTask.name || ''}
                                className="flex w-full bg-transparent text-xl outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                autoComplete="off"
                                onChange={(event) => inputChange(event, setSubTask)}
                            />
                        </Grid.Column>
                        <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2} className="flex justify-center items-end">
                            <ListboxAssignee setAssignee={setAssigneeId} setAssigneeName={setAssigneeName} />
                        </Grid.Column>
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5 text-center">
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            {subTask.assigneeId ? (
                                <div className="flex grid-cols-1  justify-items-start  whitespace-nowrap overflow-hidden">
                                    <div className="relative inline-flex items-center m-1 group">
                                        <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center bg-blue-100 m-1 ">
                                            {subTask.assigneeName}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                null
                            )}
                        </Grid.Column>
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5 text-center">
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <textarea
                                id="description"
                                value={subTask.description || ''}
                                className="flex w-full bg-transparent outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                placeholder="Write something about this task..."
                                rows={5}
                                onChange={(event) => textAreaChange(event, setSubTask)}
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
                                value={subTask.start ? new Date(subTask.start).toISOString().substr(0, 10) : ''}
                                className="flex w-full bg-transparent outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                onChange={(event) => inputChange(event, setSubTask)}
                            />
                        </Grid.Column>
                        <Grid.Column sm={1} md={1} lg={1} xl={1} xxl={1}>
                            <label htmlFor="start" className="label mt-2.5">{'End'}</label>
                        </Grid.Column>
                        <Grid.Column sm={5} md={5} lg={5} xl={5} xxl={5}>
                            <input
                                id="end"
                                type="date"
                                value={subTask.end ? new Date(subTask.end).toISOString().substr(0, 10) : ''}
                                className="flex w-full bg-transparent outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                onChange={(event) => inputChange(event, setSubTask)}
                            />
                        </Grid.Column>
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5 text-center">
                        <Grid.Column sm={8} md={8} lg={8} xl={8} xxl={8}>
                            <ListboxForm setForm={setForm} />
                        </Grid.Column>
                        <Grid.Column sm={4} md={4} lg={4} xl={4} xxl={4}>
                            <div className="checkbox-group">
                                <input
                                    id="needApproval"
                                    type="checkbox"
                                    checked={subTask.needApproval}
                                    onChange={(event) => checkboxChange(event, setSubTask)}
                                />
                                <label htmlFor="needApproval" className="label cursor-pointer inline-flex ml-1">{'Need Approval'}</label>
                            </div>
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