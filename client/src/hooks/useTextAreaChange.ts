import React from 'react';

/**
 * Represents a callback function for handling change events on <textarea> elements in React components.
 *
 * @param {React.ChangeEvent<HTMLTextAreaElement>} event - The `React.ChangeEvent<HTMLTextAreaElement>` object representing the change event on the <textarea> element.
 *  This object contains information about the change event, such as the target <textarea> element, new value, etc.
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
 *  It is typically used to handle change events on <textarea> elements and update the state with the new input value.
 *
 * @template T - The type of the state value that will be updated with the new input value.
 *
 */
export interface TextAreaChangeHandler<T = any> {
    (event: React.ChangeEvent<HTMLTextAreaElement>, setState: React.Dispatch<React.SetStateAction<T>>, index?: number | null): void;
}

const useTextAreaChange = <T = unknown>(): TextAreaChangeHandler<T> => {

    const handleTextAreaChange: TextAreaChangeHandler<T> = (event: React.ChangeEvent<HTMLTextAreaElement>, setState: React.Dispatch<React.SetStateAction<T>>, index?: number | null) => {
        const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
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
    return handleTextAreaChange;
};

export default useTextAreaChange;