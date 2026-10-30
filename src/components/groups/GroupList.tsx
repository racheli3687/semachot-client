


import { Link } from "react-router-dom";
import { useGroupsQuery } from "../../hooks/useGroups";
import { motion } from "motion/react";
import { RowSkeletonList } from "../Skeleton";
import { fadeUp, stagger } from "../../utils/motion";
import { groupGradient, initials } from "../../utils/celebrationVisuals";
import Icon from "../ui/Icon";
import ErrorMessage from "../ErrorMessage";
import EmptyState from "../EmptyState";

export default function GroupList() {
  const { data: groups, isPending, isError, error } = useGroupsQuery();

  if (isPending) {
    return <RowSkeletonList label="טוען את הקבוצות..." />;
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
      <h2 className="section-title mb-6">כל הקבוצות</h2>

      <motion.ul initial="hidden" animate="show" variants={stagger(0.06)} className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {groups.map((group) => (
          <motion.li key={group.id} variants={fadeUp}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="group card relative flex min-h-44 flex-col justify-between gap-6 p-6 transition-shadow hover:shadow-float"
            >
              <div className="flex items-start justify-between">
                <span className={`grid size-14 place-items-center rounded-[1.1rem] bg-gradient-to-br ${groupGradient(group.id)} text-2xl font-extrabold text-white shadow-float`} aria-hidden="true">
                  {initials(group.name)}
                </span>
                {group.myRole === "MANAGER" ? (
                  <p className="chip bg-accent-soft text-accent"><Icon name="crown" /> מנהלת</p>
                ) : (
                  <p className="chip">חברה</p>
                )}
              </div>
              <div>
                <Link
                  to={`/groups/${group.id}`}
                  className="block truncate text-[1.35rem] font-bold tracking-[-0.01em] text-ink no-underline after:absolute after:inset-0 after:content-[''] hover:no-underline"
                >
                  {group.name}
                </Link>

                <p className="mt-1 flex items-center justify-between text-sm text-muted">
                  <span>{group.memberCount} חברות וחברים</span>
                  <Icon name="chevronLeft" className="size-4 transition-transform group-hover:-translate-x-1" />
                </p>
              </div>
            </motion.div>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
