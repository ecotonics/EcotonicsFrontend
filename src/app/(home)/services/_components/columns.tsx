"use client";
/* eslint-disable */

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useDeleteMutation } from "@/hooks/useDeleteMutation";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { useState } from "react";

export const columns = [
    {
        header: "No",
        accessorKey: "id",
        cell: ({ row }: any) => {
            const num = row.index + 1;

            return <div>{num}</div>;
        },
    },

    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }: any) => {
            const name = row.getValue("name");
            const image = row.original.image || "";

            return (
                <div className="flex items-center space-x-3 font-medium text-gray-900 dark:text-gray-100">
                    <Avatar>
                        <AvatarImage src={image} alt={name} />
                        <AvatarFallback>{name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span>{name}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "category_name",
        header: "Category",
    },
    {
        id: "actions",
        cell: ({ row }: any) => {
            const slug = row.original?.slug;
            const name = row.original?.name;
            const router = useRouter();
            const [dropdownOpen, setDropdownOpen] = useState(false);

            const { deleteItem, isPending, reset } = useDeleteMutation({
                endpoint: `${API_ENDPOINTS.SERVICES_SINGLE}${slug}/`,
                invalidateQueries: [API_ENDPOINTS.SERVICES],
                isToast: true,
            });

            const handleDelete = async () => {
                await deleteItem();
                setDropdownOpen(false);
            };

            return (
                <div className="text-right">
                    <DropdownMenu
                        open={dropdownOpen}
                        onOpenChange={setDropdownOpen}
                    >
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={() => {
                                    router.push(`/services/${slug}/details`);
                                }}
                            >
                                Details
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => {
                                    router.push(`/services/${slug}/edit`);
                                }}
                            >
                                Edit
                            </DropdownMenuItem>

                            <DeleteDialog
                                title="Delete Service"
                                description="Are you sure you want to delete this service? This action cannot be undone."
                                onDelete={handleDelete}
                                isLoading={isPending}
                                itemName={name}
                                trigger={
                                    <DropdownMenuItem
                                        variant="destructive"
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        Delete
                                    </DropdownMenuItem>
                                }
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];