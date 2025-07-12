import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import getApiData from "@/utils/api-fetch/get-api-data";

const { DEPARTMENTS } = API_ENDPOINTS;
export const useListDepartments = () => {
    const fetchDepartments = async () => {
        const response = await getApiData(DEPARTMENTS);
        return response;
    };

    return useQuery({
        queryKey: [DEPARTMENTS],
        queryFn: fetchDepartments,
        staleTime: 15 * 60 * 1000,
    });
};