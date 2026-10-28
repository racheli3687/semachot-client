import type { Role } from "./user";





export interface Group {
  id: number;
  name: string;
  myRole: Role;
  memberCount: number;
  createdAt: string;
  joinCode?: string;
}

export interface CreateGroupRequest {
  name: string;
}

export interface JoinGroupRequest {
  joinCode: string;
}

export interface UpdateGroupRequest {
  name: string;
}

export interface JoinCodeResponse {
  joinCode: string;
}

export interface LeaveGroupResponse {
  left: boolean;
  groupDeleted: boolean;
  newManagerId: number | null;
}