import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import getApiData from "@/utils/api-fetch/get-api-data";

const { STAFFS } = API_ENDPOINTS;
export const useListStaffs = () => {
    const fetchStaffs = async () => {
        const response = await getApiData(STAFFS);
        return response;
    };

    return useQuery({
        queryKey: [STAFFS],
        queryFn: fetchStaffs,
        staleTime: 15 * 60 * 1000,
    });
};