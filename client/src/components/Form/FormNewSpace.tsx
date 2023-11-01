import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useCheckboxChecked, { CheckboxCheckedHandler } from '../../hooks/useCheckboxChecked';
import { setOpenFormNewSpace } from '../../redux/Dialog/actions';
import { getOpenFormNewSpace } from '../../redux/Dialog/selectors';
import Http from '../../services/Http';
import { Assign } from '../../types/Assign';
import { Space } from '../../types/Space';
import { API } from '../../utils/api';
import { Grid } from '../Grid';
import { MenuUser } from '../Menu';
import { PopoverColor } from '../Popover';

interface Props {
    fetchingData: () => Promise<void>;
}

const initialSpaceState: Space = {
    id: null,
    name: '',
    color: '#F472B6',
    url: '',
    assignee: [],
    isPrivate: false
};

const Component = ({ fetchingData }: Props) => {

    const dispatch = useDispatch();
    const isOpen = useSelector(getOpenFormNewSpace);

    const checkboxChange: CheckboxCheckedHandler = useCheckboxChecked();

    const [assign, setAssign] = React.useState<Assign[]>([]);

    const [space, setSpace] = React.useState<Space>(initialSpaceState);

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
        setAssign([]);
        setSpace(initialSpaceState);
        dispatch(setOpenFormNewSpace(false));
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await Http.create(API.SPACE, space);
            await fetchingData();
        } catch (error) {
            throw new Error(error as string);
        } finally {
            handleClose();
        }
    };

    React.useEffect(() => {
        setSpace((prevState) => ({
            ...prevState,
            assignee: assign
        }));
    }, [assign]);

    React.useEffect(() => {
        const numberOrLetterPattern = /^[0-9a-zA-Z]+$/;
        const formattedName = space.name.trim().toLowerCase().replace(/\s+/g, '-');
        const thaiPattern = /[\u0E00-\u0E7F]/;

        if (space.name === '') {
            setSpace((prevState) => ({
                ...prevState,
                url: 'your-url'
            }));
        } else if (numberOrLetterPattern.test(space.name) && !thaiPattern.test(space.name)) {
            setSpace((prevState) => ({
                ...prevState,
                url: formattedName
            }));
        } else if (space.name.includes(' ')) {
            const parts = space.name.split(' ');
            const url = parts.map(part => part.match(numberOrLetterPattern) ? part : Math.random().toString(36).substr(2, 9)).join('-');
            setSpace((prevState) => ({
                ...prevState,
                url: url.toLowerCase()
            }));
        } else {
            setSpace((prevState) => ({
                ...prevState,
                url: Math.random().toString(36).substr(2, 9)
            }));
        }
    }, [space.name]);

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
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full transform rounded-lg bg-default p-6 text-left align-middle shadow-lg transition-all text-default max-w-xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg leading-6 text-default mb-2 font-bold"
                                    >
                                        {'Create new Space'}
                                        <button
                                            type="button"
                                            className="text-default float-right"
                                            onClick={handleClose}
                                        >
                                            <XMarkIcon className="icon-x16" />
                                        </button>
                                        <hr className="mt-5" />
                                    </Dialog.Title>
                                    <form onSubmit={(event) => void handleFormSubmit(event)}>
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
                                                    maxLength={32}
                                                    title="Only alphanumeric characters are allowed."
                                                    placeholder="Space name"
                                                    value={space.name || ''}
                                                    className="flex w-full bg-transparent text-xl outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                    autoComplete="off"
                                                    onChange={handleNameChange}
                                                />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1}>
                                            <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2}>
                                                <MenuUser assign={assign} setAssign={setAssign} />
                                            </Grid.Column>
                                            <Grid.Column sm={10} md={10} lg={10} xl={10} xxl={10} className="flex justify-end">
                                                <div className="flex mt-2 -space-x-3">
                                                    {assign.slice(0, 5).map((data, index) => (
                                                        <span
                                                            key={index}
                                                            className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-zinc-400 border border-zinc-300 align-middle items-center flex text-center justify-center text-zinc-100 font-bold"
                                                            title={data.fullName}
                                                        >
                                                            {data.fullName?.toUpperCase().charAt(0)}
                                                        </span>
                                                    ))}
                                                    {assign.length > 5 && (
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
                                                        checked={assign.length > 0 ? false : space.isPrivate}
                                                        disabled={assign.length > 0}
                                                        onChange={(event) => checkboxChange(event, setSpace)}
                                                    />
                                                    <label htmlFor="isPrivate" className="label cursor-pointer inline-flex ml-1">{'Private'}</label>
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
                                                <label htmlFor="name" className="label">{'Link :'} {'/' + (space.url || 'your-url')}</label>
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <button type="submit" className="button w-full bg-pink-400 hover:bg-pink-500 focus:bg-pink-500 text-white">{'Create'}</button>
                                            </Grid.Column>
                                        </Grid>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </React.Fragment>
    );
};

export default Component;