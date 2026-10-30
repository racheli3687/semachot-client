import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "../api/authApi";
import type { UpdateMeRequest } from "../types";
import { useAuth } from "./useAuth";

export function useUpdateProfile() {
  const { setUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (details: UpdateMeRequest) => updateMe(details),

    onSuccess: (updatedUser) => {
      // מעדכן את המשתמשת ב-Context - ה"שלום, ..." בתפריט מתעדכן מיד
      setUser(updatedUser);
      // השם מופיע גם ברשימות חברים וב"הועלה על ידי" - מרעננים הכל
      queryClient.invalidateQueries();
    },
  });
}