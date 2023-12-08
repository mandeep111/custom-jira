import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import axios, { AxiosResponse } from 'axios';
import React from 'react';

interface Props {
    setForm: (formId: number | null) => void;
}

interface Form {
    id: number | null;
    formName: string;
    formTemplateId: number | null;
}

const Component = ({ setForm }: Props) => {

    const [formList, setFormList] = React.useState<Form[]>([]);
    const [selectedForm, setSelectedForm] = React.useState<Form | null>(null);

    const fetchData = async () => {
        try {
            const response: AxiosResponse<Form[]> = await axios.get(`${SERVER.API.FORM}/forms`);
            setFormList(response.data);
        } catch (error) {
            throw new Error(`An error occurred: ${error as string}`);
        }
    };

    React.useEffect(() => {
        void fetchData();
    }, []);

    React.useEffect(() => {
        if (selectedForm !== null && selectedForm !== undefined) {
            setForm(selectedForm.id);
        }
    }, [selectedForm]);

    return (
        <div className="w-72 bg-default">
            <Listbox value={selectedForm} onChange={setSelectedForm}>
                <div className="relative mt-1">
                    <Listbox.Button className="relative w-full bg-default py-2 pl-3 pr-10 text-left hover:border-b hover:border-default focus:border-b focus:border-blue-300">
                        <span className="block truncate">{selectedForm ? selectedForm.formName : ''}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
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
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-default border border-default py-1">
                            {Array.isArray(formList) && formList.map((form, index) => (
                                <Listbox.Option
                                    key={index}
                                    className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 text-default ${active ? 'bg-default-faded' : ''}`
                                    }
                                    value={form ? form : null}
                                >
                                    {({ selected }) => (
                                        <React.Fragment>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                                            >
                                                {form.formName}
                                            </span>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-default">
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </React.Fragment>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );

};

export default Component;