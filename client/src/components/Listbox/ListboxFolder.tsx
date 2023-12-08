import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import axios, { AxiosResponse } from 'axios';
import React from 'react';

interface Props {
    spaceId: number | null;
    setSelectedFolder: React.Dispatch<React.SetStateAction<Folder | null>>;
}

const Component = ({ spaceId, setSelectedFolder }: Props) => {

    const [folderList, setFolderList] = React.useState<Folder[]>([]);
    const [selected, setSelected] = React.useState<Folder | null>(null);
    const [pageSize, setPageSize] = React.useState(10);
    const [totalElements, setTotalElements] = React.useState(0);

    const handleLoadMore = (event: React.MouseEvent) => {
        event.preventDefault();
        setPageSize(pageSize + 5);
        void fetchFolderList(pageSize);
    };

    const fetchFolderList = async (pageSize: number) => {
        try {
            const response: AxiosResponse<APIResponse<Folder>> = await axios.get(`${SERVER.API.FOLDER}/page?pageSize=${pageSize}&spaceId=${spaceId!}`);
            const { content, totalElements } = response.data;
            setTotalElements(totalElements);
            setFolderList(content);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    React.useEffect(() => {
        setSelectedFolder(selected);
    }, [selected]);

    React.useEffect(() => {
        setSelected(null);
        void fetchFolderList(5);
    }, [spaceId]);

    return (
        <React.Fragment>
            <Listbox value={selected} onChange={setSelected}>
                <div className="relative mt-1">
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left border rounded-lg cursor-pointer bg-default border-default">
                        <span className="block truncate">{selected === null ? '🚫 None' : `📁 ${selected.name}`}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <ChevronUpDownIcon
                                className="w-5 h-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={React.Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute w-full mt-1 overflow-auto border rounded-md max-h-48 bg-default border-default">
                            <Listbox.Option
                                className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-default-faded' : ''} text-default`}
                                value={null}
                            >
                                {({ selected }) => (
                                    <React.Fragment>
                                        <span
                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'} text-left text-sm`}
                                        >
                                            {'🚫 None'}
                                        </span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-default">
                                                <CheckIcon className="icon-x16" />
                                            </span>
                                        ) : null}
                                    </React.Fragment>
                                )}
                            </Listbox.Option>
                            {Array.isArray(folderList) && folderList.map((folder, index) => (
                                <Listbox.Option
                                    key={index}
                                    className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-default-faded' : ''} text-default`}
                                    value={folder}
                                >
                                    {({ selected }) => (
                                        <React.Fragment>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'} text-left text-sm`}
                                            >
                                                {`📁 ${folder.name}`}
                                            </span>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-default">
                                                    <CheckIcon className="icon-x16" />
                                                </span>
                                            ) : null}
                                        </React.Fragment>
                                    )}
                                </Listbox.Option>
                            ))}
                            {folderList.length === totalElements ? null : (
                                <React.Fragment>
                                    <Listbox.Option
                                        value={null}
                                        className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-default-faded' : ''} text-default`}
                                        onClick={(event) => handleLoadMore(event)}
                                    >
                                        <React.Fragment>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'} text-left text-sm`}
                                            >
                                                {'⏳ Load More'}
                                            </span>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-default">
                                                    <CheckIcon className="icon-x16" />
                                                </span>
                                            ) : null}
                                        </React.Fragment>
                                    </Listbox.Option>
                                </React.Fragment>
                            )}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </React.Fragment>
    );
};

export default Component;