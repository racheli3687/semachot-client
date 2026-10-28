
import { useCelebrationsQuery, useRemoveCelebrationFromGroup } from "../../hooks/useCelebrations";
import CelebrationCard from "../celebrations/CelebrationCard";
import EmptyState from "../EmptyState";
import Loading from "../Loading";
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
    return <Loading message="טוען את שמחות הקבוצה..." />;
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  if (!data || data.items.length === 0) {
    return (
      <EmptyState message="עוד אין שמחות בקבוצה">
        <Link to="/celebrations/new">הוספת שמחה</Link>
      </EmptyState>
    );
  }

  return (
    <section>
      <h2>שמחות קרובות</h2>

      {removeMutation.isError && (
        <ErrorMessage error={removeMutation.error} />
      )}

      <ul>
        {data.items.map((celebration) => (
          <li key={celebration.id}>
            <CelebrationCard celebration={celebration}>
              {celebration.permissions.canRemoveFromGroupIds.includes(
                groupId
              ) && (
                <button
                  type="button"
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
          </li>
        ))}
      </ul>
    </section>
  );
}
