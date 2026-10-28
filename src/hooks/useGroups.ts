
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getGroups,
  getGroup,
  getGroupMembers,
  createGroupRequest,
  joinGroup,
  updateGroup,
  regenerateJoinCode,
  removeGroupMember,
  leaveGroup,
  deleteGroup,
  
} from "../api/groupsApi";

import type {
  CreateGroupRequest,
  JoinGroupRequest,
  UpdateGroupRequest,
} from "../types";

export function useGroupsQuery() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (details: CreateGroupRequest) =>
      createGroupRequest(details),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    },
  });
}

export function useJoinGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (details: JoinGroupRequest) =>
      joinGroup(details),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    },
  });
}

export function useGroupQuery(groupId: number) {
  

  return useQuery({
    queryKey: ["groups", groupId],
    queryFn: () => getGroup(groupId),
    enabled:Number.isFinite(groupId) && groupId > 0,
  });
}

export function useGroupMembersQuery(groupId: number) {
  return useQuery({
    queryKey: ["groups", groupId, "members"],
    queryFn: () => getGroupMembers(groupId),
    enabled: Number.isFinite(groupId) && groupId > 0,
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      details,
    }: {
      groupId: number;
      details: UpdateGroupRequest;
    }) => updateGroup(groupId, details),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });

      queryClient.invalidateQueries({
        queryKey: ["groups", variables.groupId],
      });
    },
  });
}

export function useRegenerateJoinCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: number) => regenerateJoinCode(groupId),
    onSuccess: (_data, groupId) => {
      queryClient.invalidateQueries({
        queryKey: ["groups", groupId],
      });
    },
  });
}

export function useRemoveGroupMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      userId,
    }: {
      groupId: number;
      userId: number;
    }) => removeGroupMember(groupId, userId),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", variables.groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["groups",variables.groupId],
      });
    },
  });
}

export function useLeaveGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: number) => leaveGroup(groupId),

    onSuccess: (_data, groupId) => {
      queryClient.removeQueries({
        queryKey: ["groups", groupId],
      });
      queryClient.removeQueries({
        queryKey: ["groupMembers", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });

      queryClient.invalidateQueries({
        queryKey: ["celebrations"],
      });
    },
  });
}



export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: number) => deleteGroup(groupId),

    onSuccess: (_data, groupId) => {
      queryClient.removeQueries({
        queryKey: ["groups", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    },
  });
}