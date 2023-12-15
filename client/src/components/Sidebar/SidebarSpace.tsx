import * as HeroIcons from '@heroicons/react/24/outline';
import React from 'react';
import { useDispatch } from 'react-redux';
import { SidebarFavoriteSpaceList, SidebarMySpaceList } from '.';
import { setOpenFormNewSpace } from '../../redux/Dialog/actions';

interface Props {
    spaceRef: React.MutableRefObject<HTMLButtonElement | null>;
    projectRef: React.MutableRefObject<HTMLButtonElement | null>;
    folderRef: React.MutableRefObject<HTMLButtonElement | null>;
    mySpaceList: Space[];
    favSpaceList: Space[];
    fetchMySpaceList: () => Promise<void>;
}

const Component = ({ spaceRef, projectRef, folderRef, mySpaceList, favSpaceList, fetchMySpaceList }: Props) => {

    const dispatch = useDispatch();

    return (
        <React.Fragment>
            <div className="relative">
                <div className="mb-2">
                    <span className="mr-2 text-xs font-bold uppercase text-default">{'🚀 Space'}</span>
                </div>
                <button
                    type="button"
                    className="w-full mb-2 button"
                    onClick={() => dispatch(setOpenFormNewSpace(true))}
                >
                    <HeroIcons.PlusIcon className="icon-x16" />
                    <span>{'New Space'}</span>
                </button>
                <SidebarFavoriteSpaceList
                    spaceRef={spaceRef}
                    projectRef={projectRef}
                    folderRef={folderRef}
                    favSpaceList={favSpaceList}
                    fetchMySpaceList={fetchMySpaceList}
                />
                <SidebarMySpaceList
                    spaceRef={spaceRef}
                    projectRef={projectRef}
                    folderRef={folderRef}
                    mySpaceList={mySpaceList}
                    fetchMySpaceList={fetchMySpaceList}
                />
            </div>
        </React.Fragment>
    );
};

export default Component;