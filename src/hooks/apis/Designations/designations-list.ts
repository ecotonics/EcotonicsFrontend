import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import getApiData from "@/utils/api-fetch/get-api-data";

const { DESIGNATIONS } = API_ENDPOINTS;
export const useListDesignations = () => {
    const fetchDesignations = async () => {
        const response = await getApiData(DESIGNATIONS);
        return response;
    };

    return useQuery({
        queryKey: [DESIGNATIONS],
        queryFn: fetchDesignations,
        staleTime: 15 * 60 * 1000,
    });
};