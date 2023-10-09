import React from 'react';
import { useDrop } from 'react-dnd';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
    ChevronRightIcon,
    ChevronUpIcon
} from '@heroicons/react/24/outline';
interface TodoState {
    children?: React.ReactNode;
    title: string;
    state: number;
    color: string;
    className?: string;
}

const Component: React.FunctionComponent<TodoState> = ({ children, className, title, state, color }) => {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'Our first type',
        drop: () => ({ taskStageId: state }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        }),
        // // Override monitor.canDrop() function
        // canDrop: (item) => {
        //     const { DO_IT, IN_PROGRESS, AWAITING_REVIEW, DONE } = COLUMN_NAMES;
        //     const { currentColumnName } = item;
        //     return (
        //         currentColumnName === title ||
        //         (currentColumnName === DO_IT && title === IN_PROGRESS) ||
        //         (currentColumnName === IN_PROGRESS &&
        //             (title === DO_IT || title === AWAITING_REVIEW)) ||
        //         (currentColumnName === AWAITING_REVIEW &&
        //             (title === IN_PROGRESS || title === DONE)) ||
        //         (currentColumnName === DONE && title === AWAITING_REVIEW)
        //     );
        // }
    });
    const [isHoveredSpace, setIsHoveredSpace] = React.useState<number | null>(null);

    return (
        <React.Fragment>
            <Disclosure defaultOpen={state !== 0}>
                {({ open }) => (
                    <React.Fragment>
                        <div className="inline-flex flex-nowrap items-center rounded transition duration-200 py-2.5 hover:bg-default-faded w-full"
                            // onMouseEnter={() => setIsHoveredSpace(state)}
                        // onMouseLeave={() => setIsHoveredSpace(null)}
                        >
                            <Disclosure.Button>
                                <ChevronRightIcon className={`${open ? 'rotate-90 transform' : ''}     inline-flex icon-x16 text-default ml-1`} />
                            </Disclosure.Button>

                            <span className={`uppercase text-center w-36 font-bold py-3 bg-default text-default ${className || ''}`}
                                style={{ borderTopColor: color }}>
                                {title}
                            </span>
                        </div>

                        <Disclosure.Panel>
                            <React.Fragment>
                                <div className="py-3">
                                    {children}
                                </div>
                            </React.Fragment>
                        </Disclosure.Panel>
                    </React.Fragment>
                )}
            </Disclosure>
        </React.Fragment >
    );
};

export default Component;