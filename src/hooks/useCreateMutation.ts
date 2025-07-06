/* eslint-disable */

import postApiData from "@/utils/api-fetch/post-api-data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import deleteApiData from "@/utils/api-fetch/delete-api-data";
import patchApiData from "@/utils/api-fetch/patch-api-data";
import putApiData from "@/utils/api-fetch/put-api-data";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useZustandStore from "@/context/zustand-store";
import { useModal } from "@/context/modal-store";
import React from "react";
import ErrorPopupModal from "@/components/customize-components/modals/ErrorPopupModal";

function useCreateMutation(mutationData: {
    method: any;
    endpoint: string;
    submitData: Record<string, unknown>;
    redirectPath?: string;
    invalidateQueries?: string[];
    inputRefs?: any;
    handleSuccess?: (_response: any) => void;
    handleError?: (_error: any) => void;
    isToast?: boolean;
}) {
    const {
        method,
        endpoint,
        submitData,
        redirectPath,
        invalidateQueries,
        inputRefs,
        handleSuccess,
        handleError,
        isToast = false,
    } = mutationData;
    const router = useRouter();
    const queryClient = useQueryClient();
    const { openModal, closeModal } = useModal();

    const createMutation = useMutation({
        mutationFn: async (mutationProps: any = {}) => {
            const { extraEndpoint = "", extraSubmitData = {} } = mutationProps;

            const finalEndpoint = endpoint + extraEndpoint;
            const finalSubmitData = {
                ...submitData,
                ...extraSubmitData,
            };
            const response =
                method === "delete"
                    ? await deleteApiData(finalEndpoint, finalSubmitData)
                    : method === "patch"
                    ? await patchApiData(finalEndpoint, finalSubmitData)
                    : method === "put"
                    ? await putApiData(finalEndpoint, finalSubmitData)
                    : await postApiData(finalEndpoint, finalSubmitData);
            const { status_code, message, data, errors } = response;

            if (status_code === 6001) {
                const form_errors = <any>{};
                const general_errors = errors?.general_errors;

                Object.keys(errors?.form_errors).forEach((key) => {
                    form_errors[key] = errors?.form_errors[key][0];
                });

                throw { message, form_errors, general_errors, errors: data };
            }
            return response;
        },

        onSuccess: (response) => {
            toast.dismiss();
            const { message } = response;
            if (isToast) {
                toast.success(message?.title ?? "Request successful", {
                    description:
                        message?.body ||
                        "You have successfully completed the action",
                    position: "top-right",
                });
            }
            if (invalidateQueries && invalidateQueries?.length) {
                invalidateQueries.forEach(async (invalidateQuery: string) => {
                    try {
                        await queryClient.invalidateQueries({
                            queryKey: [invalidateQuery],
                        });
                    } catch (error) {
                        throw error;
                    }
                });
            }
            if (redirectPath) {
                if (redirectPath === "ROUTER_BACK") {
                    router.back();
                } else if (redirectPath !== "") {
                    router.push(redirectPath);
                }
            }
            if (handleSuccess) {
                handleSuccess(response);
            }
        },

        onError: (error: any) => {
            if (handleError) {
                handleError(error);
            }

            if (inputRefs?.current) {
                focusInputFieldWithError(
                    inputRefs,
                    inputRefs?.current,
                    error?.form_errors
                );
            }
            setTimeout(() => {
                toast.dismiss();
            });

            if (error?.general_errors?.length > 0) {
                if (isToast) {
                    const errorMessages = error.general_errors.join("\\n");
                    toast.error(error?.message?.title ?? "An error occurred!", {
                        description: errorMessages,
                        position: "top-right",
                    });
                } else {
                    const allErrors = [
                        ...(error?.general_errors || []),
                        ...Object.entries(error?.form_errors || {}).map(
                            ([field, messages]) => `${field}: ${messages}`
                        ),
                    ];

                    openModal(
                        React.createElement(ErrorPopupModal, {
                            data: {
                                title:
                                    error?.message?.title ??
                                    "An error occurred!",
                                errors: allErrors,
                            },
                            onClose: () => closeModal(),
                        })
                    );
                }
            }
        },
    });

    return {
        ...createMutation,
        mutate: (data?: any) => createMutation.mutate(data),
    };
}

const focusInputFieldWithError = (
    inputRefs: any,
    inputRefCurrents: any,
    errors: any
) => {
    const findFirstCommonKey = <T extends object, U extends object>(
        obj1: T,
        obj2: U
    ): string => {
        const keysObj1 = Object.keys(obj1);
        for (const key of keysObj1) {
            if (key in obj2) {
                return key;
            }
        }
        return "";
    };

    const firstCommonKey = findFirstCommonKey(inputRefCurrents, errors);
    const inputElement = inputRefs.current[firstCommonKey];

    if (inputElement) {
        inputElement.focus();
        inputElement?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }
};

export default useCreateMutation;
