import { useState } from 'react';

export function useArrayState<T extends object>(
    items: T[],
    key: (item: T) => string | number,
): [
    state: T[],
    modifiers: [
        add: (item: T) => void,
        update: (item: T, fields: Partial<T>) => void,
        remove: (item: T) => void,
    ],
    setState: React.Dispatch<React.SetStateAction<T[]>>,
] {
    const [state, setState] = useState(items);

    return [
        state,
        [
            (item: T) => {
                setState([...state, item]);
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
