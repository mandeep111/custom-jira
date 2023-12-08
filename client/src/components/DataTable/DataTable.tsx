import React from 'react';
import { Grid } from '../Grid';
import { ProgressBarTask } from '../ProgressBar';

interface Grid {
    id: number;
    image: string;
    name: string;
    barcode: string;
    price: number;
    productType: string;
}

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
    project: Project[];
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
    width: number;
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
    width: number;
    Cell?: (props: { row: { original: T } }) => JSX.Element;
}

const Component = ({ columns, project }: TableInformation) => {

    return (
        <React.Fragment>
            <table className="border-2 table-relative" width={'100%'}>
                <thead>
                    <tr>
                        <th className="p-3 m-3 text-center bg-neutral-200 dark:bg-zinc-950 ">
                            <Grid column={12} gap={1}>
                                {columns.map((column: TableColumn, index: number) => (
                                    (
                                        column.accessor === 'id' ? (
                                            <Grid.Column sm={1} md={1} lg={1} xl={1} xxl={1} key={index}>
                                                <div className="text">
                                                    <label htmlFor={column.accessor} className="px-2 py-1 cursor-pointer select-none">{column.Header}</label>
                                                </div>
                                            </Grid.Column>
                                        )
                                            : (
                                                <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2} key={index}>
                                                    <div className="text">
                                                        <label htmlFor={column.accessor} className="px-2 py-1 cursor-pointer select-none">{column.Header}</label>
                                                    </div>
                                                </Grid.Column>
                                            )
                                    )
                                ))}
                            </Grid>
                        </th>
                    </tr>

                </thead>
                <tbody>
                    {project.map((projects: Project, index: number) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td className="p-3 text-center">
                                    <Grid column={12} gap={1}>
                                        <Grid.Column sm={1} md={1} lg={1} xl={1} xxl={1}>
                                            <div className="text">
                                                <label className="px-2 py-1 cursor-pointer select-none">{projects.id}</label>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2} key={index}>
                                            <div className="text">
                                                <label className="px-2 py-1 cursor-pointer select-none">{projects.name}</label>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2} key={index}>
                                            <div className="text">
                                                <label className="px-2 py-1 cursor-pointer select-none">{projects.spaceName}</label>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2} key={index}>
                                            <div className="text">

                                                <label className="px-2 py-1 cursor-pointer select-none">{projects.tasks?.length}</label>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2} key={index}>
                                            <div className="text">
                                                <label className="px-2 py-1 cursor-pointer select-none">{projects.userName}</label>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2} key={index}>
                                            <ProgressBarTask progress={projects.progress ?? 0} />
                                        </Grid.Column>
                                        <Grid.Column sm={1} md={1} lg={1} xl={1} xxl={1}>
                                            <div className="text">
                                                <label className="px-2 py-1 cursor-pointer select-none">{projects.id}</label>
                                            </div>
                                        </Grid.Column>
                                    </Grid>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

        </React.Fragment >
    );
};

export default Component;