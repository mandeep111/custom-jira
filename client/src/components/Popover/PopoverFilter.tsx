import { Popover, Transition } from '@headlessui/react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import { setIsCheckMe } from '../../redux/Project/actions';
import { getIsCheckMe, getSortDir } from '../../redux/Project/selectors';
import { getSearch } from '../../redux/Task/selectors';
import Http from '../../services/Http';
import { API } from '../../utils/api';
import { Task } from '../../types/Task';

interface Props {
    setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
    fetchTaskList: () => Promise<void>;
    fetchMeList: () => Promise<void>;
}

const Component = ({ setTaskList, fetchTaskList, fetchMeList }: Props) => {

    const { projectId } = useParams();

    const dispatch = useDispatch();
    const search = useSelector(getSearch);
    const isCheckMe = useSelector(getIsCheckMe);

    const [filterValue, setFilterValue] = React.useState<string[]>([]);
    const [queryString, setQueryString] = React.useState<string>();
    const [debouncedSearch, setDebouncedSearch] = useDebounce('', 250);
    const sortDir = useSelector(getSortDir);

    const filtersList = [
        { id: 1, name: 'Name', value: 'name' },
        { id: 2, name: 'Color', value: 'color' },
        { id: 3, name: 'Progress', value: 'progress' },
        { id: 4, name: 'Assignee', value: 'assignees' },
        { id: 5, name: 'Due Date', value: 'end' },
    ];

    const fetchTaskWithFilter = async () => {
        try {
            const response: { content: Task[] } = await Http.get(`${API.TASK}/page?projectId=${projectId!}&${queryString!}&search=${search}&sortDir=${sortDir}`);
            const { content } = response;
            setTaskList(content);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleFilterChecked = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {
        try {
            const isChecked = event.target.checked;
            if (isChecked) {
                setFilterValue((prevState) => [...prevState, name]);
            } else {
                setFilterValue((prevState) => prevState.filter(item => item !== name));
            }
        } catch (error) {
            throw new Error(error as string);
        }
    };

    React.useEffect(() => {
        const mapToQueryString = filterValue.map(value => `searchAttributes=${value}`).join('&');
        setQueryString(mapToQueryString);
    }, [filterValue]);

    React.useEffect(() => {
        setDebouncedSearch(search);
    }, [search]);

    React.useEffect(() => {
        if (!projectId) {
            setTaskList([]);
            return;
        }
        if (filterValue.length === 0) {
            isCheckMe ? void fetchMeList() : void fetchTaskList();
        } else {
            void fetchTaskWithFilter();
            if (isCheckMe) {
                dispatch(setIsCheckMe(false));
                localStorage.setItem('checked_me', JSON.stringify(false));
            }
        }
        localStorage.setItem('filter_task', JSON.stringify(filterValue.length > 0));
    }, [projectId, filterValue, isCheckMe, debouncedSearch]);

    React.useEffect(() => {
        projectId && void fetchTaskWithFilter();
    }, [sortDir]);

    return (
        <React.Fragment>
            <Popover className="relative">
                <div>
                    <Popover.Button
                        className={`flex items-center rounded-lg bg-default hover:bg-default-faded text-default text-sm px-1.5 mr-2 ${filterValue.length > 0 ? 'text-pink-400' : ''}`}
                    >
                        <FunnelIcon className="icon-x16" />
                        {'Filter'}
                    </Popover.Button>
                    <Transition
                        as={React.Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-72 max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 border border-default bg-default p-4">
                                {filtersList.map((filter, index) => (
                                    <React.Fragment key={index}>
                                        <div className="flex items-center pb-2">
                                            <input
                                                id={filter.value}
                                                type="checkbox"
                                                value={filter.value}
                                                className="w-4 h-4 text-default bg-default border-default rounded"
                                                checked={filterValue.includes(filter.value)}
                                                onChange={(event) => {
                                                    void handleFilterChecked(event, filter.value);
                                                }}
                                            />
                                            <label htmlFor={filter.value} className="ml-2 text-sm font-medium text-default select-none cursor-pointer">
                                                {filter.name}
                                            </label>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </div>
            </Popover>
        </React.Fragment>
    );
};

export default Component;