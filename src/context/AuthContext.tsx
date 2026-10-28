import { AuthContext } from "./authContextObject";
import type { LoginRequest, RegisterRequest, User } from "../types";
import { useState } from "react";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { getToken, removeToken } from "../utils/token";
import {

    login as loginRequest,
    register as registerRequest,
} from "../api/authApi";
import { useEffect } from "react";
import { getMe } from "../api/authApi";
import { ApiError } from "../api/api";





type AuthProviderProps =
    {
        children: ReactNode;
    };
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);

    const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">(
        () => { return getToken() ? "loading" : "unauthenticated" }
    );

    useEffect(() => {
        async function loadUser() {

            if (!getToken()) {
                setStatus("unauthenticated")
                return;
            }
            try {
                const currentUser = await getMe();
                setUser(currentUser);
                setStatus("authenticated");
            }
            catch(err) {
                if(err instanceof ApiError &&err.status===401)
                    removeToken();
                setUser(null);
                setStatus("unauthenticated");
            }

        }
        void loadUser();
    }, []);

    const queryClient = useQueryClient();

    return (
        <AuthContext.Provider value={{
            user, status,
            login: async (params: LoginRequest) => {
                const response = await loginRequest(params);
                setUser(response.user);
                setStatus("authenticated");
            },
            register: async (params: RegisterRequest) => {
                const response = await registerRequest(params);

                setUser(response.user);
                setStatus("authenticated");
            },
            logout: () => {
                removeToken();
                setUser(null);
                setStatus("unauthenticated");
                queryClient.clear();

            },
            setUser
        }}>{children}</AuthContext.Provider>
    )
}