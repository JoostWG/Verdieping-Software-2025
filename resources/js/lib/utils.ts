import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function typedEntries<T extends object, K extends keyof T>(o: T): [K, T[K]][] {
    return Object.entries(o) as [K, T[K]][];
}
