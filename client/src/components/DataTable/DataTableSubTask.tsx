import { InformationCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Alert } from '../Alert';


/**
 * Represents information about a table used for displaying tabular data.
 *
 * @interface TableInformation
 * @property {string} tableName - The name or title of the table.
 * @property {TableColumn[]} columns - An array of table columns to define the structure of the table.
 * @property {() => Promise<void>} fetchingData - A function that fetches and updates data for the table.
 * @property {TableOptions} [options] - Additional options for customizing the table behavior (optional).
 */
interface TableInformation {
    subTask: Subtask[];
}


/**
 * Represents a table column definition.
 *
 * @interface TableColumn
 * @property {string} Header - The display name or header text for the column.
 * @property {string} accessor - The key or accessor path to the data associated with the column.
 */
interface TableColumn {
    Header: string;
    accessor: string;
}

const columns = [
    { Header: 'NO', accessor: 'no', },
    { Header: 'SUBTASK_NAME', accessor: 'name' },
    { Header: 'ASSIGNEES', accessor: 'assignee' },
    { Header: 'TASK_NAME', accessor: 'taskName' },
    { Header: 'START_DATE', accessor: 'start' },
    { Header: 'END_DATE', accessor: 'end' },
    { Header: 'STATUS', accessor: 'status' },
];

const Component = ({ subTask }: TableInformation) => {

    return (
        <React.Fragment>
            {subTask.length !== 0 ? (
                <table className="border-2 table-relative text-default" width={'100%'}>
                    <thead>
                        <tr className="text-center bg-green-200 dark:bg-zinc-950">
                            <th colSpan={2}>{'SUBTASK'}</th>
                            {columns.map((column: TableColumn, index: number) => (
                                <React.Fragment key={index}>
                                    <th className="p-3 m-3 ">
                                        <div className="text">
                                            <label htmlFor={column.accessor} className="px-2 py-1 cursor-pointer select-none">{column.Header}</label>
                                        </div>
                                    </th>
                                </React.Fragment>
                            ))}
                        </tr>

                    </thead>
                    <tbody>
                        {subTask.map((subTasks: Subtask, index: number) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td className="p-3 text-center" colSpan={2}>
                                    </td>
                                    <td className="p-3 text-center">
                                        <div className="text">
                                            <label className="px-2 py-1 cursor-pointer select-none">{index + 1}</label>
                                        </div>
                                    </td>
                                    <td className="p-3 text-start">
                                        <div className="text">
                                            <label className="px-2 py-1 cursor-pointer select-none">{subTasks.name}</label>
                                        </div>
                                    </td>
                                    <td className="items-center p-3">
                                        {subTasks.assignee && (
                                            <div className="flex justify-center grid-cols-1 overflow-hidden whitespace-nowrap">
                                                <span
                                                    className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-yellow-500 border border-zinc-300 align-middle items-center flex text-center justify-center text-zinc-50 font-bold"
                                                    title={subTasks.assignee.fullName}
                                                >
                                                    {subTasks.assignee.fullName?.toUpperCase().charAt(0)}
                                                </span>
                                                <p className="p-1">{subTasks.assignee.fullName?.toUpperCase()}</p>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-3 text-start">
                                        <div className="text">
                                            <label className="px-2 py-1 cursor-pointer select-none">{subTasks.taskName}</label>
                                        </div>
                                    </td>
                                    <td className="p-3 text-center">
                                        <div className="text">
                                            <p className="mb-2 mr-3 text-sm text-default">
                                                {new Intl.DateTimeFormat('en-US').format(new Date(subTasks.start!))}
                                            </p>

                                        </div>
                                    </td>
                                    <td className="p-3 text-center">
                                        <div className="text">
                                            <p className="mb-2 text-sm text-default">
                                                {new Intl.DateTimeFormat('en-US').format(new Date(subTasks.end!))}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-3 text-center">
                                        <div className="text">
                                            <label className="px-2 py-1 cursor-pointer select-none">{subTasks.status}</label>
                                        </div>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="p-3 text-center text-default">
                    <Alert icon={<InformationCircleIcon className="mr-2 icon-x20" />} message={'There are no SubTasks.'} />
                </div>
            )}
        </React.Fragment >
    );
};

export default Component;