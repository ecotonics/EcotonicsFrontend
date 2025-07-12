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
import { cn } from "@/lib/utils";
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
        accessorKey: "designations",
        header: "Designations",
        cell: ({ row }: any) => {
            const count = row.original.designations || 0;
            return (
                <>
                    <div>{`${count} Designation${count === 1 ? "" : "s"}`}</div>
                </>
            );
        },
    },
    {
        accessorKey: "staffs",
        header: "Staffs",
        cell: ({ row }: any) => {
            const count = row.original.staffs || 0;
            return (
                <>
                    <div>{`${count} Staff${count === 1 ? "" : "s"}`}</div>
                </>
            );
        },
    },
    // {
    //     accessorKey: "status",
    //     header: "Status",
    //     cell: ({ row }: any) => {
    //         const status: { id: string; name: string } = row.getValue("status");
    //         return (
    //             <div
    //                 className={cn(`p-1 rounded-md w-max text-xs capitalize `, {
    //                     " bg-green-600":
    //                         status?.name?.toLowerCase() === "active",
    //                     " bg-yellow-600":
    //                         status?.name?.toLowerCase() === "pending",
    //                     " bg-red-600":
    //                         status?.name?.toLowerCase() === "inactive",
    //                 })}
    //             >
    //                 {status?.name}
    //             </div>
    //         );
    //     },
    // },
    {
        id: "actions",
        cell: ({ row }: any) => {
            const slug = row.original?.slug;
            const name = row.original?.name;
            const router = useRouter();
            const [dropdownOpen, setDropdownOpen] = useState(false);

            const { deleteItem, isPending, reset } = useDeleteMutation({
                endpoint: `${API_ENDPOINTS.DEPARTMENT_DETAILS}${slug}/`,
                invalidateQueries: [API_ENDPOINTS.DEPARTMENTS],
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
                                    router.push(`/departments/${slug}/edit`);
                                }}
                            >
                                Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => {
                                    router.push(`/departments/${slug}/details`);
                                }}
                            >
                                Details
                            </DropdownMenuItem>

                            <DeleteDialog
                                title="Delete Category"
                                description="Are you sure you want to delete this category? This action cannot be undone."
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