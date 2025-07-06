"use client";

import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ErrorPopupModalProps {
    data: {
        title: string;
        errors: string[];
    };
    onClose: () => void;
}

const ErrorPopupModal: React.FC<ErrorPopupModalProps> = ({ data, onClose }) => {
    return (
        <AlertDialog open onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{data.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <ul>
                            {data.errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onClose}>OK</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ErrorPopupModal;
