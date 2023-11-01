import React from 'react';
import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';
import { getToken } from '../../redux/Authentication/selectors';
import { SubTask } from '../../types/SubTask';

interface TodoItem {
    index: number;
    subTask: SubTask;
    // setItems: React.Dispatch<React.SetStateAction<SubTask[]>>;
    // fetchingData: () => Promise<void>;
}

interface Dragged {
    index: number;
    subTask: SubTask;
    type: string;
}

const Component: React.FunctionComponent<TodoItem> = ({ subTask, index }) => {

    const ref = React.useRef<HTMLDivElement>(null);
    const [dialogTaskDetailOpen, setDialogTaskDetailOpen] = React.useState<boolean>(false);

    const [{ isDragging }, drag] = useDrag<Dragged, void, { isDragging: boolean }>({
        type: 'Our first type',
        item: { index, subTask, type: 'Our first type' },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const opacity = isDragging ? 0.4 : 1;


    const mouseDownHandler = () => {
        if (ref.current) {
            ref.current.style.cursor = 'grabbing';
            ref.current.style.userSelect = 'none';
        }
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = () => {
        if (ref.current) {
            ref.current.style.cursor = 'grab';
        }
    };

    const mouseUpHandler = () => {
        if (ref.current) {
            ref.current.style.cursor = 'grab';
            ref.current.style.removeProperty('user-select');
        }
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    return (
        <React.Fragment>
            <div
                ref={ref}
                className="mx-3 mb-2 px-6 py-3 bg-default border border-default rounded-lg"
                onMouseUp={mouseUpHandler}
                onMouseDown={mouseDownHandler}
                style={{ opacity }}
                onClick={() => setDialogTaskDetailOpen(true)}
            >
                <div className="grid grid-rows-1 grid-flow-col gap-12  border-b dark:border-default bg-default ">
                    <div className=" grid-cols-1  justify-items-start   items-center mb-5">
                        <h5 className="text-sm text-default ml-3">{'TaskName : '}{subTask.taskName}</h5>
                    </div>
                    <div className="grid grid-cols-1 justify-items-end">
                        <div className="flex">
                            <span
                                className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-yellow-500 border border-zinc-300 align-middle items-center flex text-center justify-center text-zinc-50 font-bold"
                                title={subTask.assignee!.fullName}
                            >
                                {subTask.assignee!.fullName?.toUpperCase().charAt(0)}
                            </span>
                            <p className="p-1">{subTask.assignee!.fullName?.toUpperCase()}</p>
                        </div>

                    </div>
                </div>
                <div className="flex items-center mb-5 mt-2">
                    <span className="p-1.5 w-0 rounded-full flex" style={{ backgroundColor: subTask.color }}></span>
                    <h5 className="text-sm text-default ml-3">{'SubTaskName : '}{subTask.name}</h5>
                </div>
                <div className=" mb-5 items-center">
                    <h5 className="text-sm text-default ml-3">{'Status : '}{subTask.status}</h5>
                </div>
                <div className="items-center mb-5">
                    <p className="mb-2 text-sm text-default">{new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(subTask.start!))}</p>
                </div>


            </div>
            {/* <FormTaskDetail isOpen={dialogTaskDetailOpen} setIsOpen={setDialogTaskDetailOpen} item={task} setItem={setItems} fetchingData={fetchingData} /> */}
        </React.Fragment>
    );
};

export default Component;