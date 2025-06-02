import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import InputError from '@/components/input-error';
import { StatusBadge } from '@/components/status-badge';
import { TagBadge } from '@/components/tag-badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useArrayState } from '@/hooks/use-array-state';
import ProjectLayout from '@/layouts/project-layout';
import { cn, filterMultiple } from '@/lib/utils';
import type { Project, Status, Tag, Task } from '@/types/backend';
import { useForm } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import {
    ArrowDownAZ,
    ArrowUpAZ,
    ArrowUpDown,
    ChevronDown,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import type { FormEvent, JSX } from 'react';
import { useEffect, useState } from 'react';

type TaskForm = {
    project_id?: Task['project_id'];
    status_id: Task['status_id'];
    title: Task['title'];
    description: Task['description'];
    tag_ids: Tag['id'][];
};

export default function ProjectShow(props: {
    project: Project;
    statuses: Status[];
    statusIds: Status['id'][];
    orderBy: string;
    orderByDesc: boolean;
    allowedOrderByFields: Record<string, string>;
}) {
    const [tasks, [addTask, updateTask, removeTask]] = useArrayState(
        props.project.tasks ?? [],
        (task) => task.id,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [statusIds, [addStatusId, _, removeStatusId], setStatusIds] = useArrayState(
        props.statusIds ?? [],
        (id) => id,
    );

    const [orderBy, setOrderBy] = useState<string | null>(props.orderBy);
    const [orderByDesc, setOrderByDesc] = useState(props.orderByDesc);

    return (
        <ProjectLayout project={props.project}>
            <div className="grid gap-4 p-4">
                <div className="flex justify-between">
                    <h1 className="text-2xl">{props.project.name}</h1>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary">Sorteren en filteren</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" asChild>
                            <div className="grid grid-cols-12 gap-4 p-2">
                                <div className="col-span-6 grid gap-1">
                                    <div className="text-muted-foreground text-sm">Sorteren</div>
                                    <div className="grid gap-2">
                                        {Object.entries(props.allowedOrderByFields).map(
                                            ([key, label]) => (
                                                <div
                                                    key={key}
                                                    className={cn(
                                                        'flex items-center gap-2',
                                                        'cursor-pointer select-none',
                                                        'hover:opacity-75',
                                                    )}
                                                    onClick={() => {
                                                        if (key === orderBy) {
                                                            setOrderByDesc(!orderByDesc);
                                                        } else {
                                                            setOrderBy(key);
                                                            setOrderByDesc(false);
                                                        }
                                                    }}
                                                >
                                                    {key !== orderBy ? (
                                                        <ArrowUpDown className="text-secondary" />
                                                    ) : !orderByDesc ? (
                                                        <ArrowDownAZ />
                                                    ) : (
                                                        <ArrowUpAZ />
                                                    )}
                                                    {label}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>

                                <div className="col-span-6 grid gap-1">
                                    <div className="text-muted-foreground text-sm">Filteren</div>
                                    <div className="grid gap-2">
                                        {props.statuses.map((status) => (
                                            <label
                                                key={status.id}
                                                className={cn(
                                                    'flex items-center gap-2',
                                                    'cursor-pointer select-none',
                                                )}
                                            >
                                                <Checkbox
                                                    checked={statusIds.includes(status.id)}
                                                    onCheckedChange={(state) => {
                                                        if (state === 'indeterminate') {
                                                            return;
                                                        }

                                                        if (state) {
                                                            addStatusId(status.id);
                                                        } else {
                                                            removeStatusId(status.id);
                                                        }
                                                    }}
                                                />
                                                <StatusBadge status={status} />
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-span-12 flex justify-end gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => {
                                            setOrderBy('nr');
                                            setOrderByDesc(false);
                                            setStatusIds([]);
                                        }}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="default"
                                        onClick={() => {
                                            filterMultiple({
                                                statusIds: statusIds.join(','),
                                                orderBy: orderBy ?? '',
                                                desc: String(orderByDesc),
                                            });
                                        }}
                                    >
                                        Toepassen
                                    </Button>
                                </div>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

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
                                    <div className="flex items-center gap-1">
                                        <div className="text-neutral-400">#{task.nr}</div>
                                        <div>{task.title}</div>
                                        {task.status && <StatusBadge status={task.status} />}
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
                                            <Tooltip delayDuration={750}>
                                                <TooltipTrigger asChild>
                                                    <Pencil className="cursor-pointer text-blue-500 hover:opacity-75" />
                                                </TooltipTrigger>
                                                <TooltipContent>Taak wijzigen</TooltipContent>
                                            </Tooltip>
                                        }
                                        project={props.project}
                                        statuses={props.statuses}
                                        task={task}
                                        onChange={(taskData) => {
                                            updateTask(task, taskData);
                                        }}
                                    />

                                    <TaskDeleteConfirmationDialog
                                        trigger={
                                            <Tooltip delayDuration={750}>
                                                <TooltipTrigger asChild>
                                                    <Trash2 className="cursor-pointer text-red-500 hover:opacity-75" />
                                                </TooltipTrigger>
                                                <TooltipContent>Taak verwijdren</TooltipContent>
                                            </Tooltip>
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
                        <Button variant="default" className="w-full">
                            <Plus strokeWidth={3} />
                            Nieuwe taak
                        </Button>
                    }
                    project={props.project}
                    statuses={props.statuses}
                    onChange={(taskData) => {
                        addTask(taskData);
                    }}
                />
            </div>
        </ProjectLayout>
    );
}

function TaskDialog(props: {
    trigger: JSX.Element;
    project: Project;
    task?: Task;
    statuses: Status[];
    onChange: (taskData: Task) => void;
}) {
    const form = useForm<TaskForm>(
        props.task
            ? {
                  title: props.task.title,
                  description: props.task.description,
                  status_id: props.task.status_id,
                  tag_ids: props.task.tags?.map((tag) => tag.id) ?? [],
              }
            : {
                  title: '',
                  description: '',
                  project_id: props.project.id,
                  status_id: props.statuses[0].id,
                  tag_ids: [],
              },
    );

    const [open, setOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [tagSearchQuery, setTagSearchQuery] = useState('');
    const projectTags = props.project.tags ?? [];

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
                form.setDefaults();
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
            <DialogTrigger>{props.trigger}</DialogTrigger>

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

                        <Label className="mt-1">Status</Label>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex w-1/3 cursor-pointer items-center justify-between rounded-md border p-2">
                                <StatusBadge
                                    status={
                                        props.statuses.find(
                                            (status) => status.id === form.data.status_id,
                                        ) as Status
                                    }
                                />
                                <ChevronDown />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {props.statuses.map((status) => (
                                    <DropdownMenuItem
                                        key={status.id}
                                        onClick={() => {
                                            form.setData('status_id', status.id);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <StatusBadge status={status} />
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Label className="mt-1">Tags</Label>

                        <div className="mt-1 flex items-center justify-between rounded-md border p-2">
                            <div className="flex flex-wrap gap-1">
                                {form.data.tag_ids
                                    .map((id) => projectTags?.find((tag) => tag.id === id))
                                    .filter((tag): tag is Tag => Boolean(tag))
                                    .map((tag) => (
                                        <TagBadge
                                            key={tag.id}
                                            tag={tag}
                                            onDeleteClick={() => {
                                                form.setData(
                                                    'tag_ids',
                                                    form.data.tag_ids.filter((id) => id !== tag.id),
                                                );
                                            }}
                                        />
                                    ))}
                            </div>
                            <DropdownMenu
                                onOpenChange={(isOpen) => {
                                    if (isOpen) {
                                        setTagSearchQuery('');
                                    }
                                }}
                            >
                                <DropdownMenuTrigger>
                                    <Tooltip delayDuration={750}>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="rounded-md"
                                            >
                                                <Plus strokeWidth={3} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Tag toevoegen</TooltipContent>
                                    </Tooltip>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="Zoeken..."
                                        value={tagSearchQuery}
                                        onKeyDown={(event) => {
                                            // Prevent keyDown behavior from dropdown
                                            event.stopPropagation();
                                        }}
                                        onChange={(event) => {
                                            setTagSearchQuery(event.target.value);
                                        }}
                                    />

                                    {projectTags
                                        .filter(
                                            (tag) =>
                                                !form.data.tag_ids.includes(tag.id) &&
                                                tag.name
                                                    .toLowerCase()
                                                    .includes(tagSearchQuery.toLowerCase()),
                                        )
                                        .map((tag) => (
                                            <DropdownMenuItem
                                                key={tag.id}
                                                onClick={() => {
                                                    form.setData('tag_ids', [
                                                        ...form.data.tag_ids,
                                                        tag.id,
                                                    ]);
                                                }}
                                                className="cursor-pointer"
                                            >
                                                {tag.name}
                                            </DropdownMenuItem>
                                        ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
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
        <DeleteConfirmationDialog
            trigger={props.trigger}
            openState={[open, setOpen]}
            title={`Verwijder taak #${props.task.nr}`}
            body="Weet je zeker dat je deze taak wilt verwijderen?"
            buttonsDisabled={isProcessing}
            onConfirm={submit}
        />
    );
}
