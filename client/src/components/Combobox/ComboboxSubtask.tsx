import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import React from 'react';

interface Props {
    subTaskList: Subtask[];
    setBlockedBy: React.Dispatch<React.SetStateAction<number | null>>;
}

const Component = ({ subTaskList, setBlockedBy }: Props) => {

    const [selected, setSelected] = React.useState(subTaskList[0]);
    const [query, setQuery] = React.useState('');

    const filtered =
        query === ''
            ? subTaskList
            : subTaskList.filter((subTask) =>
                subTask.name
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            );

    React.useEffect(() => {
        selected && setBlockedBy(selected.id!);
    }, [selected]);

    return (
        <React.Fragment>
            <div className="w-full">
                <Combobox value={selected} onChange={setSelected}>
                    <div className="relative mt-1">
                        <div className="relative w-full overflow-hidden text-left border rounded-lg cursor-default bg-default border-default">
                            <Combobox.Input
                                className="w-full py-2 pl-3 pr-10 text-sm leading-5 text-default bg-default"
                                displayValue={(data: Subtask) => data.name}
                                onChange={(event) => setQuery(event.target.value)}
                                required
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                    className="w-5 h-5 text-default"
                                    aria-hidden="true"
                                />
                            </Combobox.Button>
                        </div>
                        <Transition
                            as={React.Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setQuery('')}
                        >
                            <Combobox.Options className="absolute w-full py-1 mt-3 overflow-auto border rounded-md max-h-60 bg-default border-default">
                                {filtered.length === 0 && query !== '' ? (
                                    <div className="relative px-4 py-2 cursor-default select-none text-default">
                                        {'Nothing found.'}
                                    </div>
                                ) : (
                                    filtered.map((person) => (
                                        <Combobox.Option
                                            key={person.id}
                                            className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 text-default ${active ? 'bg-default-faded' : ''}`
                                            }
                                            value={person}
                                        >
                                            {({ selected }) => (
                                                <React.Fragment>
                                                    <span
                                                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                                                    >
                                                        {person.name}
                                                    </span>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-default"
                                                        >
                                                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </React.Fragment>
                                            )}
                                        </Combobox.Option>
                                    ))
                                )}
                            </Combobox.Options>
                        </Transition>
                    </div>
                </Combobox>
            </div>
        </React.Fragment>
    );
};

export default Component;