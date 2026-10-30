
import { useCelebrationsQuery, useRemoveCelebrationFromGroup } from "../../hooks/useCelebrations";
import CelebrationCard from "../celebrations/CelebrationCard";
import EmptyState from "../EmptyState";
import { CardSkeletonGrid } from "../Skeleton";
import { motion } from "motion/react";
import { fadeUp, stagger } from "../../utils/motion";
import Icon from "../ui/Icon";
import ErrorMessage from "../ErrorMessage";
import { Link } from "react-router-dom";

interface GroupCelebrationsProps {
  groupId: number;
}

export default function GroupCelebrations({
  groupId,
}: GroupCelebrationsProps) {
  const {
    data,
    isPending,
    isError,
    error,
  } = useCelebrationsQuery({ groupId });

  const removeMutation = useRemoveCelebrationFromGroup();

  async function handleRemove(celebrationId: number) {
    const confirmed = window.confirm(
      "להסיר את השמחה מהקבוצה? השמחה עצמה לא תימחק."
    );

    if (!confirmed) return;

    try {
      await removeMutation.mutateAsync({
        groupId,
        celebrationId,
      });
    } catch {
      // השגיאה מוצגת בהמשך הקומפוננטה
    }
  }

  if (isPending) {
    return <CardSkeletonGrid count={4} label="טוען את שמחות הקבוצה..." />;
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  if (!data || data.items.length === 0) {
    return (
      <EmptyState message="עוד אין שמחות בקבוצה">
        <Link to="/celebrations/new" className="btn btn-primary"><Icon name="plus" /> הוספת שמחה</Link>
      </EmptyState>
    );
  }

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-3">
        <h2 className="section-title">שמחות קרובות</h2>
        <Link to={`/?groupId=${groupId}`} className="flex items-center gap-1 text-[0.95rem] font-medium">לכל השמחות <Icon name="arrowLeft" className="size-4" /></Link>
      </div>

      {removeMutation.isError && (
        <div className="mb-3"><ErrorMessage error={removeMutation.error} /></div>
      )}

      <motion.ul initial="hidden" animate="show" variants={stagger(0.06)} className="list">
        {data.items.map((celebration) => (
          <motion.li key={celebration.id} variants={fadeUp}>
            <CelebrationCard celebration={celebration}>
              {celebration.permissions.canRemoveFromGroupIds.includes(
                groupId
              ) && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  disabled={removeMutation.isPending}
                  onClick={() => handleRemove(celebration.id)}
                >
                  {removeMutation.isPending &&
                  removeMutation.variables?.celebrationId ===
                    celebration.id
                    ? "מסירה..."
                    : "הסרה מהקבוצה"}
                </button>
              )}
            </CelebrationCard>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
