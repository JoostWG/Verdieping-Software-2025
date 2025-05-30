import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useArrayState } from '@/hooks/use-array-state';
import ProjectLayout from '@/layouts/project-layout';
import type { Project, Tag } from '@/types/backend';
import { useForm } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import { LoaderCircle, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import type { FormEvent, JSX } from 'react';
import { useEffect, useReducer, useState } from 'react';

type NewTagForm = Pick<Tag, 'project_id' | 'name'>;

export default function ProjectTasks(props: { project: Project }) {
    const [tags, [addTag, updateTag, removeTag]] = useArrayState<Tag>(
        props.project.tags?.map((tag) => ({
            ...tag,
            isEditing: false,
            errorMessage: null,
        })) ?? [],
        (tag) => tag.id,
    );

    const newTagForm = useForm<NewTagForm>({ project_id: props.project.id, name: '' });
    const [newTagFormIsProcessing, setNewTagFormIsProcessing] = useState(false);

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

    function newSubmit(event: FormEvent) {
        event.preventDefault();

        if (!newTagForm.data.name) {
            return;
        }

        setNewTagFormIsProcessing(true);

        axios
            .post<Tag>(route('tags.store'), newTagForm.data)
            .then(({ data }) => {
                newTagForm.reset();
                addTag(data);
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

                newTagForm.setError('name', error.response.data.message);
            })
            .finally(() => {
                setNewTagFormIsProcessing(false);
            });
    }

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
                <div className="col-span-6 grid gap-2">
                    <div className="divide-y rounded-md border">
                        {tags.map((tag) => (
                            <div key={tag.id} className="min-h-10">
                                {tag.id === editingTag?.id ? (
                                    <div>
                                        <form className="flex gap-2" onSubmit={submitEdit}>
                                            <div>
                                                <Input
                                                    autoFocus
                                                    defaultValue={editForm.data.name}
                                                    onChange={(event) => {
                                                        editForm.setData(
                                                            'name',
                                                            event.target.value,
                                                        );
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
                                        <InputError
                                            message={editForm.errors.name}
                                            className="mt-1"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-2">
                                        <div className="flex items-center gap-1">
                                            {tag.name}

                                            <Tooltip delayDuration={750}>
                                                <TooltipTrigger asChild>
                                                    <Pencil
                                                        size={16}
                                                        className="cursor-pointer text-blue-500 hover:opacity-75"
                                                        onClick={() => {
                                                            setEditingTag(tag);
                                                        }}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>Tag wijzigen</TooltipContent>
                                            </Tooltip>
                                        </div>

                                        <TagDeleteConfirmationDialog
                                            trigger={
                                                <Tooltip delayDuration={750}>
                                                    <TooltipTrigger asChild>
                                                        <Trash2 className="cursor-pointer text-red-500 hover:opacity-75" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>Tag verwijdren</TooltipContent>
                                                </Tooltip>
                                            }
                                            tag={tag}
                                            onDelete={() => {
                                                removeTag(tag);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <form className="flex gap-2" onSubmit={newSubmit}>
                        <Input
                            autoFocus
                            value={newTagForm.data.name}
                            onChange={(event) => {
                                newTagForm.setData('name', event.target.value);
                            }}
                            readOnly={newTagFormIsProcessing}
                        />

                        <Button
                            variant="default"
                            disabled={newTagFormIsProcessing || !newTagForm.data.name}
                        >
                            {newTagFormIsProcessing ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <Plus />
                            )}
                            Toevoegen
                        </Button>
                    </form>
                    <InputError message={newTagForm.errors.name} className="mt-1" />
                </div>
            </div>
        </ProjectLayout>
    );
}

function TagDeleteConfirmationDialog(props: {
    trigger: JSX.Element;
    tag: Tag;
    onDelete: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    function submit() {
        setIsProcessing(true);

        axios
            .delete(route('tags.destroy', [props.tag]))
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
            title={`Verwijder tag ${props.tag.name}`}
            body="Weet je zeker dat je deze tag wilt verwijderen?"
            buttonsDisabled={isProcessing}
            onConfirm={submit}
        />
    );
}
