import { Disclosure } from '@headlessui/react';
import { ArrowRightCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DataTableSubTask } from '.';
import { Alert } from '../Alert';
import { PopoverColor } from '../Popover';

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
    // tableName: string;
    columns: TableColumn[];
    // fetchingData: () => Promise<void>;
    task: Task[];
}

/**
 * Represents optional customization options for a table.
 *
 * @interface TableOptions
 * @property {{ isEnabled: boolean; url: string; }} [buttonNew] - Configuration for the "New" button (optional).
 * @property {{ isEnabled: boolean; }} [buttonGrid] - Configuration for the "Grid View" button (optional).
 * @property {{ isEnabled: boolean; }} [buttonList] - Configuration for the "List View" button (optional).
 * @property {{ isEnabled: boolean; }} [buttonFilters] - Configuration for the "Filters" button (optional).
 * @property {{ isEnabled: boolean; }} [buttonGroupBy] - Configuration for the "Group By" button (optional).
 * @property {{ isEnabled: boolean; }} [buttonFavorite] - Configuration for the "Favorite" button (optional).
 * @property {{ isEnabled: boolean; }} [selectPageSize] - Configuration for the page size selector (optional).
 * @property {{ isEnabled: boolean; }} [inputSearch] - Configuration for the search input (optional).
 * @property {{ isEnabled: boolean; }} [filterData] - Configuration for data filtering (optional).
 * @property {{ isEnabled: boolean; }} [paginate] - Configuration for pagination (optional).
 * @property {{ isEnabled: boolean; }} [pageNumber] - Configuration for page number display (optional).
 * @property {boolean} [serverSide] - Indicates whether server-side data processing is enabled (optional).
 */
export interface TableOptions {
    buttonNew?: { isEnabled: boolean; url: string; };
    buttonGrid?: { isEnabled: boolean; };
    buttonList?: { isEnabled: boolean; };
    buttonFilters?: { isEnabled: boolean; };
    buttonGroupBy?: { isEnabled: boolean; };
    buttonFavorite?: { isEnabled: boolean; };
    selectPageSize?: { isEnabled: boolean; };
    inputSearch?: { isEnabled: boolean; };
    filterData?: { isEnabled: boolean; };
    paginate?: { isEnabled: boolean; };
    pageNumber?: { isEnabled: boolean; };
    defaultFilter: number[];
    serverSide?: boolean;
}

/**
 * Represents options for fetching paginated data.
 *
 * @interface FetchingDataOptions
 * @property {number} pageNo - The page number to retrieve data for.
 * @property {number} pageSize - The number of items per page.
 * @property {string} sortBy - The field to sort the data by.
 * @property {string} sortDir - The sorting direction (e.g., "asc" or "desc").
 * @property {string} searchData - The search query or filter criteria.
 */
export interface FetchingDataOptions {
    pageNo: number;
    pageSize: number;
    sortBy: string;
    sortDir: string;
    searchData: string;
}

/**
 * Represents a table column definition.
 *
 * @interface TableColumn
 * @property {string} Header - The display name or header text for the column.
 * @property {string} accessor - The key or accessor path to the data associated with the column.
 */
export interface TableColumn {
    Header: string;
    accessor: string;
}

/**
 * Represents a table column definition that includes a custom Cell renderer.
 *
 * @interface TableColumnWithCell
 * @template T - The type of data associated with the column.
 * @property {string} Header - The display name or header text for the column.
 * @property {string} accessor - The key or accessor path to the data associated with the column.
 * @property {(props: { row: { original: T } }) => JSX.Element} [Cell] - A custom Cell renderer function.
 */
export interface TableColumnWithCell<T> {
    Header: string;
    accessor: string;
    Cell?: (props: { row: { original: T } }) => JSX.Element;
}

const Component = ({ columns, task }: TableInformation) => {

    return (
        <React.Fragment>
            <table className="border-2 table-relative text-default" width={'100%'}>
                <thead>
                    <tr className="text-center bg-neutral-200 dark:bg-zinc-950">
                        <th colSpan={2}>{'TASK'}</th>
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
                    {task.length !== 0 ? (
                        <DndProvider backend={HTML5Backend}>
                            {task.map((tasks: Task, index: number) => (
                                <React.Fragment key={index}>
                                    <Disclosure >
                                        {({ open }) => (
                                            <React.Fragment>
                                                <tr>
                                                    <td className="p-3 text-center">
                                                        <Disclosure.Button>
                                                            <ArrowRightCircleIcon className={`${open ? 'rotate-90 transform' : ''}     inline-flex icon-x24 text-default ml-1`} />
                                                        </Disclosure.Button>
                                                    </td>
                                                    <td className="p-3 text-center "> <PopoverColor color={tasks.color} /></td>
                                                    <td className="p-3 text-center">
                                                        <div className="text">
                                                            <label className="px-2 py-1 cursor-pointer select-none">{index + 1}</label>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-start">
                                                        <div className="text">
                                                            <label className="px-2 py-1 cursor-pointer select-none">{tasks.name}</label>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="flex mt-2 -space-x-3 ">
                                                            {tasks?.assignee.slice(0, 5).map((data, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-zinc-400 border border-zinc-300 align-middle items-center flex text-center justify-center text-zinc-100 font-bold"
                                                                    title={data.fullName}
                                                                >
                                                                    {data.fullName?.toUpperCase().charAt(0)}
                                                                </span>
                                                            ))}
                                                            {Array.isArray(tasks?.assignee) && tasks?.assignee.length > 5 && (
                                                                <span
                                                                    className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-indigo-400 border border-indigo-300 align-middle items-center flex text-center justify-center text-indigo-100 font-bold"
                                                                    title={tasks.assignee.slice(5).map((item) => item.fullName).join(', ')}
                                                                >
                                                                    {'+'}{tasks.assignee.length - 5}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <div className="text">

                                                            <label className="px-2 py-1 cursor-pointer select-none">{tasks.subTasks?.length}</label>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <div className="text">
                                                            <p className="mb-2 mr-3 text-sm text-default">
                                                                {new Intl.DateTimeFormat('en-US').format(new Date(tasks.start!))}
                                                            </p>

                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <div className="text">
                                                            <p className="mb-2 text-sm text-default">
                                                                {new Intl.DateTimeFormat('en-US').format(new Date(tasks.end!))}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        {tasks.progress && (
                                                            <div className="flex items-center justify-center">
                                                                <div className="w-48  bg-default-faded rounded-full h-2.5">
                                                                    <div
                                                                        className={`h-2.5 rounded-full ${tasks.progress <= 19
                                                                            ? 'bg-zinc-300'
                                                                            : tasks.progress >= 20 && tasks.progress <= 39
                                                                                ? 'bg-purple-300'
                                                                                : tasks.progress >= 40 && tasks.progress <= 59
                                                                                    ? 'bg-indigo-300'
                                                                                    : tasks.progress >= 60 && tasks.progress <= 79
                                                                                        ? 'bg-sky-300'
                                                                                        : tasks.progress >= 80 && tasks.progress <= 99
                                                                                            ? 'bg-teal-300' : tasks.progress >= 100
                                                                                                ? 'bg-green-300' : ''}`
                                                                        } style={{ width: `${tasks.progress}%` }}>
                                                                    </div>
                                                                </div>
                                                                <p className="text-sm text-default">{`${tasks.progress.toFixed(2)}%`}</p>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="text">
                                                            <label className="px-2 py-1 cursor-pointer select-none">{tasks.taskStageName}</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={10}>
                                                        <Disclosure.Panel>
                                                            <React.Fragment>
                                                                <DataTableSubTask subTask={tasks.subTasks!} />
                                                            </React.Fragment>
                                                        </Disclosure.Panel>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        )}
                                    </Disclosure>
                                </React.Fragment>

                            ))}
                        </DndProvider>
                    ) : (
                        <tr>
                            <td className="p-3 text-center text-default" colSpan={10}>
                                <Alert icon={<InformationCircleIcon className="mr-2 icon-x20" />} message={'There are no tasks.'} />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </React.Fragment >
    );
};

export default Component;