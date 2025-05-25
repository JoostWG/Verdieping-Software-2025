import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Project } from '@/types/backend';
import { Head } from '@inertiajs/react';

export default function ProjectShow(props: { project: Project }) {
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

            <div className="grid gap-4 p-4">
                <h1 className="text-2xl">{props.project.name}</h1>

                {!props.project.tasks ? (
                    <div>Er ging iets mis bij het laden van de taken.</div>
                ) : !props.project.tasks.length ? (
                    <div>Dit project heeft geen taken.</div>
                ) : (
                    <div className="divide-y rounded-md border">
                        {props.project.tasks.map((task) => (
                            <div key={task.id} className="p-2">
                                <div className="flex gap-1">
                                    <div className="text-neutral-400">#{task.nr}</div>
                                    <div>{task.title}</div>
                                </div>
                                <div className="text-sm text-neutral-500">{task.description}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
