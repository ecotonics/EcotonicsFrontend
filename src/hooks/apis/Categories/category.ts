/* eslint-disable */

import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import getApiData from "@/utils/api-fetch/get-api-data";

const { CATEGORY_DETAILS } = API_ENDPOINTS;
export const useCategory = ({ slug }: { slug?: string }) => {
    const fetchCategory = async () => {
        const response = await getApiData(`${CATEGORY_DETAILS}${slug}/`);
        return response;
    };

    return useQuery({
        queryKey: [CATEGORY_DETAILS, slug],
        queryFn: fetchCategory,
        staleTime: 15 * 60 * 1000,
        enabled: !!slug,
    });
};
