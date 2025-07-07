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
import { useService } from "@/hooks/apis/Services/service";
import { useListCategories } from "@/hooks/apis/Categories/categories-list";
 
const formSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long!" })
        .max(50),
    category: z.string().min(1, { message: "Please select a category!" }),
    info: z
        .string()
        .max(200, { message: "Info must be at most 200 characters long!" }),
});
 
function Service({ slug }: { slug?: any }) {
    const router = useRouter();
    const { SERVICES, SERVICES_SINGLE } = API_ENDPOINTS;
    const isEditMode = !!slug;
    const [isClient, setIsClient] = useState(false);
 
    useEffect(() => {
        setIsClient(true);
    }, []);
 
    const { data, isLoading } = useService({ slug: slug });
    const { data: categoriesData, isLoading: isCategoriesLoading } =
        useListCategories();
 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            category: "",
            info: "",
        },
    });
 
    useEffect(() => {
        if (data?.data && isEditMode && isClient) {
            const categoryValue =
                data.data.category_id ||
                data.data.category ||
                (typeof data.data.category === "object"
                    ? data.data.category.id
                    : null) ||
                "";
            form.reset({
                name: data.data.name || "",
                category: categoryValue,
                info: data.data.info || "",
            });
        }
    }, [data, form, isEditMode, isClient]);
 
    useEffect(() => {
        if (
            isEditMode &&
            isClient &&
            data?.data &&
            categoriesData?.data?.categories &&
            !isCategoriesLoading
        ) {
            const categoryValue =
                data.data.category_id ||
                data.data.category ||
                (typeof data.data.category === "object"
                    ? data.data.category.id
                    : null) ||
                "";
            const currentCategoryValue = form.getValues("category");
 
            if (categoryValue && categoryValue !== currentCategoryValue) {
                console.log(
                    "Updating category value from:",
                    currentCategoryValue,
                    "to:",
                    categoryValue
                );
                setTimeout(() => {
                    form.setValue("category", categoryValue);
                }, 100);
            }
        }
    }, [categoriesData, isCategoriesLoading, data, form, isEditMode, isClient]);
 
    useEffect(() => {
        if (
            isEditMode &&
            isClient &&
            data?.data &&
            categoriesData?.data?.categories &&
            !isCategoriesLoading &&
            !isLoading
        ) {
            const categoryValue =
                data.data.category_id ||
                data.data.category ||
                (typeof data.data.category === "object"
                    ? data.data.category.id
                    : null) ||
                "";
 
            const categoryExists = categoriesData.data.categories.some(
                (cat: any) => cat.id === categoryValue
            );
 
            if (categoryValue && categoryExists) {
                const currentValue = form.getValues("category");
                if (currentValue !== categoryValue) {
                    form.setValue("category", categoryValue);
                }
            }
        }
    }, [
        data,
        categoriesData,
        isCategoriesLoading,
        isLoading,
        form,
        isEditMode,
        isClient,
    ]);
 
    const { mutate: createMutate, isPending: isCreating } = useCreateMutation({
        method: "post",
        endpoint: SERVICES,
        submitData: {},
        redirectPath: "",
        isToast: true,
        invalidateQueries: [SERVICES],
        handleSuccess: (response: any) => {
            router.back();
        },
        handleError: (error: any) => {},
    });
 
    const { mutate: updateMutate, isPending: isUpdating } = useCreateMutation({
        method: "put",
        endpoint: `${SERVICES_SINGLE}${slug}/`,
        submitData: {},
        redirectPath: "",
        isToast: true,
        invalidateQueries: [SERVICES, SERVICES_SINGLE],
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
 
    const getCategories = () => {
        if (!categoriesData?.data?.categories) return [];
 
        return categoriesData.data.categories.map((category: any) => ({
            id: category.id,
            name: category.name,
        }));
    };
 
    const categories = getCategories();
 
    return (
        <div className="mx-auto">
            <div className="rounded-lg shadow-lg border p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">
                        {isEditMode ? "Edit Service" : "Create Service"}
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
                                <p>Loading service data...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Service Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>
                                                    Service Category
                                                </FormLabel>
                                                {isClient ? (
                                                    <Select
                                                        key={`category-select-${field.value}`}
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        value={
                                                            field.value || ""
                                                        }
                                                        disabled={
                                                            isCategoriesLoading
                                                        }
                                                    >
                                                        <FormControl className="w-full">
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a category" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {isCategoriesLoading ? (
                                                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                                    Loading
                                                                    categories...
                                                                </div>
                                                            ) : categories.length >
                                                              0 ? (
                                                                categories.map(
                                                                    (
                                                                        category: any
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                category.id
                                                                            }
                                                                            value={
                                                                                category.id
                                                                            }
                                                                        >
                                                                            {
                                                                                category.name
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )
                                                            ) : (
                                                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                                    No
                                                                    categories
                                                                    available
                                                                </div>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                                                        <span className="text-muted-foreground">
                                                            Select a category
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
                                    ? "Update Service"
                                    : "Create Service"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
 
export default Service;