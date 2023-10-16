import React from 'react';

/**
 * Represents a callback function for handling input change events in React components.
 * This function is typically used as an event handler for 'onChange' events on HTML input elements.
 *
 * @param {React.ChangeEvent<HTMLInputElement>} event - The `React.ChangeEvent<HTMLInputElement>` object representing the input change event.
 *  This object contains information about the input change event, such as the target input element, new value, etc.
 *  It allows the function to access relevant properties and react to the change event appropriately.
 *
 * @param {React.Dispatch<React.SetStateAction<T>>} setState - The `React.Dispatch` function from React's `useState` hook.
 *  It is used to update the state with the new input value of type `T`.
 *  This function can be called to set the new state value, which will cause the component to re-render with the updated value.
 *
 * @param {number | null} [index] - An optional parameter that represents the index of the item being updated if `T` is an array type.
 *  If `T` is an array type, this parameter can be used to specify the index of the item that needs to be updated in the state array.
 *  It can be omitted or set to `null` when `T` is not an array type.
 *
 * @returns {void} - This function does not return any value.
 *  It is typically used to handle input change events and update the state with the new input value.
 *
 * @template T - The type of the state value that will be updated with the new input value.
 * 
 */
export interface InputChangeHandler<T = any> {
    (event: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<T>>, index?: number | null): void;
}

const useInputChange = <T = unknown>(): InputChangeHandler<T> => {
    
    const handleInputChange: InputChangeHandler<T> = (event: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<T>>, index?: number | null): void => {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        const { id, value }: { id: string; value: string } = target;

        if (index === undefined || index === null) {
            setState((prevState: T) => ({
                ...prevState,
                [id]: value,
            }));
        } else {
            setState((prevState: T | T[]) => {
                if (Array.isArray(prevState)) {
                    const updatedData: T[] = [...prevState];
                    updatedData[index] = {
                        ...updatedData[index],
                        [id]: value,
                    };
                    return updatedData as T;
                } else {
                    return {
                        ...prevState,
                        [id]: value,
                    } as T;
                }
            });
        }
    };

    return handleInputChange;
};

export default useInputChange;