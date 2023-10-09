import React, { useEffect } from 'react';
import useCheckboxChecked, { CheckboxCheckedHandler } from '../../hooks/useCheckboxChecked';
import { Modal } from '../Modal';
import { Grid } from '../Grid';
import { useSelector } from 'react-redux';
import { getToken, getUserId } from '../../redux/Authentication/selectors';
import { getDuplicate } from '../../services/Project';
import { Color } from '../Color';

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    projectId: number | null;
    spaceId: number | null;
    fetchingData: () => Promise<void>;
}

interface Project {
    id: number | null;
    spaceId: number | null;
    userId: number | null;
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

const Component = ({ isOpen, setIsOpen, projectId, fetchingData, spaceId }: Props) => {

    const checkboxChange: CheckboxCheckedHandler = useCheckboxChecked();

    const userId = useSelector(getUserId);
    const token = useSelector(getToken);
    const config = {
        headers: {
            'Authorization': `Bearer ${token!}`
        }
    };
    const [project, setProject] = React.useState<Project>({
        id: null,
        spaceId,
        userId,
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

    console.log('projectId = ', projectId);
    console.log('isOpen = ', isOpen);

    const fetchProject = async () => {

        try {
            const response: Project = await getDuplicate(projectId!, config);
            setProject(response);


        } catch (error) {
            throw new Error(error as string);
        }

        await fetchingData();
    };


    React.useEffect(() => {
        if (isOpen) {
            console.log('isOpen 888 = ', isOpen);
            void fetchProject();
            setIsOpen(false);
        }
    }, [isOpen]);



    return (
        <div>

        </div>
    );
};
export default Component;