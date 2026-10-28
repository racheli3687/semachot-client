import { apiRequest } from "./api";
import  type { CreateGroupRequest , Group, JoinGroupRequest, UpdateGroupRequest,JoinCodeResponse,LeaveGroupResponse,Member } from "../types/index"



// קבלת רשימת הקבוצות של המשתמש המחובר
export async function getGroups():Promise<Group[]>
{
    return apiRequest<Group[]>("/api/groups")
}



//יצירת קבוצה חדשה
export async function createGroupRequest(details: CreateGroupRequest):Promise<Group>
{
   return apiRequest<Group>("/api/groups",{method:"POST",body:JSON.stringify(details)});

}

//
export async function joinGroup(details: JoinGroupRequest):Promise<Group>
{
    return apiRequest<Group>("/api/groups/join",{method:"POST",body:JSON.stringify(details)});
}

// קבלת פרטי קבוצה לפי המזהה שלה
export async function getGroup(groupId:number):Promise<Group>
{
    return apiRequest<Group>(`/api/groups/${groupId}`);
}

// שינוי שם קבוצה
export async function  updateGroup(groupId:number,details:UpdateGroupRequest):Promise<Group>
{
    return apiRequest<Group>(`/api/groups/${groupId}`,{method:"PATCH",body:JSON.stringify(details)});
}

// מחיקת קבוצה
export async function deleteGroup(groupId:number):Promise<void>
{
    return apiRequest<void>(`/api/groups/${groupId}`,{method:"DELETE"});
}
// יצירת קוד הצטרפות חדש
export async function regenerateJoinCode(groupId:number):Promise<JoinCodeResponse>
{
    return apiRequest<JoinCodeResponse>(`/api/groups/${groupId}/join-code`,{method:"POST"});
}

// יציאה מקבוצה
export async function leaveGroup(groupId:number):Promise<LeaveGroupResponse>
{
    return apiRequest<LeaveGroupResponse>(`/api/groups/${groupId}/leave`,{method:"POST"});
}

// קבלת רשימת חברי הקבוצה
export async function getGroupMembers(groupId:number):Promise<Member[]>
{
    return apiRequest<Member[]>(`/api/groups/${groupId}/members`)
}
// הסרת חבר מהקבוצה
export async function removeGroupMember(groupId:number,userId:number):Promise<void>
{
    return apiRequest<void>(`/api/groups/${groupId}/members/${userId}`,{method:"DELETE"});

}
// הסרת שמחה מהקבוצה, בלי למחוק את השמחה עצמה
export async function removeCelebrationFromGroup(groupId:number,celebrationId:number):Promise<void>
{
    return apiRequest<void>( `/api/groups/${groupId}/celebrations/${celebrationId}`,{method: "DELETE",})
}