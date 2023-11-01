import React from 'react';
import { ScaleLoader } from 'react-spinners';

interface Props {
    color?: string,
    width?: number,
    height?: number,
    margin?: number,
    styles?: object
}

const Component: React.FunctionComponent<Props> = ({ color = '#368ed6', margin = 5, styles = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' } }: Props) => {

    return (
        <div style={styles}>
            <React.Fragment>
                <ScaleLoader
                    color={color}
                    margin={margin}
                />
            </React.Fragment>
        </div>
    );
};

export default Component;