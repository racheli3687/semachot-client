import { useNavigate, useParams } from "react-router-dom";
import { useDeleteGroup, useGroupQuery, useLeaveGroup } from "../hooks/useGroups";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import GroupMembers from "../components/groups/GroupMembers";
import UpdateGroupForm from "../components/groups/UpdateGroupForm";
import GroupJoinCode from "../components/groups/GroupJoinCode";
import GroupCelebrations from "../components/groups/GroupCelebrations";

export default function GroupPage() {

   const navigate = useNavigate();
   const leaveMutation = useLeaveGroup();
   const deleteMutation = useDeleteGroup();
   const { id:groupId } = useParams<{ id: string }>();
   const id = Number(groupId);
   const groupQuery = useGroupQuery(id);

   if (!id || !Number.isFinite(Number(id)) || Number(id) <= 0) {
      return <p>מזהה קבוצה לא תקין</p>;
   }

   if (groupQuery.isPending) {
      return <Loading message="טוען את פרטי הקבוצה..." />;
   }

   if (groupQuery.isError) {
      return <ErrorMessage error={groupQuery.error} />;
   }

   const group = groupQuery.data;



   async function handleLeaveGroup() {
      const confirmed = window.confirm("האם את בטוחה שברצונך לעזוב את הקבוצה?");
      if (!confirmed) return;

      try {
         const result = await leaveMutation.mutateAsync(group.id);

         if (result.groupDeleted) {
            alert("הקבוצה נמחקה כי לא נותרו בה חברים.");
         }

         navigate("/groups");
      } catch (error) {
         alert(
            error instanceof Error
               ? error.message
               : "אירעה שגיאה בעזיבת הקבוצה."
         );
      }
   }

   async function handleDeleteGroup() {
      const confirmed = window.confirm(
         `האם למחוק את הקבוצה "${group.name}"? פעולה זו עלולה להיות בלתי הפיכה.`
      );

      if (!confirmed) return;

      try {
         await deleteMutation.mutateAsync(group.id);
         navigate("/groups");
      } catch (error) {
         alert(
            error instanceof Error
               ? error.message
               : "אירעה שגיאה במחיקת הקבוצה."
         );
      }
   }

   return (
      <main>
         <h1>{group.name}</h1>
         <p>תפקיד: {group.myRole === "MANAGER" ? "מנהלת" : "חברה"}</p>
         <p>מספר חברות וחברים: {group.memberCount}</p>
         <GroupCelebrations groupId={group.id}></GroupCelebrations>

         <GroupMembers
            groupId={group.id}
            isManager={group.myRole === "MANAGER"}
         />

         <button
            type="button"
            onClick={handleLeaveGroup}
            disabled={leaveMutation.isPending}
         >
            {leaveMutation.isPending ? "עוזבת..." : "עזיבת הקבוצה"}
         </button>

         {group.myRole === "MANAGER" && (
            <UpdateGroupForm
               groupId={group.id}
               currentName={group.name}
            />
         )}

         {group.myRole === "MANAGER" && (
            <GroupJoinCode
               groupId={group.id}
               currentCode={group.joinCode}
            />
         )}

         {group.myRole === "MANAGER" && (
            <button
               type="button"
               onClick={handleDeleteGroup}
               disabled={deleteMutation.isPending}
            >
               {deleteMutation.isPending ? "מוחקת..." : "מחיקת הקבוצה"}
            </button>
         )}
      </main>
   );
}