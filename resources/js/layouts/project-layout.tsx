import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';
import type { Project } from '@/types/backend';
import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import AppLayout from './app-layout';

interface Tab {
    label: string;
    route: string;
}

export default function ProjectLayout({
    children,
    project,
    ...props
}: {
    children: ReactNode;
    project: Project;
}) {
    const tabs: Tab[] = [
        {
            label: 'Taken',
            route: 'projects.show',
        },
        {
            label: 'Tags',
            route: 'projects.tags',
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Projecten',
            href: route('projects.index'),
        },
        {
            title: project.name,
            href: route('projects.show', [project]),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} {...props}>
            <Head title={project.name} />

            <div className="flex items-center gap-2 p-4">
                {tabs.map((tab) => (
                    <Link
                        key={tab.label}
                        href={route(tab.route, [project])}
                        className={cn(
                            'bg-secondary rounded-md p-2',
                            route().current(tab.route)
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:opacity-75',
                        )}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>

            {children}
        </AppLayout>
    );
}
