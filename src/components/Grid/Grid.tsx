import React from 'react';
import PropTypes from 'prop-types';

interface GridProps extends React.HTMLProps<HTMLDivElement> {
    column: number;
    gap: number;
}

interface ColumnProps extends React.HTMLProps<HTMLDivElement> {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
}

const Component: React.FunctionComponent<GridProps> & { Column: React.FunctionComponent<ColumnProps> } = (props) => {

    let column = '';
    switch (props.column) {
        case 1:
            column = 'grid-cols-1';
            break;
        case 2:
            column = 'grid-cols-2';
            break;
        case 3:
            column = 'grid-cols-3';
            break;
        case 4:
            column = 'grid-cols-4';
            break;
        case 5:
            column = 'grid-cols-5';
            break;
        case 6:
            column = 'grid-cols-6';
            break;
        case 7:
            column = 'grid-cols-7';
            break;
        case 8:
            column = 'grid-cols-8';
            break;
        case 9:
            column = 'grid-cols-9';
            break;
        case 10:
            column = 'grid-cols-10';
            break;
        case 11:
            column = 'grid-cols-11';
            break;
        case 12:
            column = 'grid-cols-12';
            break;
        default:
            break;
    }

    let gap = '';
    switch (props.gap) {
        case 1:
            gap = 'gap-1';
            break;
        case 2:
            gap = 'gap-2';
            break;
        case 3:
            gap = 'gap-3';
            break;
        case 4:
            gap = 'gap-4';
            break;
        case 5:
            gap = 'gap-5';
            break;
        case 6:
            gap = 'gap-6';
            break;
        case 7:
            gap = 'gap-7';
            break;
        case 8:
            gap = 'gap-8';
            break;
        case 9:
            gap = 'gap-9';
            break;
        case 10:
            gap = 'gap-10';
            break;
        case 11:
            gap = 'gap-11';
            break;
        case 12:
            gap = 'gap-12';
            break;
        default:
            break;
    }

    return (
        <div className={`grid gap ${column} ${gap} ${props.className || ''}`} style={props.style}>
            {props.children}
        </div>
    );
};

const Column: React.FunctionComponent<ColumnProps> = (props) => {

    let smallScreen = '';
    let mediumScreen = '';
    let largeScreen = '';
    let extraLargeScreen = '';
    let extraExtraLargeScreen = '';

    switch (props.sm) {
        case 1:
            smallScreen = 'sm:col-span-1';
            break;
        case 2:
            smallScreen = 'sm:col-span-2';
            break;
        case 3:
            smallScreen = 'sm:col-span-3';
            break;
        case 4:
            smallScreen = 'sm:col-span-4';
            break;
        case 5:
            smallScreen = 'sm:col-span-5';
            break;
        case 6:
            smallScreen = 'sm:col-span-6';
            break;
        case 7:
            smallScreen = 'sm:col-span-7';
            break;
        case 8:
            smallScreen = 'sm:col-span-8';
            break;
        case 9:
            smallScreen = 'sm:col-span-9';
            break;
        case 10:
            smallScreen = 'sm:col-span-10';
            break;
        case 11:
            smallScreen = 'sm:col-span-11';
            break;
        case 12:
            smallScreen = 'sm:col-span-12';
            break;
        default:
            break;
    }

    switch (props.md) {
        case 1:
            mediumScreen = 'md:col-span-1';
            break;
        case 2:
            mediumScreen = 'md:col-span-2';
            break;
        case 3:
            mediumScreen = 'md:col-span-3';
            break;
        case 4:
            mediumScreen = 'md:col-span-4';
            break;
        case 5:
            mediumScreen = 'md:col-span-5';
            break;
        case 6:
            mediumScreen = 'md:col-span-6';
            break;
        case 7:
            mediumScreen = 'md:col-span-7';
            break;
        case 8:
            mediumScreen = 'md:col-span-8';
            break;
        case 9:
            mediumScreen = 'md:col-span-9';
            break;
        case 10:
            mediumScreen = 'md:col-span-10';
            break;
        case 11:
            mediumScreen = 'md:col-span-11';
            break;
        case 12:
            mediumScreen = 'md:col-span-12';
            break;
        default:
            break;
    }

    switch (props.lg) {
        case 1:
            largeScreen = 'lg:col-span-1';
            break;
        case 2:
            largeScreen = 'lg:col-span-2';
            break;
        case 3:
            largeScreen = 'lg:col-span-3';
            break;
        case 4:
            largeScreen = 'lg:col-span-4';
            break;
        case 5:
            largeScreen = 'lg:col-span-5';
            break;
        case 6:
            largeScreen = 'lg:col-span-6';
            break;
        case 7:
            largeScreen = 'lg:col-span-7';
            break;
        case 8:
            largeScreen = 'lg:col-span-8';
            break;
        case 9:
            largeScreen = 'lg:col-span-9';
            break;
        case 10:
            largeScreen = 'lg:col-span-10';
            break;
        case 11:
            largeScreen = 'lg:col-span-11';
            break;
        case 12:
            largeScreen = 'lg:col-span-12';
            break;
        default:
            break;
    }

    switch (props.xl) {
        case 1:
            extraLargeScreen = 'xl:col-span-1';
            break;
        case 2:
            extraLargeScreen = 'xl:col-span-2';
            break;
        case 3:
            extraLargeScreen = 'xl:col-span-3';
            break;
        case 4:
            extraLargeScreen = 'xl:col-span-4';
            break;
        case 5:
            extraLargeScreen = 'xl:col-span-5';
            break;
        case 6:
            extraLargeScreen = 'xl:col-span-6';
            break;
        case 7:
            extraLargeScreen = 'xl:col-span-7';
            break;
        case 8:
            extraLargeScreen = 'xl:col-span-8';
            break;
        case 9:
            extraLargeScreen = 'xl:col-span-9';
            break;
        case 10:
            extraLargeScreen = 'xl:col-span-10';
            break;
        case 11:
            extraLargeScreen = 'xl:col-span-11';
            break;
        case 12:
            extraLargeScreen = 'xl:col-span-12';
            break;
        default:
            break;
    }

    switch (props.xxl) {
        case 1:
            extraExtraLargeScreen = 'xxl:col-span-1';
            break;
        case 2:
            extraExtraLargeScreen = 'xxl:col-span-2';
            break;
        case 3:
            extraExtraLargeScreen = 'xxl:col-span-3';
            break;
        case 4:
            extraExtraLargeScreen = 'xxl:col-span-4';
            break;
        case 5:
            extraExtraLargeScreen = 'xxl:col-span-5';
            break;
        case 6:
            extraExtraLargeScreen = 'xxl:col-span-6';
            break;
        case 7:
            extraExtraLargeScreen = 'xxl:col-span-7';
            break;
        case 8:
            extraExtraLargeScreen = 'xxl:col-span-8';
            break;
        case 9:
            extraExtraLargeScreen = 'xxl:col-span-9';
            break;
        case 10:
            extraExtraLargeScreen = 'xxl:col-span-10';
            break;
        case 11:
            extraExtraLargeScreen = 'xxl:col-span-11';
            break;
        case 12:
            extraExtraLargeScreen = 'xxl:col-span-12';
            break;
        default:
            break;
    }

    return (
        <div className={`col-span-12 ${smallScreen} ${mediumScreen} ${largeScreen} ${extraLargeScreen} ${extraExtraLargeScreen} ${props.className || ''}`}>
            {props.children}
        </div>
    );
};

Component.Column = Column;
Component.propTypes = {
    column: PropTypes.number.isRequired,
    gap: PropTypes.number.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
};

export { Column };

export default Component;
