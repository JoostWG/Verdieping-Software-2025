import { router } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import type { VisitOptions } from 'node_modules/@inertiajs/core/types/types';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function typedEntries<T extends object, K extends keyof T>(o: T): [K, T[K]][] {
    return Object.entries(o) as [K, T[K]][];
}

export function visitParams(params: URLSearchParams, options?: VisitOptions) {
    router.visit(`${location.origin}${location.pathname}?${params.toString()}`, options);
}

export function filterMultiple(pairs: Record<string, string>, options?: VisitOptions) {
    const params = new URLSearchParams(location.search);

    for (const [key, value] of Object.entries(pairs)) {
        if (value === null) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
    }

    visitParams(params, { replace: true, ...(options ?? {}) });
}
