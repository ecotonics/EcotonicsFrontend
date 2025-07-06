/* eslint-disable */
import useAuthStore from "@/context/zustand-store";
import { refreshTokenIfNeeded } from "../token-refresh/refresh-token-if-needed";

export default async function deleteApiData(path: string, bodyData?: any) {
    const { user, updateTokens } = useAuthStore.getState();
    let accessToken = user?.access_token || "";
    let refreshToken = user?.refresh_token || "";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    await refreshTokenIfNeeded(accessToken, refreshToken);

    // update access token after refresh
    const updatedUser = useAuthStore.getState().user;
    accessToken = updatedUser?.access_token || "";

    const formData = new FormData();

    // Recursively append data to formData, excluding keys with empty values
    const appendFormData = (data: any, parentKey = "") => {
        if (data && typeof data === "object" && !(data instanceof File)) {
            Object.keys(data).forEach((key) => {
                const value = data[key];
                if (value === "" || value === null || value === undefined)
                    return;

                const fullKey = parentKey ? `${parentKey}[${key}]` : key;
                if (typeof value === "object" && !(value instanceof File)) {
                    appendFormData(value, fullKey);
                } else {
                    formData.append(fullKey, value);
                }
            });
        }
    };

    appendFormData(bodyData);

    let headers = new Headers();
    if (accessToken) {
        headers.append("Authorization", `Bearer ${accessToken}`);
    }

    try {
        const response = await fetch(`${baseUrl}${path}`, {
            method: "DELETE",
            body: formData,
            headers: headers,
        });

        if (!response.ok) {
            // Handle specific HTTP status codes
            if (response.status === 401) {
                throw new Error("Unauthorized - Please log in again");
            } else if (response.status === 403) {
                throw new Error(
                    "Forbidden - You don't have permission to perform this action"
                );
            } else if (response.status === 404) {
                throw new Error(
                    "Not Found - The requested resource was not found"
                );
            } else {
                throw new Error(
                    `HTTP ${response.status} - ${response.statusText}`
                );
            }
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}
