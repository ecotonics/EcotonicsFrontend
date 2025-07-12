import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import getApiData from "@/utils/api-fetch/get-api-data";

const { SERVICE_DETAILS } = API_ENDPOINTS;
export const useService = ({ slug }: { slug?: any }) => {
    const fetchService = async () => {
        const response = await getApiData(`${SERVICE_DETAILS}${slug}/`);
        return response;
    };

    return useQuery({
        queryKey: [SERVICE_DETAILS, slug],
        queryFn: fetchService,
        staleTime: 15 * 60 * 1000,
        enabled: !!slug,
    });
};