import * as HeroIcons from '@heroicons/react/24/outline';
import React from 'react';
import { useDispatch } from 'react-redux';
import { SidebarFavoriteSpaceList, SidebarMySpaceList } from '.';
import useAuthorize from '../../hooks/useAuthorize';
import { setOpenFormNewSpace } from '../../redux/Dialog/actions';
import { Space } from '../../types/Space';

interface Props {
    spaceRef: React.MutableRefObject<HTMLButtonElement | null>;
    favoriteSpaceRef: React.MutableRefObject<HTMLButtonElement | null>;
    projectRef: React.MutableRefObject<HTMLButtonElement | null>;
    folderRef: React.MutableRefObject<HTMLButtonElement | null>;
    mySpaceList: Space[];
    favSpaceList: Space[];
    fetchMySpaceList: () => Promise<void>;
}

const Component = ({ spaceRef, favoriteSpaceRef, projectRef, folderRef, mySpaceList, favSpaceList, fetchMySpaceList }: Props) => {

    useAuthorize();

    const dispatch = useDispatch();

    return (
        <React.Fragment>
            <div className="mb-2">
                <span className="text-default uppercase font-bold text-xs mr-2">{'🚀 Space'}</span>
            </div>
            <button
                type="button"
                className="button w-full mb-2"
                onClick={() => dispatch(setOpenFormNewSpace(true))}
            >
                <HeroIcons.PlusIcon className="icon-x16" />
                <span>{'New Space'}</span>
            </button>
            <div className="sm:h-52 2xl:h-112 overflow-y-scroll">
                <SidebarFavoriteSpaceList
                    favoriteSpaceRef={favoriteSpaceRef}
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