import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenFormEditSpace } from '../../redux/Dialog/actions';
import { getOpenFormEditSpace } from '../../redux/Dialog/selectors';
import { setEditSpace } from '../../redux/Edit/actions';
import { getEditSpace } from '../../redux/Edit/selectors';
import { getSpaceId, getSpaceName } from '../../redux/Sidebar/selectors';
import { Grid } from '../Grid';
import { MenuUser } from '../Menu';
import { PopoverColor } from '../Popover';

interface Props {
    fetchMySpaceList: () => Promise<void>;
    fetchFavSpaceList: () => Promise<void>;
}

const initialSpaceState: Space = {
    id: null,
    name: '',
    color: '',
    url: '',
    assignee: [],
    isPrivate: false
};

const Component = ({ fetchMySpaceList, fetchFavSpaceList }: Props) => {

    const dispatch = useDispatch();
    const spaceId = useSelector(getSpaceId);
    const spaceName = useSelector(getSpaceName);
    const editMode = useSelector(getEditSpace);
    const isOpen = useSelector(getOpenFormEditSpace);

    const [assign, setAssign] = React.useState<Assign[]>([]);
    const [space, setSpace] = React.useState<Space>(initialSpaceState);

    const fetchSpace = async () => {
        try {
            const response: AxiosResponse<Space> = await axios.get(`${SERVER.API.SPACE}/${spaceId!}`);
            setSpace(response.data);
            setAssign(response.data.assignee);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleColorChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.currentTarget;
        setSpace((prevState) => ({
            ...prevState,
            color: target.value
        }));
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const { id, value } = target;
        const filteredValue = value.replace(/[^0-9a-zA-Zก-๙\s]/g, '').replace(/\s+/g, ' ');
        setSpace((prevState) => ({
            ...prevState,
            [id]: filteredValue
        }));
    };

    const handleClose = () => {
        dispatch(setOpenFormEditSpace(false));
        setSpace(initialSpaceState);
        dispatch(setEditSpace(false));
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await axios.put(`${SERVER.API.SPACE}/${spaceId!}`, space);
            await fetchMySpaceList();
            await fetchFavSpaceList();
        } catch (error) {
            throw new Error(error as string);
        } finally {
            handleClose();
        }
    };

    // React.useEffect(() => {
    //     const numberOrLetterPattern = /^[0-9a-zA-Z]+$/;
    //     const formattedName = space.name.trim().toLowerCase().replace(/\s+/g, '-');
    //     const thaiPattern = /[\u0E00-\u0E7F]/;

    //     if (space.name === '') {
    //         setSpace((prevState) => ({
    //             ...prevState,
    //             url: 'your-url'
    //         }));
    //     } else if (numberOrLetterPattern.test(space.name) && !thaiPattern.test(space.name)) {
    //         setSpace((prevState) => ({
    //             ...prevState,
    //             url: formattedName
    //         }));
    //     } else if (space.name.includes(' ')) {
    //         const parts = space.name.split(' ');
    //         const url = parts.map(part => part.match(numberOrLetterPattern) ? part : Math.random().toString(36).substr(2, 9)).join('-');
    //         setSpace((prevState) => ({
    //             ...prevState,
    //             url: url.toLowerCase()
    //         }));
    //     } else {
    //         setSpace((prevState) => ({
    //             ...prevState,
    //             url: Math.random().toString(36).substr(2, 9)
    //         }));
    //     }
    // }, [space.name]);

    React.useEffect(() => {
        spaceId && void fetchSpace();
    }, [isOpen]);

    return (
        <React.Fragment>
            <Transition appear show={isOpen} as={React.Fragment}>
                <Dialog as="div" className="relative z-10" onClose={handleClose}>
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="backdrop" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-xl p-6 text-left align-middle transition-all transform rounded-lg shadow-lg bg-default text-default">
                                    <Dialog.Title
                                        as="h3"
                                        className="mb-2 text-lg font-bold leading-6 text-default"
                                    >
                                        {spaceName}
                                        <button
                                            type="button"
                                            className="float-right text-default"
                                            onClick={handleClose}
                                        >
                                            <XMarkIcon className="icon-x16" />
                                        </button>
                                        <hr className="mt-5" />
                                    </Dialog.Title>
                                    <form onSubmit={(event) => void handleFormSubmit(event)}>
                                        {space && (
                                            <React.Fragment>
                                                <Grid column={12} gap={1}>
                                                    <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                        <PopoverColor color={space.color} onClick={handleColorChange} />
                                                    </Grid.Column>
                                                </Grid>
                                                <Grid column={12} gap={1} className="mt-5">
                                                    <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                        <input
                                                            id="name"
                                                            type="text"
                                                            maxLength={255}
                                                            title="Only alphanumeric characters are allowed."
                                                            placeholder="Space name"
                                                            value={space.name || ''}
                                                            className="flex w-full py-2 text-xl bg-transparent border-b border-transparent outline-none text-default hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                            autoComplete="off"
                                                            onChange={handleNameChange}
                                                        />
                                                    </Grid.Column>
                                                </Grid>
                                                <Grid column={12} gap={1}>
                                                    <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2}>
                                                        <MenuUser assign={assign} setAssign={setAssign} type="UPDATE" />
                                                    </Grid.Column>
                                                    <Grid.Column sm={10} md={10} lg={10} xl={10} xxl={10} className="flex justify-end">
                                                        <div className="flex mt-2 -space-x-3">
                                                            {assign && assign.slice(0, 5).map((data, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-zinc-400 border border-zinc-300 align-middle items-center flex text-center justify-center text-zinc-100 font-bold"
                                                                    title={data.fullName}
                                                                >
                                                                    {data.fullName?.toUpperCase().charAt(0)}
                                                                </span>
                                                            ))}
                                                            {assign && assign.length > 5 && (
                                                                <span
                                                                    className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-indigo-400 border border-indigo-300 align-middle items-center flex text-center justify-center text-indigo-100 font-bold"
                                                                    title={assign.slice(5).map((item) => item.fullName).join(', ')}
                                                                >
                                                                    {'+'}{assign.length - 5}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </Grid.Column>
                                                </Grid>
                                                <Grid column={12} gap={1} className="mt-5">
                                                    <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                        <div className="checkbox-group">
                                                            <input
                                                                id="isPrivate"
                                                                type="checkbox"
                                                                checked={assign && assign.length > 0 ? false : space.isPrivate}
                                                                disabled={assign && assign.length > 0}
                                                                onChange={(event) => setSpace({ ...space, isPrivate: event.target.checked })}
                                                            />
                                                            <label htmlFor="isPrivate" className="inline-flex ml-1 cursor-pointer label">{'Private'}</label>
                                                        </div>
                                                    </Grid.Column>
                                                </Grid>
                                                <Grid column={12} gap={1} className="mt-5">
                                                    <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                        <span
                                                            className="w-7 h-7 px-2.5 py-1.5 text-xs rounded text-white mr-2"
                                                            style={{ backgroundColor: space.color }}
                                                        >
                                                            {space.name.toUpperCase().charAt(0) || '?'}
                                                        </span>
                                                    </Grid.Column>
                                                </Grid>
                                                <Grid column={12} gap={1} className="mt-5">
                                                    <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                        {editMode ? (
                                                            <div className="flex items-center align-middle">
                                                                <label htmlFor="name" className="label" style={{ marginLeft: '5px' }}>
                                                                    {'Link :'}
                                                                </label>
                                                                <input
                                                                    id="url"
                                                                    type="text"
                                                                    maxLength={255}
                                                                    title="Only alphanumeric characters are allowed."
                                                                    placeholder="URL"
                                                                    value={space.url || ''}
                                                                    className="flex py-2 mb-2 ml-3 text-sm bg-transparent border-b border-transparent outline-none text-default hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                                    autoComplete="off"
                                                                    onChange={handleNameChange}
                                                                />
                                                                <button type="button" className="mb-1 ml-3" onClick={() => dispatch(setEditSpace(false))} style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <CheckIcon className="icon-x12" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center align-middle">
                                                                <label htmlFor="name" className="label" style={{ marginLeft: '5px' }}>
                                                                    {'Link :'} {'/' + (space.url || 'your-url')}
                                                                </label>
                                                                <button type="button" className="mb-1 ml-3" onClick={() => dispatch(setEditSpace(true))} style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <PencilIcon className="icon-x12" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </Grid.Column>
                                                </Grid>
                                                <Grid column={12} gap={1} className="mt-5 text-center">
                                                    <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                        <button type="submit" className="w-full text-white bg-pink-400 button hover:bg-pink-500 focus:bg-pink-500">{'Update'}</button>
                                                    </Grid.Column>
                                                </Grid>
                                            </React.Fragment>
                                        )}
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </React.Fragment >
    );
};

export default Component;