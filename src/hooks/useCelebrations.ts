
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import type { GetCelebrationsParams } from "../types";
import { getCelebrations, getCelebrationTypes, getTodayCelebrations } from "../api/celebrationsApi";
import { removeCelebrationFromGroup } from "../api/groupsApi";

export function useCelebrationsQuery(params: GetCelebrationsParams) {
  return useQuery({
    queryKey: ["celebrations", params],
    queryFn: () => getCelebrations(params),
    placeholderData: keepPreviousData
  });
}

export function useRemoveCelebrationFromGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      celebrationId,
    }: {
      groupId: number;
      celebrationId: number;
    }) => removeCelebrationFromGroup(groupId, celebrationId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["celebrations"],
      });

      queryClient.invalidateQueries({
        queryKey: ["celebration", variables.celebrationId],
      });
    },
  });
}

export function useTodayCelebrationsQuery() {
  return useQuery(
    {
      queryKey: ["celebrationsToday"],
      queryFn: getTodayCelebrations
    }
  );
}

export function useCelebrationTypesQuery() {
  return useQuery(
    {
      queryKey: ["celebrationTypes"],
      queryFn: getCelebrationTypes,
      staleTime: Infinity
    }
  );
}
