import React from 'react';

/**
 * Represents a function signature for creating a controlled input value with a debounce delay.
 *
 * @interface Props
 * @param {string} initialValue - The initial value for the controlled input.
 * @param {number} delay - The debounce delay in milliseconds for updating the controlled input value.
 * @returns {[string, (value: string) => void]} - A tuple containing the current controlled input value and
 * a function to update the controlled input value with debouncing.
 */
interface Props {
    (initialValue: string, delay: number): [string, (value: string) => void];
}

/**
 * Custom hook for creating a controlled input value with debounce behavior.
 *
 * This hook manages a controlled input value with a specified debounce delay. It returns a tuple
 * containing the current controlled input value and a function to update the controlled input value
 * with debouncing.
 *
 * @function useDebounce
 * @param {string} initialValue - The initial value for the controlled input.
 * @param {number} delay - The debounce delay in milliseconds for updating the controlled input value.
 * @returns {[string, (value: string) => void]} - A tuple containing the current controlled input value and
 * a function to update the controlled input value with debouncing.
 */
const useDebounce: Props = (initialValue: string = '', delay: number): [string, (value: string) => void] => {

    const [actualValue, setActualValue] = React.useState(initialValue);
    const [debounceValue, setDebounceValue] = React.useState(initialValue);

    React.useEffect(() => {
        const debounceId: NodeJS.Timeout = setTimeout(() => setDebounceValue(actualValue), delay);
        return () => clearTimeout(debounceId);
    }, [actualValue, delay]);

    return [debounceValue, setActualValue];
};


export default useDebounce;