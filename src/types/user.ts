export interface User {
    id: number;
    fullName: string;
    email: string;
    emailReminders: boolean;
    createdAt: string;
}

// 2. Role
export type Role = "MANAGER" | "MEMBER";


export interface Member {
    userId: number;
    fullName: string;
    email: string;
    role: Role;
    joinedAt: string;
}

export interface UpdateMeRequest {
  fullName: string;
  emailReminders: boolean;
}