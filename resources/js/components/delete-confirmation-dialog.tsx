import { TriangleAlert } from 'lucide-react';
import type { JSX, ReactNode } from 'react';
import { Button } from './ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';

export function DeleteConfirmationDialog(props: {
    trigger: JSX.Element;
    openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    title: ReactNode;
    body: ReactNode;
    buttonsDisabled: boolean;
    onConfirm: () => void;
}) {
    return (
        <Dialog open={props.openState[0]} onOpenChange={props.openState[1]}>
            <DialogTrigger asChild>{props.trigger}</DialogTrigger>

            <DialogContent>
                <DialogTitle className="flex items-center gap-1">
                    <TriangleAlert className="text-yellow-500" />
                    {props.title}
                </DialogTitle>
                <DialogDescription>{props.body}</DialogDescription>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary">Annuleren</Button>
                    </DialogClose>

                    <Button
                        variant="destructive"
                        disabled={props.buttonsDisabled}
                        onClick={() => {
                            props.onConfirm();
                        }}
                    >
                        Verwijderen
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
