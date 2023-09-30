import React from 'react';
import { useDrop } from 'react-dnd';

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

    return (
        <React.Fragment>
            <p
                className={`uppercase text-center font-bold py-3 bg-default text-default ${className || ''}`}
                style={{ borderTopColor: color }}
            >
                {title}
            </p>
            <div
                ref={drop}
                className="overflow-y-scroll"
                style={{height: 'calc(100vh - 151px)'}}
            >
                <div className="py-3">
                    {children}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Component;