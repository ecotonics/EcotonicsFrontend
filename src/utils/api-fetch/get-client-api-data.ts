/* eslint-disable */
import { refreshTokenIfNeeded } from "../token-refresh/refresh-token-if-needed";
import useAuthStore from "@/context/zustand-store";

export default async function getClientApiData(
    path: string,
    customBaseUrl?: string
) {
    const { user, updateTokens } = useAuthStore.getState();
    let accessToken = user?.access_token || "";
    let refreshToken = user?.refresh_token || "";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    await refreshTokenIfNeeded(accessToken, refreshToken);

    // update access token after refresh
    const updatedUser = useAuthStore.getState().user;
    accessToken = updatedUser?.access_token || "";

    try {
        let headersData = {};
        if (accessToken && !customBaseUrl) {
            headersData = {
                Authorization: `Bearer ${accessToken}`,
            };
        }
        const response = await fetch(`${customBaseUrl ?? baseUrl}${path}`, {
            cache: "no-store",
            headers: headersData,
        });

        if (response.ok) {
            return response?.json();
        } else {
            throw new Error(response?.status?.toString());
        }
    } catch (error) {
        throw error;
    }
}
