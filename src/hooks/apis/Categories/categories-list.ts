import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import getApiData from "@/utils/api-fetch/get-api-data";

const { CATEGORIES } = API_ENDPOINTS;
export const useListCategories = () => {
    const fetchCategories = async () => {
        const response = await getApiData(CATEGORIES);
        return response;
    };

    return useQuery({
        queryKey: [CATEGORIES],
        queryFn: fetchCategories,
        staleTime: 15 * 60 * 1000,
    });
};
