import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import getApiData from "@/utils/api-fetch/get-api-data";

const { DEPARTMENT_DETAILS } = API_ENDPOINTS;
export const useDepartment = ({ slug }: { slug?: string }) => {
    const fetchDepartment = async () => {
        const response = await getApiData(`${DEPARTMENT_DETAILS}${slug}/`);
        return response;
    };

    return useQuery({
        queryKey: [DEPARTMENT_DETAILS, slug],
        queryFn: fetchDepartment,
        staleTime: 15 * 60 * 1000,
        enabled: !!slug,
    });
};