
import { createContext } from "react";
import type { LoginRequest, RegisterRequest, User } from "../types";

export type AuthContextValue = {
    user: User | null;
    status: "loading" | "authenticated" | "unauthenticated";
    login: (params: LoginRequest) => Promise<void>;
    register: (params: RegisterRequest) => Promise<void>;
    logout: () => void;
    setUser: (user: User) => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
    undefined
);
