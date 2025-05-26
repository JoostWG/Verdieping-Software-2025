import InputError from '@/components/input-error';
import { TagBadge } from '@/components/tag-badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useArrayState } from '@/hooks/use-array-state';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Project, Task } from '@/types/backend';
import { Head, useForm } from '@inertiajs/react';
import { DialogDescription } from '@radix-ui/react-dialog';
import axios, { AxiosError } from 'axios';
import { Pencil, Plus, Trash2, TriangleAlert } from 'lucide-react';
import type { FormEvent, JSX } from 'react';
import { useEffect, useState } from 'react';

type TaskForm = Pick<Task, 'project_id' | 'title' | 'description'>;

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

    const [tasks, [addTask, updateTask, removeTask]] = useArrayState(
        props.project.tasks ?? [],
        (task) => task.id,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={props.project.name} />

            <div className="grid gap-4 p-4">
                <h1 className="text-2xl">{props.project.name}</h1>

                {!tasks.length ? (
                    <div>Dit project heeft geen taken.</div>
                ) : (
                    <div className="divide-y rounded-md border">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-center justify-between gap-1 p-2"
                            >
                                <div key={task.id}>
                                    <div className="flex gap-1">
                                        <div className="text-neutral-400">#{task.nr}</div>
                                        <div>{task.title}</div>
                                    </div>
                                    <div className="text-sm text-neutral-500">
                                        {task.description}
                                    </div>
                                    {task.tags && (
                                        <div className="flex items-center gap-1">
                                            Tags:{' '}
                                            {task.tags.length
                                                ? task.tags.map((tag) => (
                                                      <TagBadge key={tag.id} tag={tag} />
                                                  ))
                                                : 'No tags assigned'}
                                        </div>
                                    )}
                                </div>

                                <div className="me-4 flex items-center gap-2">
                                    <TaskDialog
                                        trigger={
                                            <Pencil className="cursor-pointer text-blue-500 hover:opacity-75" />
                                        }
                                        project={props.project}
                                        task={task}
                                        onChange={(taskData) => {
                                            updateTask(task, taskData);
                                        }}
                                    />

                                    <TaskDeleteConfirmationDialog
                                        trigger={
                                            <Trash2 className="cursor-pointer text-red-500 hover:opacity-75" />
                                        }
                                        task={task}
                                        onDelete={() => {
                                            removeTask(task);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <TaskDialog
                    trigger={
                        <Button variant="default">
                            <Plus strokeWidth={3} />
                            Nieuwe taak
                        </Button>
                    }
                    project={props.project}
                    onChange={(taskData) => {
                        addTask(taskData);
                    }}
                />
            </div>
        </AppLayout>
    );
}

function TaskDialog(props: {
    trigger: JSX.Element;
    project: Project;
    task?: Task;
    onChange: (taskData: Task) => void;
}) {
    const form = useForm<TaskForm>(
        props.task ?? { title: '', description: '', project_id: props.project.id },
    );

    const [open, setOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (open) {
            form.reset();
            setIsProcessing(false);
        }
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    function submit(event: FormEvent) {
        event.preventDefault();

        setIsProcessing(true);

        (props.task
            ? axios.put<Task>(route('tasks.update', [props.task]), form.data)
            : axios.post<Task>(route('tasks.store'), form.data)
        )
            .then(({ data }) => {
                props.onChange(data);
                setOpen(false);
            })
            .catch((error) => {
                setIsProcessing(false);

                if (
                    !(
                        error instanceof AxiosError &&
                        error.status === 422 &&
                        error.response?.data.errors
                    )
                ) {
                    throw error;
                }

                for (const [key, [value]] of Object.entries<string[]>(error.response.data.errors)) {
                    form.setError(key as keyof TaskForm, value);
                }
            });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{props.trigger}</DialogTrigger>

            <DialogContent>
                <DialogTitle>
                    {props.task ? `Wijzig taak #${props.task.nr}` : 'Maak een nieuwe taak aan'}
                </DialogTitle>
                <form className="space-y-6" onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="title">Titel</Label>

                        <Input
                            id="title"
                            name="title"
                            value={form.data.title}
                            readOnly={isProcessing}
                            onChange={(event) => {
                                form.setData('title', event.target.value);
                            }}
                        />

                        <InputError message={form.errors.title} />

                        <Label htmlFor="description" className="mt-1">
                            Omschrijving
                        </Label>

                        <Textarea
                            id="description"
                            name="description"
                            value={form.data.description}
                            onChange={(event) => {
                                form.setData('description', event.target.value);
                            }}
                            className="min-h-24"
                        />

                        <InputError message={form.errors.description} />
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

function TaskDeleteConfirmationDialog(props: {
    trigger: JSX.Element;
    task: Task;
    onDelete: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    function submit() {
        setIsProcessing(true);

        axios
            .delete(route('tasks.destroy', [props.task]))
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
                    Verwijder taak #{props.task.nr}
                </DialogTitle>
                <DialogDescription>
                    Weet je zeker dat je deze taak wilt verwijderen?
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
