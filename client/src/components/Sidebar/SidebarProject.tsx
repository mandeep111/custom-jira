import { StarIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setFavoriteProject, setMouseX, setMouseY, setProjectId, setProjectName, setProjectUrl, setSpaceId, setSpaceName, setSpaceUrl } from '../../redux/Sidebar/actions';

interface Props {
    space: Space;
    projectRef: React.MutableRefObject<HTMLButtonElement | null>;
    fetchSpaceList: () => Promise<void>;
}
const Component = ({ space, projectRef }: Props) => {

    const dispatch = useDispatch();

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, project: Project) => {
        event.preventDefault();
        projectRef.current?.click();
        dispatch(setSpaceId(space.id));
        dispatch(setSpaceUrl(space.url));
        dispatch(setSpaceName(space.name));
        dispatch(setProjectId(project.id));
        dispatch(setProjectUrl(project.url));
        dispatch(setProjectName(project.name));
        dispatch(setFavoriteProject(project.isFavorite!));
        const projectRect = projectRef.current?.getBoundingClientRect();
        if (projectRect) {
            let calculatedMouseX = event.clientX - projectRect.left;
            let calculatedMouseY = event.clientY - projectRect.top;

            calculatedMouseY = Math.min(calculatedMouseY, -293);

            dispatch(setMouseX(calculatedMouseX));
            dispatch(setMouseY(calculatedMouseY));
        }
    };

    return (
        <React.Fragment>
            {Array.isArray(space.projects) && space.projects.map((project, index) => (
                <React.Fragment key={index}>
                    <div
                        className="flex items-center text-default py-2.5 rounded transition duration-200 hover:bg-default-faded"
                        onContextMenu={(event) => handleContextMenu(event, project)}
                        onClick={() => {
                            dispatch(setProjectName(project.name));
                            dispatch(setProjectId(project.id));
                            dispatch(setSpaceId(space.id));
                        }}
                    >
                        <Link to={project.id && project.url ? `/${space.id!}/${space.url}/${project.id}/${project.url}` : ''} className="flex items-center w-full ml-10">
                            <div className="flex items-center">
                                {project.isFavorite ? (
                                    <span>
                                        <StarIcon className="text-yellow-400 icon-x16" />
                                    </span>
                                ) : (
                                    <span className="rounded-full p-1.5 w-0 mr-2" style={{ backgroundColor: project.color }}></span>
                                )}
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