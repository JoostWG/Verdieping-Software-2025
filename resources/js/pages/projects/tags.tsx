import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useArrayState } from '@/hooks/use-array-state';
import ProjectLayout from '@/layouts/project-layout';
import type { Project, Tag } from '@/types/backend';
import { useForm } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import { LoaderCircle, Pencil, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useReducer, useState } from 'react';

export default function ProjectTasks(props: { project: Project }) {
    const [tags, [addTag, updateTag, removeTag]] = useArrayState<Tag>(
        props.project.tags?.map((tag) => ({
            ...tag,
            isEditing: false,
            errorMessage: null,
        })) ?? [],
        (tag) => tag.id,
    );

    const editForm = useForm<{ name: string }>({ name: '' });

    const [editingTag, setEditingTag] = useReducer(
        (state, tag: Tag | null) => {
            if (tag) {
                editForm.setData('name', tag.name);
            }

            return tag;
        },
        null as Tag | null,
    );

    const [editIsProcessing, setEditIsProcessing] = useState(false);

    useEffect(() => {
        editForm.setData('name', editingTag ? editingTag.name : '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingTag]);

    function submitEdit(event: FormEvent) {
        event.preventDefault();

        if (!editingTag) {
            return;
        }

        setEditIsProcessing(true);
        editForm.setError('name', '');

        axios
            .put<Tag>(route('tags.update', [editingTag]), editForm.data)
            .then(({ data }) => {
                updateTag(editingTag, data);
                setEditingTag(null);
            })
            .catch((error) => {
                if (
                    !(
                        error instanceof AxiosError &&
                        error.status === 422 &&
                        error.response?.data?.message
                    )
                ) {
                    throw error;
                }

                editForm.setError('name', error.response.data.message);
            })
            .finally(() => {
                setEditIsProcessing(false);
            });
    }

    return (
        <ProjectLayout project={props.project}>
            <div className="grid grid-cols-12 p-4">
                <div className="col-span-6 divide-y rounded-md border">
                    {tags.map((tag) => (
                        <div key={tag.id} className="flex min-h-10 items-center">
                            {tag.id === editingTag?.id ? (
                                <div>
                                    <form className="flex justify-end gap-2" onSubmit={submitEdit}>
                                        <div>
                                            <Input
                                                autoFocus
                                                defaultValue={editForm.data.name}
                                                onChange={(event) => {
                                                    editForm.setData('name', event.target.value);
                                                }}
                                                readOnly={editIsProcessing}
                                                className="border-0"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <Button variant="ghost" disabled={editIsProcessing}>
                                                {editIsProcessing ? (
                                                    <LoaderCircle className="animate-spin" />
                                                ) : (
                                                    <Save />
                                                )}
                                                Opslaan
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                disabled={editIsProcessing}
                                                onClick={() => {
                                                    setEditingTag(null);
                                                }}
                                            >
                                                Annuleren
                                            </Button>
                                        </div>
                                    </form>
                                    <InputError message={editForm.errors.name} className="mt-1" />
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 p-2">
                                    {tag.name}
                                    <Pencil
                                        size={16}
                                        className="cursor-pointer text-blue-500 hover:opacity-75"
                                        onClick={() => {
                                            setEditingTag(tag);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </ProjectLayout>
    );
}

// function TaskDialog(props: {
//     trigger: JSX.Element;
//     project: Project;
//     task?: Task;
//     onChange: (taskData: Task) => void;
// }) {
//     const form = useForm<TaskForm>(
//         props.task
//             ? {
//                   title: props.task.title,
//                   description: props.task.description,
//                   tag_ids: props.task.tags?.map((tag) => tag.id) ?? [],
//               }
//             : { title: '', description: '', project_id: props.project.id, tag_ids: [] },
//     );

//     const [open, setOpen] = useState(false);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [tagSearchQuery, setTagSearchQuery] = useState('');
//     const projectTags = props.project.tags ?? [];

//     useEffect(() => {
//         if (open) {
//             form.reset();
//             setIsProcessing(false);
//         }
//     }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

//     function submit(event: FormEvent) {
//         event.preventDefault();

//         setIsProcessing(true);

//         (props.task
//             ? axios.put<Task>(route('tasks.update', [props.task]), form.data)
//             : axios.post<Task>(route('tasks.store'), form.data)
//         )
//             .then(({ data }) => {
//                 props.onChange(data);
//                 form.setDefaults();
//                 setOpen(false);
//             })
//             .catch((error) => {
//                 setIsProcessing(false);

//                 if (
//                     !(
//                         error instanceof AxiosError &&
//                         error.status === 422 &&
//                         error.response?.data.errors
//                     )
//                 ) {
//                     throw error;
//                 }

//                 for (const [key, [value]] of Object.entries<string[]>(error.response.data.errors)) {
//                     form.setError(key as keyof TaskForm, value);
//                 }
//             });
//     }

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>{props.trigger}</DialogTrigger>

//             <DialogContent>
//                 {projectTags.map((tag) => tag.name).join(', ')}
//                 <DialogTitle>
//                     {props.task ? `Wijzig taak #${props.task.nr}` : 'Maak een nieuwe taak aan'}
//                 </DialogTitle>
//                 <form className="space-y-6" onSubmit={submit}>
//                     <div className="grid gap-2">
//                         <Label htmlFor="title">Titel</Label>

//                         <Input
//                             id="title"
//                             name="title"
//                             value={form.data.title}
//                             readOnly={isProcessing}
//                             onChange={(event) => {
//                                 form.setData('title', event.target.value);
//                             }}
//                         />

//                         <InputError message={form.errors.title} />

//                         <Label htmlFor="description" className="mt-1">
//                             Omschrijving
//                         </Label>

//                         <Textarea
//                             id="description"
//                             name="description"
//                             value={form.data.description}
//                             onChange={(event) => {
//                                 form.setData('description', event.target.value);
//                             }}
//                             className="min-h-24"
//                         />

//                         <InputError message={form.errors.description} />

//                         <Label className="mt-1">Tags</Label>

//                         <div className="mt-1 flex items-center justify-between rounded-md border p-2">
//                             <div className="flex flex-wrap gap-1">
//                                 {form.data.tag_ids
//                                     .map((id) => projectTags?.find((tag) => tag.id === id))
//                                     .filter((tag): tag is Tag => Boolean(tag))
//                                     .map((tag) => (
//                                         <TagBadge
//                                             key={tag.id}
//                                             tag={tag}
//                                             onDeleteClick={() => {
//                                                 form.setData(
//                                                     'tag_ids',
//                                                     form.data.tag_ids.filter((id) => id !== tag.id),
//                                                 );
//                                             }}
//                                         />
//                                     ))}
//                             </div>
//                             <DropdownMenu
//                                 onOpenChange={(isOpen) => {
//                                     if (isOpen) {
//                                         setTagSearchQuery('');
//                                     }
//                                 }}
//                             >
//                                 <DropdownMenuTrigger asChild>
//                                     <Button variant="ghost" size="sm" className="rounded-md">
//                                         <Plus strokeWidth={3} />
//                                     </Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent align="end">
//                                     <Input
//                                         id="title"
//                                         name="title"
//                                         placeholder="Zoeken..."
//                                         value={tagSearchQuery}
//                                         onKeyDown={(event) => {
//                                             // Prevent keyDown behavior from dropdown
//                                             event.stopPropagation();
//                                         }}
//                                         onChange={(event) => {
//                                             setTagSearchQuery(event.target.value);
//                                         }}
//                                     />

//                                     {projectTags
//                                         .filter(
//                                             (tag) =>
//                                                 !form.data.tag_ids.includes(tag.id) &&
//                                                 tag.name
//                                                     .toLowerCase()
//                                                     .includes(tagSearchQuery.toLowerCase()),
//                                         )
//                                         .map((tag) => (
//                                             <DropdownMenuItem
//                                                 key={tag.id}
//                                                 onClick={() => {
//                                                     form.setData('tag_ids', [
//                                                         ...form.data.tag_ids,
//                                                         tag.id,
//                                                     ]);
//                                                 }}
//                                                 className="cursor-pointer"
//                                             >
//                                                 {tag.name}
//                                             </DropdownMenuItem>
//                                         ))}
//                                 </DropdownMenuContent>
//                             </DropdownMenu>
//                         </div>
//                     </div>

//                     <DialogFooter className="gap-2">
//                         <DialogClose asChild>
//                             <Button variant="secondary">Annuleren</Button>
//                         </DialogClose>

//                         <Button variant="default" asChild disabled={isProcessing}>
//                             <button type="submit">Opslaan</button>
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }

// function TaskDeleteConfirmationDialog(props: {
//     trigger: JSX.Element;
//     task: Task;
//     onDelete: () => void;
// }) {
//     const [open, setOpen] = useState(false);
//     const [isProcessing, setIsProcessing] = useState(false);

//     function submit() {
//         setIsProcessing(true);

//         axios
//             .delete(route('tasks.destroy', [props.task]))
//             .then(() => {
//                 props.onDelete();
//                 setOpen(false);
//             })
//             .finally(() => {
//                 setIsProcessing(false);
//             });
//     }

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>{props.trigger}</DialogTrigger>

//             <DialogContent>
//                 <DialogTitle className="flex items-center gap-1">
//                     <TriangleAlert className="text-yellow-500" />
//                     Verwijder taak #{props.task.nr}
//                 </DialogTitle>
//                 <DialogDescription>
//                     Weet je zeker dat je deze taak wilt verwijderen?
//                 </DialogDescription>
//                 <DialogFooter className="gap-2">
//                     <DialogClose asChild>
//                         <Button variant="secondary">Annuleren</Button>
//                     </DialogClose>

//                     <Button variant="destructive" asChild disabled={isProcessing} onClick={submit}>
//                         <button type="submit">Verwijderen</button>
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }
