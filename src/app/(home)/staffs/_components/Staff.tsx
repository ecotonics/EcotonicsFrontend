"use client";
/* eslint-disable */

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { API_ENDPOINTS } from "@/constants/api-endpoints";
import useCreateMutation from "@/hooks/useCreateMutation";
import { useRouter } from "next/navigation";
import { useStaff } from "@/hooks/apis/Staffs/staff";
import { useListDepartments } from "@/hooks/apis/Departments/departments-list";
import { useListDesignations } from "@/hooks/apis/Designations/designations-list";

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long!" }).max(50),
    department: z.string().min(1, { message: "Please select a department!" }),
    designation: z.string().min(1, { message: "Please select a designation!" }),
});

function Staff({ slug }: { slug?: any }) {
    const router = useRouter();
    const { STAFFS, STAFF_DETAILS } = API_ENDPOINTS;
    const isEditMode = !!slug;
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const { data, isLoading } = useStaff({ slug });
    const { data: departmentsData, isLoading: isDepartmentsLoading } = useListDepartments();
    const { data: designationsData, isLoading: isDesignationsLoading } = useListDesignations();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            department: "",
            designation: "",
        },
    });

    useEffect(() => {
        if (data?.data && isEditMode && isClient) {
            const departmentValue =
                data.data.department_id ||
                data.data.department?.id ||
                data.data.department ||
                "";

            const designationValue =
                data.data.designation_id ||
                data.data.designation?.id ||
                data.data.designation ||
                "";

            form.reset({
                name: data.data.user_data.first_name || "",
                department: departmentValue,
                designation: designationValue,
            });
        }
    }, [data, form, isEditMode, isClient]);

    const { mutate: createMutate, isPending: isCreating } = useCreateMutation({
        method: "post",
        endpoint: STAFFS,
        submitData: {},
        redirectPath: "",
        isToast: true,
        invalidateQueries: [STAFFS],
        handleSuccess: () => router.back(),
        handleError: () => {},
    });

    const { mutate: updateMutate, isPending: isUpdating } = useCreateMutation({
        method: "put",
        endpoint: `${STAFF_DETAILS}${slug}/`,
        submitData: {},
        redirectPath: "",
        isToast: true,
        invalidateQueries: [STAFFS, STAFF_DETAILS],
        handleSuccess: () => router.back(),
        handleError: () => {},
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        isEditMode ? updateMutate({ extraSubmitData: values }) : createMutate({ extraSubmitData: values });
    }

    const isPending = isCreating || isUpdating;

    const departments = departmentsData?.data?.departments || [];
    const designations = designationsData?.data?.designations || [];

    return (
        <div className="mx-auto">
            <div className="rounded-lg shadow-lg border p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">
                        {isEditMode ? "Edit Staff" : "Create Staff"}
                    </h2>
                    <p className="text-xs">Please fill out the form below</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {isEditMode && isLoading ? (
                            <div className="flex items-center justify-center">
                                <p>Loading staff data...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Staff Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Staff Photo</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>
                                                    Department
                                                </FormLabel>
                                                {isClient ? (
                                                    <Select
                                                        key={`department-select-${field.value}`}
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        value={
                                                            field.value || ""
                                                        }
                                                        disabled={
                                                            isDepartmentsLoading
                                                        }
                                                    >
                                                        <FormControl className="w-full">
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a department" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {isDepartmentsLoading ? (
                                                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                                    Loading
                                                                    departments...
                                                                </div>
                                                            ) : departments.length >
                                                                0 ? (
                                                                departments.map(
                                                                    (
                                                                        department: any
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                department.id
                                                                            }
                                                                            value={
                                                                                department.id
                                                                            }
                                                                        >
                                                                            {
                                                                                department.name
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )
                                                            ) : (
                                                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                                    No
                                                                    departments
                                                                    available
                                                                </div>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                                                        <span className="text-muted-foreground">
                                                            Select a department
                                                        </span>
                                                    </div>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                                <FormField
                                    control={form.control}
                                    name="designation"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>
                                                    Designation
                                                </FormLabel>
                                                {isClient ? (
                                                    <Select
                                                        key={`designation-select-${field.value}`}
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        value={
                                                            field.value || ""
                                                        }
                                                        disabled={
                                                            isDesignationsLoading
                                                        }
                                                    >
                                                        <FormControl className="w-full">
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a designation" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {isDesignationsLoading ? (
                                                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                                    Loading
                                                                    designations...
                                                                </div>
                                                            ) : designations.length >
                                                                0 ? (
                                                                designations.map(
                                                                    (
                                                                        designation: any
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                designation.id
                                                                            }
                                                                            value={
                                                                                designation.id
                                                                            }
                                                                        >
                                                                            {
                                                                                designation.name
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )
                                                            ) : (
                                                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                                    No
                                                                    designations
                                                                    available
                                                                </div>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                                                        <span className="text-muted-foreground">
                                                            Select a designation
                                                        </span>
                                                    </div>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>
                        )}
                        <div className="flex items-center justify-end gap-4">
                            <Button type="button" onClick={() => router.back()} variant="outline">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Staff" : "Create Staff"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default Staff;