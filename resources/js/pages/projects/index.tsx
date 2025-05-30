import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useArrayState } from '@/hooks/use-array-state';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Project } from '@/types/backend';
import { Head, Link } from '@inertiajs/react';
import { Table } from '@radix-ui/themes';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { Pencil, Trash2 } from 'lucide-react';
import type { FormEvent, JSX } from 'react';
import { useEffect, useState } from 'react';
<Trash2 className="cursor-pointer text-red-500 hover:opacity-75" />;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projecten',
        href: route('projects.index'),
    },
];

export default function ProjectIndex(props: { projects: Project[] }) {
    const [projects, [addProject, updateProject, removeProject]] = useArrayState(
        props.projects,
        (project) => project.id,
        {
            addToBeginningOfArray: true,
        },
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
                onChange={(project) => {
                    addProject(project);
                }}
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
                                            <Tooltip delayDuration={750}>
                                                <TooltipTrigger asChild>
                                                    <Pencil className="cursor-pointer text-blue-500 hover:opacity-75" />
                                                </TooltipTrigger>
                                                <TooltipContent>Project wijzigen</TooltipContent>
                                            </Tooltip>
                                        }
                                        project={project}
                                        onChange={(projectData) => {
                                            updateProject(project, projectData);
                                        }}
                                    />
                                    <ProjectDeleteConfirmationDialog
                                        trigger={
                                            <Tooltip delayDuration={750}>
                                                <TooltipTrigger asChild>
                                                    <Trash2 className="cursor-pointer text-red-500 hover:opacity-75" />
                                                </TooltipTrigger>
                                                <TooltipContent>Project verwijdren</TooltipContent>
                                            </Tooltip>
                                        }
                                        project={project}
                                        onDelete={() => {
                                            removeProject(project);
                                        }}
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
    onChange: (projectData: Project) => void;
}) {
    const initialProjectName = props.project ? props.project.name : '';
    const [open, setOpen] = useState(false);
    const [projectName, setProjectName] = useState(initialProjectName);
    const [errorMessage, setErrorMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (open) {
            setProjectName(initialProjectName);
            setErrorMessage('');
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
                    setErrorMessage(error.response.data.message);
                    return;
                }

                setErrorMessage('Er is iets fout gegaan.');

                throw error;
            });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>{props.trigger}</DialogTrigger>

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
                            onChange={(e) => {
                                setProjectName(e.target.value);
                            }}
                        />

                        <InputError message={errorMessage} />
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">Annuleren</Button>
                        </DialogClose>

                        <Button variant="default" asChild disabled={isProcessing}>
                            <button type="submit">Opslaan</button>
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
        <DeleteConfirmationDialog
            trigger={props.trigger}
            openState={[open, setOpen]}
            title={`Verwijder project ${props.project.name}`}
            body="Weet je zeker dat je dit project wilt verwijderen?"
            buttonsDisabled={isProcessing}
            onConfirm={submit}
        />
    );
}
