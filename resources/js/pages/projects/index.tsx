import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Project } from '@/types/models';
import { Head } from '@inertiajs/react';
import { Table } from '@radix-ui/themes';
import dayjs from 'dayjs';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projecten',
        href: route('projects.index'),
    },
];

export default function ProjectIndex(props: { projects: Project[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />

            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Naam</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Aangemaakt op</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {props.projects.map((project) => (
                        <Table.Row>
                            <Table.Cell>{project.name}</Table.Cell>
                            <Table.Cell>{dayjs(project.created_at).format('LLLL')}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </AppLayout>
    );
}
