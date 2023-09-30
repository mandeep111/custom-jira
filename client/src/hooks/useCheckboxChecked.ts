import React from 'react';

/**
 * Represents a callback function for handling change events on <input type="checkbox"> elements in React components.
 *
 * @param {React.ChangeEvent<HTMLInputElement>} event - The `React.ChangeEvent<HTMLInputElement>` object representing the change event on the <input> element.
 *  This object contains information about the change event, such as the target <input> element, new value, etc.
 *  It allows the function to access relevant properties and react to the change event appropriately.
 *
 * @param {React.Dispatch<React.SetStateAction<T>>} setState - The `React.Dispatch` function from React's `useState` hook.
 *  It is used to update the state with the new input value of type `T`.
 *  This function can be called to set the new state value, which will cause the component to re-render with the updated value.
 *
 * @returns {void} - This function does not return any value.
 *  It is typically used to handle change events on <input type="checkbox"> elements and update the state with the selected value.
 *
 * @template T - The type of the state value that will be updated with the selected value.
 */
export interface CheckboxCheckedHandler<T = any> {
    (event: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<T>>, index?: number): void;
}

const useCheckboxChecked = <T = unknown>(): CheckboxCheckedHandler<T> => {

    const handleCheckboxChecked: CheckboxCheckedHandler<T> = (event: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<T>>, index?: number): void => {
        const { id, checked }: { id: string, checked: boolean } = event.target;
        const isCheckbox: boolean = event.target.type === 'checkbox';
        const newValue: boolean = isCheckbox ? event.target.checked : checked;

        if (index === undefined || index === null) {
            setState((prevState: T) => ({
                ...prevState,
                [id]: newValue
            }));
        } else {
            setState((prevState: T | T[]) => {
                if (Array.isArray(prevState)) {
                    const updatedData: T[] = [...prevState];
                    updatedData[index] = {
                        ...updatedData[index],
                        [id]: newValue,
                    };
                    return updatedData as T;
                } else {
                    return {
                        ...prevState,
                        [id]: newValue,
                    } as T;
                }
            });
        }

    };

    return handleCheckboxChecked;

};

export default useCheckboxChecked;