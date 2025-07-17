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
import { Textarea } from "@/components/ui/textarea";
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
import { useDesignation } from "@/hooks/apis/Designations/designation";
import { useListDepartments } from "@/hooks/apis/Departments/departments-list";
 
const formSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long!" })
        .max(50),
    department: z.string().min(1, { message: "Please select a department!" }),
    info: z
        .string()
        .max(200, { message: "Info must be at most 200 characters long!" }),
});
 
function Designation({ slug }: { slug?: any }) {
    const router = useRouter();
    const { DESIGNATIONS, DESIGNATION_DETAILS } = API_ENDPOINTS;
    const isEditMode = !!slug;
    const [isClient, setIsClient] = useState(false);
 
    useEffect(() => {
        setIsClient(true);
    }, []);
 
    const { data, isLoading } = useDesignation({ slug: slug });
    const { data: departmentsData, isLoading: isDepartmentsLoading } = useListDepartments();
 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            department: "",
            info: "",
        },
    });
 
    useEffect(() => {
        if (data?.data && isEditMode && isClient) {
            const departmentValue =
                data.data.department_id ||
                data.data.department ||
                (typeof data.data.department === "object"
                    ? data.data.department.id
                    : null) ||
                "";
            form.reset({
                name: data.data.name || "",
                department: departmentValue,
                info: data.data.info || "",
            });
        }
    }, [data, form, isEditMode, isClient]);
 
    useEffect(() => {
        if (
            isEditMode &&
            isClient &&
            data?.data &&
            departmentsData?.data?.departments &&
            !isDepartmentsLoading
        ) {
            const departmentValue =
                data.data.department_id ||
                data.data.department ||
                (typeof data.data.department === "object"
                    ? data.data.department.id
                    : null) ||
                "";
            const currentdepartmentValue = form.getValues("department");
 
            if (departmentValue && departmentValue !== currentdepartmentValue) {
                console.log(
                    "Updating department value from:",
                    currentdepartmentValue,
                    "to:",
                    departmentValue
                );
                setTimeout(() => {
                    form.setValue("department", departmentValue);
                }, 100);
            }
        }
    }, [departmentsData, isDepartmentsLoading, data, form, isEditMode, isClient]);
 
    useEffect(() => {
        if (
            isEditMode &&
            isClient &&
            data?.data &&
            departmentsData?.data?.categories &&
            !isDepartmentsLoading &&
            !isLoading
        ) {
            const departmentValue =
                data.data.department_id ||
                data.data.department ||
                (typeof data.data.department === "object"
                    ? data.data.department.id
                    : null) ||
                "";
 
            const departmentExists = departmentsData.data.categories.some(
                (cat: any) => cat.id === departmentValue
            );
 
            if (departmentValue && departmentExists) {
                const currentValue = form.getValues("department");
                if (currentValue !== departmentValue) {
                    form.setValue("department", departmentValue);
                }
            }
        }
    }, [
        data,
        departmentsData,
        isDepartmentsLoading,
        isLoading,
        form,
        isEditMode,
        isClient,
    ]);
 
    const { mutate: createMutate, isPending: isCreating } = useCreateMutation({
        method: "post",
        endpoint: DESIGNATIONS,
        submitData: {},
        redirectPath: "",
        isToast: true,
        invalidateQueries: [DESIGNATIONS],
        handleSuccess: (response: any) => {
            router.back();
        },
        handleError: (error: any) => {},
    });
 
    const { mutate: updateMutate, isPending: isUpdating } = useCreateMutation({
        method: "put",
        endpoint: `${DESIGNATION_DETAILS}${slug}/`,
        submitData: {},
        redirectPath: "",
        isToast: true,
        invalidateQueries: [DESIGNATIONS, DESIGNATION_DETAILS],
        handleSuccess: (response: any) => {
            router.back();
        },
        handleError: (error: any) => {},
    });
 
    function onSubmit(values: z.infer<typeof formSchema>) {
        if (isEditMode) {
            updateMutate({ extraSubmitData: values });
        } else {
            createMutate({ extraSubmitData: values });
        }
    }
 
    const isPending = isCreating || isUpdating;
 
    const getDepartments = () => {
        if (!departmentsData?.data?.departments) return [];
 
        return departmentsData.data.departments.map((department: any) => ({
            id: department.id,
            name: department.name,
        }));
    };
 
    const departments = getDepartments();
 
    return (
        <div className="mx-auto">
            <div className="rounded-lg shadow-lg border p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">
                        {isEditMode ? "Edit Designation" : "Create Designation"}
                    </h2>
                    <p className="text-xs">Please fill out the form below</p>
                </div>
 
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {isEditMode && isLoading ? (
                            <div className="flex items-center justify-center">
                                <p>Loading designation data...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Designation Name</FormLabel>
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
                                <div className="md:col-span-2">
                                    <FormField
                                        control={form.control}
                                        name="info"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Description
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        rows={10}
                                                        cols={10}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}
 
                        <div className="flex items-center justify-end gap-4">
                            <Button type="button" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending
                                    ? isEditMode
                                        ? "Updating..."
                                        : "Creating..."
                                    : isEditMode
                                    ? "Update Designation"
                                    : "Create Designation"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
 
export default Designation;