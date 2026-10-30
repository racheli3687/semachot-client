
import { useGroupMembersQuery, useRemoveGroupMember } from "../../hooks/useGroups";
import { RowSkeletonList } from "../Skeleton";
import { initials } from "../../utils/celebrationVisuals";
import Icon from "../ui/Icon";
import ErrorMessage from "../ErrorMessage";
import { useAuth } from "../../hooks/useAuth";

interface GroupMembersProps {
  groupId: number;
  isManager: boolean;
}

export default function GroupMembers({
  groupId,
  isManager,
}: GroupMembersProps) {
  const { data: members, isPending, isError, error } =
    useGroupMembersQuery(groupId);

  const removeMutation = useRemoveGroupMember();
  const { user } = useAuth();

  async function handleRemove(userId: number, fullName: string) {
    const confirmed = window.confirm(
      `האם להסיר את ${fullName} מהקבוצה? השמחות שלה יוסרו מהקבוצה.`
    );

    if (!confirmed) return;

    try {
      await removeMutation.mutateAsync({ groupId, userId });
    } catch {
      // השגיאה מוצגת למטה
    }
  }

  if (isPending) {
    return <RowSkeletonList label="טוען את חברי הקבוצה..." />;
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  if (!members || members.length === 0) {
    return <p className="state-box">אין עדיין חברים בקבוצה.</p>;
  }

  return (
    <section className="panel">
      <h2 className="card-title mb-3">חברי הקבוצה <span className="text-sm font-normal text-muted">({members.length})</span></h2>

      {removeMutation.isError && (
        <div className="mb-3"><ErrorMessage error={removeMutation.error} /></div>
      )}

      <ul>
        {members.map((member) => (
          <li key={member.userId} className="group flex items-center gap-3 border-line py-3 [&+&]:border-t">
            <span
              className={`grid size-10 shrink-0 place-items-center rounded-full font-bold ${
                member.role === "MANAGER" ? "bg-gradient-to-br from-[#ff9f6b] to-[#ff6fa8] text-white" : "bg-surface-2 text-ink"
              }`}
              aria-hidden="true"
            >
              {initials(member.fullName)}
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block truncate">{member.fullName}</strong>
              <p className="sr-only">תפקיד: {member.role === "MANAGER" ? "מנהלת" : "חברה"}</p>
              {member.role === "MANAGER" && <span className="chip me-2 bg-accent-soft text-accent"><Icon name="crown" /> מנהלת</span>}
              <p className="inline text-xs">
                <span className="sr-only">דוא״ל: </span><a href={`mailto:${member.email}`} dir="ltr" className="font-normal text-muted">{member.email}</a>
              </p>
            </div>

            {isManager && member.userId !== user?.id && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                disabled={removeMutation.isPending}
                onClick={() =>
                  handleRemove(member.userId, member.fullName)
                }
              >
                {removeMutation.isPending &&
                  removeMutation.variables?.userId === member.userId
                  ? "מסירה..."
                  : "הסרה"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
