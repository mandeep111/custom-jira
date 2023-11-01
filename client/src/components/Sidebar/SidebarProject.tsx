import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setMouseX, setMouseY, setProjectId, setProjectName, setProjectUrl, setSpaceId, setSpaceName, setSpaceUrl } from '../../redux/Sidebar/actions';
import { Space } from '../../types/Space';
import { Project } from '../../types/Project';

interface Props {
    space: Space;
    projectRef: React.MutableRefObject<HTMLButtonElement | null>;
    fetchSpaceList: () => Promise<void>;
}
const Component = ({ space, projectRef }: Props) => {

    const dispatch = useDispatch();

    const handleClick = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>, project: Project) => {
        dispatch(setProjectName(project.name));
    };

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, project: Project) => {
        event.preventDefault();
        projectRef.current?.click();
        dispatch(setSpaceId(space.id));
        dispatch(setSpaceUrl(space.url));
        dispatch(setSpaceName(space.name));
        dispatch(setProjectId(project.id));
        dispatch(setProjectUrl(project.url));
        dispatch(setProjectName(project.name));
        const projectRect = projectRef.current?.getBoundingClientRect();
        if (projectRect) {
            dispatch(setMouseX(event.clientX - projectRect.left));
            dispatch(setMouseY(event.clientY - projectRect.top));
        }
    };

    return (
        <React.Fragment>
            {Array.isArray(space.projects) && space.projects.map((project, index) => (
                <React.Fragment key={index}>
                    <div className="flex items-center text-default py-2.5 rounded transition duration-200 hover:bg-default-faded"
                        onContextMenu={(event) => handleContextMenu(event, project)}
                        onClick={(event) => handleClick(event, project)}
                    >
                        <Link to={project.id && project.url ? `/${space.id!}/${space.url}/${project.id}/${project.url}` : ''} className="flex items-center ml-10 w-full">
                            <div className="flex items-center">
                                <span className="rounded-full p-1.5 w-0 mr-2" style={{ backgroundColor: project.color }}></span>
                                <span className="text-default">
                                    {project.name}
                                </span>
                            </div>
                        </Link>
                    </div>
                </React.Fragment>
            ))}
        </React.Fragment>
    );
};

export default Component;