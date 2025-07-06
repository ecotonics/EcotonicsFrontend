import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import getApiData from "@/utils/api-fetch/get-api-data";

const { SERVICES } = API_ENDPOINTS;
export const useListServices = () => {
    const fetchServices = async () => {
        const response = await getApiData(SERVICES);
        return response;
    };

    return useQuery({
        queryKey: [SERVICES],
        queryFn: fetchServices,
        staleTime: 15 * 60 * 1000,
    });
};