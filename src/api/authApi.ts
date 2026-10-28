import type { LoginRequest,LoginResponse,RegisterRequest,User,UpdateMeRequest } from "../types/index";
import { saveToken } from "../utils/token";
import {apiRequest} from "./api";


export async function login(credentials:LoginRequest):Promise<LoginResponse>
{
    const path="/api/auth/login";
    const response=await apiRequest<LoginResponse>(path,{method:"POST",body:JSON.stringify(credentials)});
    saveToken(response.token);
    return response;
}


export async function register(credentials:RegisterRequest):Promise<LoginResponse>{
    
    const path="/api/auth/register";

    const response=await apiRequest<LoginResponse>(path,{method:"POST",body:JSON.stringify(credentials)});
    saveToken(response.token);
    return response

}

export async function getMe():Promise<User>
{
    return apiRequest<User>("/api/auth/me");
}

export async function updateMe(details:UpdateMeRequest):Promise<User>
{
    return apiRequest<User>("/api/auth/me",{method:"PATCH",body:JSON.stringify(details)});
}