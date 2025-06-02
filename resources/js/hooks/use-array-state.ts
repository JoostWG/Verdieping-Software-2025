import { useState } from 'react';

export type ArrayStateModifiers<T> = [
    add: (item: T) => void,
    update: (item: T, fields: Partial<T>) => void,
    remove: (item: T) => void,
];

export type ArrayState<T> = [
    state: T[],
    modifiers: ArrayStateModifiers<T>,
    setState: React.Dispatch<React.SetStateAction<T[]>>,
];

export function useArrayState<T>(
    items: T[],
    key: (item: T) => string | number,
    options?: {
        addToBeginningOfArray: boolean;
    },
): ArrayState<T> {
    const [state, setState] = useState(items);

    return [
        state,
        [
            (item: T) => {
                setState(options?.addToBeginningOfArray ? [item, ...state] : [...state, item]);
            },
            (item: T, fields: Partial<T>) => {
                setState(
                    state.map((otherItem) =>
                        key(item) === key(otherItem) ? { ...otherItem, ...fields } : otherItem,
                    ),
                );
            },
            (item: T) => {
                setState(state.filter((otherItem) => key(item) !== key(otherItem)));
            },
        ],
        setState,
    ];
}
