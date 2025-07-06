import useAuthStore from "@/context/zustand-store";

export async function refreshTokenIfNeeded(
    accessToken: string,
    refreshToken: string
) {
    if (!accessToken || !refreshToken) {
        return;
    }

    try {
        // Decode the access token to check expiration
        const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        const tokenExpiry = tokenPayload.exp;

        // If token expires in the next 5 minutes, refresh it
        if (tokenExpiry - currentTime < 300) {
            console.log("Token expiring soon, refreshing...");

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const response = await fetch(`${baseUrl}auth/token/refresh/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refresh: refreshToken,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.access) {
                    // Update tokens in the store
                    useAuthStore
                        .getState()
                        .updateTokens(data.access, refreshToken);
                    console.log("Token refreshed successfully");
                }
            } else {
                console.error("Failed to refresh token");
                // If refresh fails, logout the user
                useAuthStore.getState().logout();
            }
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
        // If there's an error, logout the user
        useAuthStore.getState().logout();
    }
}
