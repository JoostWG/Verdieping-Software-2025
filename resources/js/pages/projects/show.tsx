import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Project } from '@/types/models';
import { Head } from '@inertiajs/react';

export default function ProjectIndex(props: { project: Project }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Projecten',
            href: route('projects.index'),
        },
        {
            title: props.project.name,
            href: route('projects.show', [props.project]),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={props.project.name} />

            <div className="p-4">
                <h1 className="text-2xl">sss</h1>
            </div>
        </AppLayout>
    );
}
