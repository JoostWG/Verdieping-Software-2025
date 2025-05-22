import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Project } from '@/types/models';
import { Head, Link } from '@inertiajs/react';
import { Table } from '@radix-ui/themes';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { FormEvent, useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projecten',
        href: route('projects.index'),
    },
];

function CreateProjectDialog(props: { onProjectCreate: (project: Project) => void }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (open) {
            setName('');
            setError('');
            setProcessing(false);
        }
    }, [open]);

    function submit(event: FormEvent) {
        event.preventDefault();

        setProcessing(true);

        axios
            .post<Project>(route('projects.store'), { name })
            .then(({ data }) => {
                props.onProjectCreate(data);
                setOpen(false);
            })
            .catch((error) => {
                setProcessing(false);

                if (error instanceof AxiosError && error.status === 422 && error.response?.data?.message) {
                    setError(error.response.data.message);
                    return;
                }

                if (error) setError('Er is iets fout gegaan.');

                throw error;
            });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="m-2">
                    Nieuw project
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Maak een nieuw project aan</DialogTitle>
                <DialogDescription>Maak een nieuw project aan. Kies een naam die uniek is.</DialogDescription>
                <form className="space-y-6" onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="sr-only">
                            Naam
                        </Label>

                        <Input id="name" name="name" value={name} readOnly={processing} onChange={(e) => setName(e.target.value)} />

                        <InputError message={error} />
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">Annuleren</Button>
                        </DialogClose>

                        <Button variant="default" asChild disabled={processing}>
                            <button type="submit">Aanmaken</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function ProjectIndex(props: { projects: Project[] }) {
    const [projects, setProjects] = useState<Project[]>([...props.projects]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />

            <CreateProjectDialog onProjectCreate={(project) => setProjects([...projects, project])} />

            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Naam</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Aangemaakt</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {projects.map((project) => (
                        <Table.Row key={project.id}>
                            <Table.Cell>
                                <Link href={route('projects.show', [project])}>{project.name}</Link>
                            </Table.Cell>
                            <Table.Cell title={dayjs(project.created_at).format('LLLL')}>{dayjs(project.created_at).fromNow()}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </AppLayout>
    );
}
