import { cn } from '@/lib/utils';
import type { Tag } from '@/types/backend';
import { X } from 'lucide-react';

export function TagBadge(props: { tag: Tag; onDeleteClick?: () => void }) {
    return (
        <span
            className={cn(
                'bg-neutral-200 dark:bg-neutral-800',
                'border border-neutral-300 dark:border-neutral-600',
                'rounded-md px-1 text-sm',
                'flex items-center gap-1',
            )}
        >
            {props.tag.name}
            {props.onDeleteClick && (
                <X
                    size={16}
                    className="cursor-pointer hover:opacity-75"
                    onClick={props.onDeleteClick}
                />
            )}
        </span>
    );
}
