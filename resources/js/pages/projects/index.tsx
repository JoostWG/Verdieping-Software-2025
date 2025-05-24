import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Project } from '@/types/models';
import { Head, Link } from '@inertiajs/react';
import { Table } from '@radix-ui/themes';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { TriangleAlert } from 'lucide-react';
import { FormEvent, JSX, useEffect, useReducer, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projecten',
        href: route('projects.index'),
    },
];

export default function ProjectIndex(props: { projects: Project[] }) {
    const [projects, dispatchProjectsReducer] = useReducer(
        (
            state,
            action:
                | { type: 'add'; project: Project }
                | { type: 'update'; projectId: Project['id']; fields: Partial<Project> }
                | { type: 'delete'; projectId: Project['id'] },
        ) => {
            switch (action.type) {
                case 'add':
                    return [...state, action.project];

                case 'update':
                    return state.map((project) =>
                        project.id === action.projectId
                            ? { ...project, ...action.fields }
                            : project,
                    );

                case 'delete':
                    return state.filter((project) => project.id !== action.projectId);

                default:
                    return state;
            }
        },
        props.projects,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />

            <ProjectDialog
                trigger={
                    <Button variant="default" className="m-2">
                        Nieuw project
                    </Button>
                }
                onChange={(project) => dispatchProjectsReducer({ type: 'add', project })}
            />

            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Naam</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Aangemaakt</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {projects.map((project) => (
                        <Table.Row key={project.id}>
                            <Table.Cell>
                                <Link href={route('projects.show', [project])}>{project.name}</Link>
                            </Table.Cell>
                            <Table.Cell title={dayjs(project.created_at).format('LLLL')}>
                                {dayjs(project.created_at).fromNow()}
                            </Table.Cell>
                            <Table.Cell>
                                <div className="flex gap-2">
                                    <ProjectDialog
                                        trigger={
                                            <Button variant="secondary" className="m-2">
                                                Wijzigen
                                            </Button>
                                        }
                                        project={project}
                                        onChange={(project) =>
                                            dispatchProjectsReducer({
                                                type: 'update',
                                                projectId: project.id,
                                                fields: project,
                                            })
                                        }
                                    />
                                    <ProjectDeleteConfirmationDialog
                                        trigger={
                                            <Button variant="destructive" className="m-2">
                                                Verwijderen
                                            </Button>
                                        }
                                        project={project}
                                        onDelete={() =>
                                            dispatchProjectsReducer({
                                                type: 'delete',
                                                projectId: project.id,
                                            })
                                        }
                                    />
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </AppLayout>
    );
}

function ProjectDialog(props: {
    trigger: JSX.Element;
    project?: Project;
    onChange: (project: Project) => void;
}) {
    const initialProjectName = props.project ? props.project.name : '';
    const [open, setOpen] = useState(false);
    const [projectName, setProjectName] = useState(initialProjectName);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (open) {
            setProjectName(initialProjectName);
            setError('');
            setIsProcessing(false);
        }
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    function submit(event: FormEvent) {
        event.preventDefault();

        setIsProcessing(true);

        (props.project
            ? axios.put<Project>(route('projects.update', [props.project]), { name: projectName })
            : axios.post<Project>(route('projects.store'), { name: projectName })
        )
            .then(({ data }) => {
                props.onChange(data);
                setOpen(false);
            })
            .catch((error) => {
                setIsProcessing(false);

                if (
                    error instanceof AxiosError &&
                    error.status === 422 &&
                    error.response?.data?.message
                ) {
                    setError(error.response.data.message);
                    return;
                }

                if (error) setError('Er is iets fout gegaan.');

                throw error;
            });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{props.trigger}</DialogTrigger>

            <DialogContent>
                <DialogTitle>
                    {props.project
                        ? `Wijzig project ${props.project.name}`
                        : 'Maak een nieuw project aan'}
                </DialogTitle>
                <DialogDescription>Kies een naam die uniek is</DialogDescription>
                <form className="space-y-6" onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Naam</Label>

                        <Input
                            id="name"
                            name="name"
                            value={projectName}
                            readOnly={isProcessing}
                            onChange={(e) => setProjectName(e.target.value)}
                        />

                        <InputError message={error} />
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">Annuleren</Button>
                        </DialogClose>

                        <Button variant="default" asChild disabled={isProcessing}>
                            <button type="submit">Aanmaken</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function ProjectDeleteConfirmationDialog(props: {
    trigger: JSX.Element;
    project: Project;
    onDelete: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    function submit() {
        setIsProcessing(true);

        axios
            .delete(route('projects.destroy', [props.project]))
            .then(() => {
                props.onDelete();
                setOpen(false);
            })
            .finally(() => {
                setIsProcessing(false);
            });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{props.trigger}</DialogTrigger>

            <DialogContent>
                <DialogTitle className="flex items-center gap-1">
                    <TriangleAlert className="text-yellow-500" />
                    Verwijder project {props.project.name}
                </DialogTitle>
                <DialogDescription>
                    Weet je zeker dat je dit project wilt verwijderen?
                </DialogDescription>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary">Annuleren</Button>
                    </DialogClose>

                    <Button variant="destructive" asChild disabled={isProcessing} onClick={submit}>
                        <button type="submit">Verwijderen</button>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
