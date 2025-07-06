/* eslint-disable */
import Cookies from "js-cookie";
import { refreshTokenIfNeeded } from "../token-refresh/refresh-token-if-needed";

export default async function patchApiData(path: string, bodyData?: any) {
    let accessToken = Cookies.get("access_token") || "";
    let refreshToken = Cookies.get("refresh_token") || "";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    await refreshTokenIfNeeded(accessToken, refreshToken);

    accessToken = Cookies.get("access_token") || "";

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
                if (value === null || value === undefined) return;

                const fullKey = parentKey ? `${parentKey}${key}` : key;
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
            method: "PATCH",
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
