import useAuthStore from "@/context/zustand-store";

export default async function getApiData(endpoint: string) {
    const { user } = useAuthStore.getState();
    const accessToken = user?.access_token || "";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    try {
        let headersData = {};
        if (accessToken) {
            headersData = {
                Authorization: `Bearer ${accessToken}`,
            };
        }
        const response = await fetch(`${baseUrl}${endpoint}`, {
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
