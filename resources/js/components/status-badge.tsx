import { cn } from '@/lib/utils';
import type { Status } from '@/types/backend';

export function StatusBadge({ status }: { status: Status }) {
    return (
        <span
            className={cn(
                'rounded-md border px-2 py-0.5 text-sm',
                {
                    'To do': [
                        'border-green-200 bg-green-50 text-green-600',
                        'dark:border-green-800 dark:bg-green-950 dark:text-green-200',
                    ],
                    'In progress': [
                        'border-yellow-200 bg-yellow-50 text-yellow-600',
                        'dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
                    ],
                    'Done': [
                        'border-purple-200 bg-purple-50 text-purple-600',
                        'dark:border-purple-800 dark:bg-purple-950 dark:text-purple-200',
                    ],
                }[status.name],
            )}
        >
            {status.name}
        </span>
    );
}
