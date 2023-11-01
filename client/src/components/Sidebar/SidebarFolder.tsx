import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setOpenFormOpenFolder } from '../../redux/Dialog/actions';
import { setFolderId, setFolderName, setMouseX, setMouseY, setSpaceId, setSpaceName, setSpaceUrl } from '../../redux/Sidebar/actions';
import { Space } from '../../types/Space';

interface Props {
    space: Space;
    folderRef: React.MutableRefObject<HTMLButtonElement | null>;
    fetchSpaceList: () => Promise<void>;
}

const Component = ({ space, folderRef }: Props) => {

    const dispatch = useDispatch();

    return (
        <React.Fragment>
            {Array.isArray(space.folders) && space.folders.map((folder, index) => (
                <React.Fragment key={index}>
                    <div className="flex items-center text-default py-2.5 rounded transition duration-200 hover:bg-default-faded"
                        onContextMenu={(event) => {
                            event.preventDefault();
                            folderRef.current?.click();
                            dispatch(setSpaceId(space.id));
                            dispatch(setSpaceUrl(space.url));
                            dispatch(setSpaceName(space.name));
                            dispatch(setFolderId(folder.id!));
                            dispatch(setFolderName(folder.name));
                            const folderRect = folderRef.current?.getBoundingClientRect();
                            if (folderRect) {
                                dispatch(setMouseX(event.clientX - folderRect.left));
                                dispatch(setMouseY(event.clientY - folderRect.top));
                            }
                        }}
                        onClick={() => {
                            dispatch(setSpaceId(space.id));
                            dispatch(setSpaceUrl(space.url));
                            dispatch(setSpaceName(space.name));
                            dispatch(setFolderId(folder.id!));
                            dispatch(setFolderName(folder.name));
                            dispatch(setOpenFormOpenFolder(true));
                        }}
                    >
                        <Link to="#" className="flex items-center ml-10 w-full">
                            <div className="flex items-center">
                                <span className="-ml-1 mr-1">{'📁'}</span>
                                <span className="text-default">
                                    {folder.name}
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