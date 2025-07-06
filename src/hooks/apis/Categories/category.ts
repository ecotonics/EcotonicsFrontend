/* eslint-disable */

import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import getApiData from "@/utils/api-fetch/get-api-data";

const { CATEGORIES_SINGLE } = API_ENDPOINTS;
export const useCategory = ({ slug }: { slug?: any }) => {
    const fetchCategory = async () => {
        const response = await getApiData(`${CATEGORIES_SINGLE}${slug}/`);
        return response;
    };

    return useQuery({
        queryKey: [CATEGORIES_SINGLE, slug],
        queryFn: fetchCategory,
        staleTime: 15 * 60 * 1000,
        enabled: !!slug,
    });
};
