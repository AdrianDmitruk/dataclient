import { getAllPersons } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useAllPersons = (page?: number, pageSize?: number) => {
  return useQuery({
    queryKey: ["persons", page, pageSize],
    queryFn: () => getAllPersons({ page, pageSize }),
  });
};
