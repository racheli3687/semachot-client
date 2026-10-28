
import { useGroupMembersQuery, useRemoveGroupMember } from "../../hooks/useGroups";
import Loading from "../Loading";
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
    return <Loading message="טוען את חברי הקבוצה..." />;
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  if (!members || members.length === 0) {
    return <p>אין עדיין חברים בקבוצה.</p>;
  }

  return (
    <section>
      <h2>חברי הקבוצה</h2>

      {removeMutation.isError && (
        <ErrorMessage error={removeMutation.error} />
      )}

      <ul>
        {members.map((member) => (
          <li key={member.userId}>
            <strong>{member.fullName}</strong>
            <p>תפקיד: {member.role === "MANAGER" ? "מנהלת" : "חברה"}</p>
            <p>
              דוא״ל: <a href={`mailto:${member.email}`}>{member.email}</a>
            </p>

            {isManager && member.userId !== user?.id && (
              <button
                type="button"
                disabled={removeMutation.isPending}
                onClick={() =>
                  handleRemove(member.userId, member.fullName)
                }
              >
                {removeMutation.isPending &&
                  removeMutation.variables?.userId === member.userId
                  ? "מסירה..."
                  : "הסרת חברה"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
