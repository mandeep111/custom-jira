import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setOpenFormOpenFolder } from '../../redux/Dialog/actions';
import { setFolderId, setFolderName, setMouseX, setMouseY, setSpaceId, setSpaceName, setSpaceUrl } from '../../redux/Sidebar/actions';

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
                                let calculatedMouseX = event.clientX - folderRect.left;
                                let calculatedMouseY = event.clientY - folderRect.top;
                    
                                calculatedMouseY = Math.min(calculatedMouseY, -240);
                    
                                dispatch(setMouseX(calculatedMouseX));
                                dispatch(setMouseY(calculatedMouseY));
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
                        <Link to="#" className="flex items-center w-full ml-10">
                            <div className="flex items-center">
                                <span className="mr-1 -ml-1">{'📁'}</span>
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