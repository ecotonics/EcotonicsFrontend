import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import getApiData from "@/utils/api-fetch/get-api-data";

const { DESIGNATION_DETAILS } = API_ENDPOINTS;
export const useDesignation = ({ slug }: { slug?: any }) => {
    const fetchDesignation = async () => {
        const response = await getApiData(`${DESIGNATION_DETAILS}${slug}/`);
        return response;
    };

    return useQuery({
        queryKey: [DESIGNATION_DETAILS, slug],
        queryFn: fetchDesignation,
        staleTime: 15 * 60 * 1000,
        enabled: !!slug,
    });
};