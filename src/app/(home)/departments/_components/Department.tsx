"use client";
/* eslint-disable */

import React, { useEffect } from "react";
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
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import useCreateMutation from "@/hooks/useCreateMutation";
import { useRouter } from "next/navigation";
import { useDepartment } from "@/hooks/apis/Departments/department";

const formSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long!" })
        .max(50),
    info: z
        .string()
        .max(200, { message: "Info must be at most 200 characters long!" }),
});

function Department({ slug }: { slug?: any }) {
    const router = useRouter();
    const { DEPARTMENTS, DEPARTMENT_DETAILS } = API_ENDPOINTS;
    const isEditMode = !!slug;

    const { data, isLoading } = useDepartment({ slug: slug });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            info: "",
        },
    });

    useEffect(() => {
        if (data?.data && isEditMode) {
            form.reset({
                name: data.data.name || "",
                info: data.data.info || "",
            });
        }
    }, [data, form, isEditMode]);

    const { mutate: createMutate, isPending: isCreating } = useCreateMutation({
        method: "post",
        endpoint: DEPARTMENTS,
        submitData: {},
        redirectPath: "",
        isToast: true,
        invalidateQueries: [DEPARTMENTS, DEPARTMENT_DETAILS],
        handleSuccess: (response: any) => {
            router.back();
        },
        handleError: (error: any) => {},
    });

    const { mutate: updateMutate, isPending: isUpdating } = useCreateMutation({
        method: "put",
        endpoint: `${DEPARTMENT_DETAILS}${slug}/`,
        submitData: {},
        redirectPath: "",
        isToast: true,
        invalidateQueries: [DEPARTMENTS, DEPARTMENT_DETAILS],
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

    return (
        <div className="mx-auto">
            <div className="rounded-lg shadow-lg border p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">
                        {isEditMode ? "Edit Department" : "Create Department"}
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
                                <p>Loading department data...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                <>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Department Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="info"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Description
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
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
                                    ? "Update Department"
                                    : "Create Department"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default Department;
