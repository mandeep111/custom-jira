import { Disclosure } from '@headlessui/react';
import React from 'react';
import { useDrop } from 'react-dnd';

interface TodoState extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    state: number;
    color: string;
    task: number | null | undefined;
}

const Component: React.FunctionComponent<TodoState> = ({ children, className, title, state, color, task }) => {
    useDrop({
        accept: 'Our first type',
        drop: () => ({ taskStageId: state }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    });

    return (
        <React.Fragment>
            <Disclosure defaultOpen={task! > 0}>
                {() => (
                    <React.Fragment>
                        <div className="inline-flex flex-nowrap rounded py-2.5 w-full">
                            <Disclosure.Button className={`uppercase font-bold py-3 mx-3 bg-default text-default ${className || ''} w-full`} style={{ borderLeftColor: color }}>
                                <span>
                                    {title}
                                </span>
                                <span className="inline-flex items-center rounded-md bg-pink-200 px-2 py-1 text-xs font-bold text-pink-600 ring-1 ring-inset ring-gray-500/10 float-right mr-5" title={task?.toString()}>
                                    {task! > 99 ? '99+' : task}
                                </span>
                            </Disclosure.Button>
                        </div>
                        <Disclosure.Panel>
                            <div className="py-3">
                                {children}
                            </div>
                        </Disclosure.Panel>
                    </React.Fragment>
                )}
            </Disclosure>
        </React.Fragment>
    );
};

export default Component;