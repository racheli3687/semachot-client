


import { Link } from "react-router-dom";
import { useGroupsQuery } from "../../hooks/useGroups";
import Loading from "../Loading";
import ErrorMessage from "../ErrorMessage";
import EmptyState from "../EmptyState";

export default function GroupList() {
  const { data: groups, isPending, isError, error } = useGroupsQuery();

  if (isPending) {
    return <Loading message="טוען את הקבוצות..." />;
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  if (!groups || groups.length === 0) {
    return (
      <EmptyState message="עוד אין לך קבוצות. פתחי קבוצה חדשה, או הצטרפי בעזרת קוד שקיבלת." />
    );
  }

  return (
    <section>
      <h2>הקבוצות שלי</h2>

      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <Link to={`/groups/${group.id}`}>
              {group.name}
            </Link>

            <p>
              תפקיד: {group.myRole === "MANAGER" ? "מנהלת" : "חברה"}
            </p>

            <p>מספר חברות וחברים: {group.memberCount}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
