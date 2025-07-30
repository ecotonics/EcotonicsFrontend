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
            const userData = row.original.user_data;
            const name = userData?.first_name || "N/A";
            const department = row.original.department_data.name || "N/A";
            const designation = row.original.designation_data.name || "N/A";
            const image = userData?.photo || "";

            return (
                <div className="flex items-center space-x-4 text-gray-900 dark:text-gray-100">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={image} alt={name} />
                        <AvatarFallback>{name[0]?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                <div className="flex flex-col">
                        <span className="font-medium text-base">{name}</span>
                        <span className="text-sm text-muted-foreground">{designation} / {department}</span>
                    </div>
                </div>
            );
        },
    },

    {
        header: "Mobile Number",
        accessorKey: "mobile",
        cell: ({ row }: any) => {
            const mobile_number = row.original.user_data.mobile || "N/A";

            return (
                <div>{mobile_number}</div>
            );
        },
    },

    {
        header: "Email",
        accessorKey: "email",
        cell: ({ row }: any) => {
            const email = row.original.user_data.email || "N/A";

            return (
                <div>{email}</div>
            );
        },
    },

    {
        id: "actions",
        cell: ({ row }: any) => {
            const slug = row.original?.slug;
            const name = row.original?.name;
            const router = useRouter();
            const [dropdownOpen, setDropdownOpen] = useState(false);

            const { deleteItem, isPending, reset } = useDeleteMutation({
                endpoint: `${API_ENDPOINTS.SERVICE_DETAILS}${slug}/`,
                invalidateQueries: [API_ENDPOINTS.STAFFS],
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
                                    router.push(`/staffs/${slug}/details`);
                                }}
                            >
                                Details
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => {
                                    router.push(`/staffs/${slug}/edit`);
                                }}
                            >
                                Edit
                            </DropdownMenuItem>

                            <DeleteDialog
                                title="Delete Staff"
                                description="Are you sure you want to delete this staff? This action cannot be undone."
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