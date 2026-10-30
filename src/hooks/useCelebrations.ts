
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import type { CelebrationInput, GetCelebrationsParams } from "../types";
import { createCelebration, deleteCelebration, deleteCelebrationImage, getCelebration, getCelebrations, getCelebrationTypes, getTodayCelebrations, updateCelebration, uploadCelebrationImage } from "../api/celebrationsApi";
import { removeCelebrationFromGroup } from "../api/groupsApi";

export function useCelebrationsQuery(
  params: GetCelebrationsParams,
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: ["celebrations", params],
    queryFn: () => getCelebrations(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
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


export function useCelebrationQuery(id: number) {
  return useQuery({
    queryKey: ["celebration", id],
    queryFn: () => getCelebration(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

export function useCreateCelebration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ input }: { input: CelebrationInput }) =>
      createCelebration(input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["celebrations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["celebrationsToday"],
      });
    },
  });
}

export function useUpdateCelebration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: CelebrationInput;
    }) => updateCelebration(id, input),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["celebrations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["celebrationsToday"],
      });
      queryClient.invalidateQueries({
        queryKey: ["celebration", variables.id],
      });
    },
  });
}

export function useUploadCelebrationImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      file,
    }: {
      id: number;
      file: File;
    }) => uploadCelebrationImage(id, file),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["celebrations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["celebration", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["celebrationsToday"] });
    },
  });
}
export function useDeleteCelebration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCelebration(id),

    onSuccess: (_data, id) => {
      // השמחה כבר לא קיימת - מוחקים אותה מהמטמון
      queryClient.removeQueries({ queryKey: ["celebration", id] });
      // הרשימות השתנו - מרעננים
      queryClient.invalidateQueries({ queryKey: ["celebrations"] });
      queryClient.invalidateQueries({ queryKey: ["celebrationsToday"] });
    },
  });
}

export function useDeleteCelebrationImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCelebrationImage(id),

    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["celebration", id] });
      queryClient.invalidateQueries({ queryKey: ["celebrations"] });
      queryClient.invalidateQueries({ queryKey: ["celebrationsToday"] });
    },
  });
}