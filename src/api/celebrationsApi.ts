import type { GetCelebrationsParams, PaginatedResponse, Celebration, CelebrationInput, CelebrationTypeOption } from "../types";
import { apiRequest } from "./api";


// קבלת רשימת שמחות עם אפשרויות סינון, חיפוש ומיון
export async function getCelebrations(
  params: GetCelebrationsParams = {}
): Promise<PaginatedResponse<Celebration>> {
  const query = new URLSearchParams();

  if (params.groupId !== undefined) {
    query.set("groupId", String(params.groupId));
  }

  if (params.type) {
    query.set("type", params.type);
  }

  if (params.when) {
    query.set("when", params.when);
  }

  if (params.hebrewYear !== undefined) {
    query.set("hebrewYear", String(params.hebrewYear));
  }

  if (params.hebrewMonth) {
    query.set("hebrewMonth", params.hebrewMonth);
  }

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.mine === true) {
    query.set("mine", "true");
  }

  if (params.sort) {
    query.set("sort", params.sort);
  }

  if (params.page !== undefined) {
    query.set("page", String(params.page));
  }

  if (params.pageSize !== undefined) {
    query.set("pageSize", String(params.pageSize));
  }

  const queryString = query.toString();
  const path = queryString
    ? `/api/celebrations?${queryString}`
    : "/api/celebrations";

  return apiRequest<PaginatedResponse<Celebration>>(path);
}

// קבלת השמחות של היום בכל הקבוצות של המשתמש
export async function getTodayCelebrations(): Promise<Celebration[]> {
  return apiRequest<Celebration[]>("/api/celebrations/today");
}


// קבלת פרטי שמחה לפי המזהה שלה
export async function getCelebration(
  id: number
): Promise<Celebration> {
  return apiRequest<Celebration>(`/api/celebrations/${id}`);
}

//יצירת שמחה
export async function createCelebration(params: CelebrationInput): Promise<Celebration> {
  return apiRequest<Celebration>("/api/celebrations", { method: "POST", body: JSON.stringify(params) })

}




// עדכון שמחה קיימת
export function updateCelebration(
  id: number,
  details: CelebrationInput
): Promise<Celebration> {
  return apiRequest<Celebration>(`/api/celebrations/${id}`, {
    method: "PUT",
    body: JSON.stringify(details),
  });
}

// מחיקת שמחה
export function deleteCelebration(
  id: number
): Promise<void> {
  return apiRequest<void>(`/api/celebrations/${id}`, {
    method: "DELETE",
  });
}

// העלאה או החלפה של תמונת השמחה
export async function uploadCelebrationImage(
  id: number,
  image: File
): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append("image", image);

  return apiRequest<{ imageUrl: string }>(
    `/api/celebrations/${id}/image`,
    {
      method: "PUT",
      body: formData,
    }
  );
}

// הסרת תמונת השמחה
export function deleteCelebrationImage(
  id: number
): Promise<void> {
  return apiRequest<void>(
    `/api/celebrations/${id}/image`,
    {
      method: "DELETE",
    }
  );
}


export function getCelebrationTypes(): Promise<CelebrationTypeOption[]> {
  return apiRequest<CelebrationTypeOption[]>(
    "/api/celebration-types"
  );
}
