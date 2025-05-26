import { cn } from '@/lib/utils';
import type { Tag } from '@/types/backend';

export function TagBadge(props: { tag: Tag }) {
    return (
        <span
            className={cn(
                'bg-neutral-200 dark:bg-neutral-800',
                'border border-neutral-300 dark:border-neutral-600',
                'rounded-md px-1 text-sm',
            )}
        >
            {props.tag.name}
        </span>
    );
}
