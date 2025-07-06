/* eslint-disable */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import deleteApiData from "@/utils/api-fetch/delete-api-data";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UseDeleteMutationProps {
    endpoint: string;
    invalidateQueries?: string[];
    redirectPath?: string;
    onSuccess?: (response: any) => void;
    onError?: (error: any) => void;
    isToast?: boolean;
}

export function useDeleteMutation({
    endpoint,
    invalidateQueries = [],
    redirectPath,
    onSuccess,
    onError,
    isToast = true,
}: UseDeleteMutationProps) {
    const queryClient = useQueryClient();
    const router = useRouter();

    const deleteMutation = useMutation({
        mutationFn: async (data: any = {}) => {
            const response = await deleteApiData(endpoint, data);
            const { status_code, message, errors } = response;

            if (status_code === 6001) {
                const form_errors: any = {};
                const general_errors = (errors as any)?.general_errors || [];

                if (
                    (errors as any)?.form_errors &&
                    typeof (errors as any).form_errors === "object"
                ) {
                    Object.keys((errors as any).form_errors).forEach(
                        (key: string) => {
                            if (
                                Array.isArray((errors as any).form_errors[key])
                            ) {
                                form_errors[key] = (errors as any).form_errors[
                                    key
                                ][0];
                            }
                        }
                    );
                }

                throw { message, form_errors, general_errors };
            }
            return response;
        },

        onSuccess: (response) => {
            toast.dismiss();
            const { message } = response;

            if (isToast) {
                toast.success(message?.title ?? "Deleted successfully", {
                    description:
                        message?.body || "Item has been deleted successfully",
                    position: "top-right",
                });
            }

            // Invalidate queries to refresh data
            if (invalidateQueries.length > 0) {
                invalidateQueries.forEach(async (queryKey: string) => {
                    try {
                        await queryClient.invalidateQueries({
                            queryKey: [queryKey],
                        });
                    } catch (error) {
                        console.error("Error invalidating query:", error);
                    }
                });
            }

            // Handle redirect
            if (redirectPath) {
                if (redirectPath === "ROUTER_BACK") {
                    router.back();
                } else if (redirectPath !== "") {
                    router.push(redirectPath);
                }
            }

            if (onSuccess) {
                onSuccess(response);
            }
        },

        onError: (error: any) => {
            if (onError) {
                onError(error);
            }

            setTimeout(() => {
                toast.dismiss();
            });

            // Handle unauthorized and other HTTP errors
            if (error?.message) {
                if (isToast) {
                    if (error.message.includes("Unauthorized")) {
                        toast.error("Unauthorized", {
                            description: "Please log in again to continue",
                            position: "top-right",
                        });
                    } else if (error.message.includes("Forbidden")) {
                        toast.error("Access Denied", {
                            description:
                                "You don't have permission to perform this action",
                            position: "top-right",
                        });
                    } else if (error.message.includes("Not Found")) {
                        toast.error("Not Found", {
                            description: "The requested resource was not found",
                            position: "top-right",
                        });
                    } else {
                        toast.error("Delete failed!", {
                            description: error.message,
                            position: "top-right",
                        });
                    }
                }
            } else if (error?.general_errors?.length > 0) {
                if (isToast) {
                    const errorMessages = error.general_errors.join("\\n");
                    toast.error(error?.message?.title ?? "Delete failed!", {
                        description: errorMessages,
                        position: "top-right",
                    });
                }
            } else {
                if (isToast) {
                    toast.error("Delete failed!", {
                        description: "An unexpected error occurred",
                        position: "top-right",
                    });
                }
            }
        },
    });

    return {
        ...deleteMutation,
        deleteItem: (data?: any) => deleteMutation.mutate(data),
    };
}
