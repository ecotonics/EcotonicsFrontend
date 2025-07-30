import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import getApiData from "@/utils/api-fetch/get-api-data";

const { STAFF_DETAILS } = API_ENDPOINTS;
export const useStaff = ({ slug }: { slug?: string }) => {
    const fetchStaff = async () => {
        const response = await getApiData(`${STAFF_DETAILS}${slug}/`);
        return response;
    };

    return useQuery({
        queryKey: [STAFF_DETAILS, slug],
        queryFn: fetchStaff,
        staleTime: 15 * 60 * 1000,
        enabled: !!slug,
    });
};