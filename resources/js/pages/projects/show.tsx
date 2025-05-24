import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Project, Task } from '@/types/models';
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

            <div className="grid gap-4 p-4">
                <h1 className="text-2xl">{props.project.name}</h1>

                <TaskList tasks={props.project.tasks} />
            </div>
        </AppLayout>
    );
}

function TaskList(props: { tasks?: Task[] }) {
    if (!props.tasks) {
        return <div>Er ging iets mis bij het laden van de taken.</div>;
    }

    if (!props.tasks.length) {
        return <div>Dit project heeft geen taken.</div>;
    }

    return (
        <div className="divide-y rounded-md border">
            {props.tasks.map((task) => (
                <div className="p-2">
                    <div className="flex gap-1">
                        <div className="text-neutral-400">#{task.nr}</div>
                        <div>{task.title}</div>
                    </div>
                    <div className="text-sm text-neutral-500">{task.description}</div>
                </div>
            ))}
        </div>
    );
}
