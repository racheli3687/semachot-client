import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeleteGroup, useGroupQuery, useLeaveGroup } from "../hooks/useGroups";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import GroupMembers from "../components/groups/GroupMembers";
import UpdateGroupForm from "../components/groups/UpdateGroupForm";
import GroupJoinCode from "../components/groups/GroupJoinCode";
import GroupCelebrations from "../components/groups/GroupCelebrations";
import { useToast } from "../hooks/useToast";
import { motion } from "motion/react";
import { fadeUp, stagger } from "../utils/motion";
import { groupGradient, initials } from "../utils/celebrationVisuals";
import Icon from "../components/ui/Icon";
import { ApiError } from "../api/api";

export default function GroupPage() {

   const navigate = useNavigate();
   const leaveMutation = useLeaveGroup();
   const deleteMutation = useDeleteGroup();
   const { showToast } = useToast();
   const { id: groupId } = useParams<{ id: string }>();
   const id = Number(groupId);
   const groupQuery = useGroupQuery(id);

   if (!id || !Number.isFinite(Number(id)) || Number(id) <= 0) {
      return <p className="state-box">מזהה קבוצה לא תקין</p>;
   }

   if (groupQuery.isPending) {
      return <Loading message="טוען את פרטי הקבוצה..." />;
   }

   if (groupQuery.isError) {
      // 404 = הקבוצה לא קיימת, או שאני לא חברה בה
      if (groupQuery.error instanceof ApiError && groupQuery.error.status === 404) {
         return (
            <section className="state-box">
               <Icon name="search" className="size-10 text-accent" />
               <p>הקבוצה לא נמצאה</p>
               <Link to="/groups" className="btn btn-secondary">חזרה לקבוצות שלי</Link>
            </section>
         );
      }
      return <ErrorMessage error={groupQuery.error} />;
   }

   const group = groupQuery.data;



   async function handleLeaveGroup() {
      const confirmed = window.confirm("האם את בטוחה שברצונך לעזוב את הקבוצה?");
      if (!confirmed) return;

      try {
         const result = await leaveMutation.mutateAsync(group.id);

         if (result.groupDeleted) {
            showToast("הקבוצה נמחקה כי לא נותרו בה חברים.", "info");
         }

         navigate("/groups");
      } catch (error) {
         showToast(
            error instanceof Error
               ? error.message
               : "אירעה שגיאה בעזיבת הקבוצה.",
            "error"
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
         showToast(
            error instanceof Error
               ? error.message
               : "אירעה שגיאה במחיקת הקבוצה.",
            "error"
         );
      }
   }

   const isManager = group.myRole === "MANAGER";

   return (
      <motion.section initial="hidden" animate="show" variants={stagger(0.08)} className="flex flex-col gap-6">
         {/* ראש הדף */}
         <motion.header
            variants={fadeUp}
            className="mesh relative flex flex-wrap items-end gap-6 overflow-hidden rounded-[2rem] p-7 sm:p-11"
         >
            <motion.span
               className={`grid size-20 place-items-center rounded-[1.5rem] bg-gradient-to-br ${groupGradient(group.id)} text-4xl font-extrabold text-white shadow-float sm:size-24`}
               initial={{ scale: 0.5, rotate: -15 }}
               animate={{ scale: 1, rotate: 0 }}
               transition={{ type: "spring", stiffness: 220, damping: 13 }}
               aria-hidden="true"
            >
               {initials(group.name)}
            </motion.span>
            <div>
               <h1 className="text-[2.6rem] leading-[1.02] font-extrabold tracking-[-0.03em] sm:text-6xl">{group.name}</h1>
               <div className="mt-4 flex flex-wrap gap-2">
                  <p className="glass flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold text-ink">{isManager ? <><Icon name="crown" className="size-4" /> את מנהלת את הקבוצה</> : "את חברה בקבוצה"}</p>
                  <p className="glass flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold text-ink"><Icon name="users" className="size-4" /> {group.memberCount} חברות וחברים</p>
               </div>
            </div>
         </motion.header>

         <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
            <motion.div variants={fadeUp} className="min-w-0">
               <GroupCelebrations groupId={group.id}></GroupCelebrations>
            </motion.div>

            <motion.aside variants={fadeUp} className="flex flex-col gap-4">
               {isManager && (
                  <GroupJoinCode
                     groupId={group.id}
                     currentCode={group.joinCode}
                  />
               )}

               <GroupMembers
                  groupId={group.id}
                  isManager={isManager}
               />

               <section className="panel flex flex-col gap-3" aria-label="הגדרות הקבוצה">
                  <h2 className="card-title">הגדרות</h2>

                  {isManager && (
                     <UpdateGroupForm
                        groupId={group.id}
                        currentName={group.name}
                     />
                  )}

                  <button
                     type="button"
                     className="btn btn-secondary justify-start"
                     onClick={handleLeaveGroup}
                     disabled={leaveMutation.isPending}
                  >
                     <Icon name="logout" /> {leaveMutation.isPending ? "עוזבת..." : "עזיבת הקבוצה"}
                  </button>

                  {isManager && (
                     <button
                        type="button"
                        className="btn btn-danger justify-start bg-danger-soft"
                        onClick={handleDeleteGroup}
                        disabled={deleteMutation.isPending}
                     >
                        <Icon name="trash" /> {deleteMutation.isPending ? "מוחקת..." : "מחיקת הקבוצה"}
                     </button>
                  )}
               </section>
            </motion.aside>
         </div>
      </motion.section>
   );
}
