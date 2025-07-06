"use client";

import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteDialogProps {
    title?: string;
    description?: string;
    onDelete: () => void;
    isLoading?: boolean;
    trigger?: React.ReactNode;
    itemName?: string;
}

export function DeleteDialog({
    title = "Are you sure?",
    description = "This action cannot be undone. This will permanently delete the selected item.",
    onDelete,
    isLoading = false,
    trigger,
    itemName,
}: DeleteDialogProps) {
    const [open, setOpen] = React.useState(false);
    const handleDelete = async () => {
        try {
            await onDelete();
            setTimeout(() => setOpen(false), 400);
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!isLoading) {
            setOpen(newOpen);
        }
    };

    const defaultTrigger = (
        <Button variant="destructive" size="sm" className="h-8 px-2">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
        </Button>
    );

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                {trigger || defaultTrigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {itemName
                            ? `${description} "${itemName}" will be permanently deleted.`
                            : description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
