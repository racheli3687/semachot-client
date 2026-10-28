import type { User } from "./user";


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: string;
  user: User
}


export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}