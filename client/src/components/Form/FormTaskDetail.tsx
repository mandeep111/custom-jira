import React from 'react';
import { Modal } from '../Modal';
import { Grid } from '../Grid';
import { Color } from '../Color';

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    item: TodoState;
    fetchingData?: () => Promise<void>;
}

interface TodoState {
    id: number;
    taskStageId: number;
    taskStageName: string;
    projectId: number;
    name: string;
    description: string;
    assignee: User[];
    tags: [];
    color: string;
    start: Date;
    end: Date;
    type: string;
    isDisabled: boolean;
    progress: number;
}

interface User {
    id: number | null;
    fullName: string;
    email: string;
}

const Component = ({ isOpen, setIsOpen, item, fetchingData }: Props) => {

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
                            {/* <Color onClick={handleColorChange} /> */}
                            <button type="button" className="rounded-full p-3 mr-2 w-0 focus:ring-4 focus:ring-default" style={{ backgroundColor: item.color }}></button>
                        </Grid.Column>
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5">
                        {/* <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <label htmlFor="name" className="label">{'Project name'}</label>
                            <input
                                id="name"
                                type="text"
                                maxLength={32}
                                title="Only alphanumeric characters are allowed."
                                value={item.name || ''}
                                className="flex w-full bg-transparent text-xl outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                autoComplete="off"
                                onChange={handleNameChange}
                            />
                        </Grid.Column> */}
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5">
                        {/* <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <div className="checkbox-group">
                                <input
                                    id="isPrivate"
                                    type="checkbox"
                                    checked={project.isPrivate}
                                    onChange={(event) => checkboxChange(event, setProject)}
                                />
                                <label htmlFor="isPrivate" className="label cursor-pointer inline-flex ml-1">{'Private'}</label>
                            </div>
                        </Grid.Column> */}
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5">
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            {/* <label htmlFor="name" className="label">{'Link :'} {'/' + (project.url || 'your-url')}</label> */}
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