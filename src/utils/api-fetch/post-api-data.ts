/* eslint-disable */

import useAuthStore from "@/context/zustand-store";
import { refreshTokenIfNeeded } from "../token-refresh/refresh-token-if-needed";

export default async function postApiData(path: string, bodyData: any) {
    const { user, updateTokens } = useAuthStore.getState();
    let accessToken = user?.access_token || "";
    let refreshToken = user?.refresh_token || "";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    await refreshTokenIfNeeded(accessToken, refreshToken);

    const updatedUser = useAuthStore.getState().user;
    accessToken = updatedUser?.access_token || "";

    const formData = new FormData();

    const appendFormData = (data: any, parentKey = "") => {
        if (Array.isArray(data)) {
            data.forEach((val, index) => {
                appendFormData(val, `${parentKey}[${index}]`);
            });
        } else if (
            data &&
            typeof data === "object" &&
            !(data instanceof File)
        ) {
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
        } else {
            formData.append(parentKey, data);
        }
    };

    appendFormData(bodyData);

    let headers = new Headers();
    if (accessToken) {
        headers.append("Authorization", `Bearer ${accessToken}`);
    }

    try {
        const response = await fetch(`${baseUrl}${path}`, {
            method: "POST",
            body: formData,
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(response?.status?.toString());
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}
