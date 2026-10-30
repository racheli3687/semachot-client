
import { motion } from "motion/react";
import GroupList from "../components/groups/GroupList";
import CreateGroupForm from "../components/groups/CreateGroupForm";
import JoinGroupForm from "../components/groups/JoinGroupForm";
import { fadeUp, stagger } from "../utils/motion";

export default function GroupsPage() {
  return (
    <motion.section initial="hidden" animate="show" variants={stagger(0.1)}>
      <motion.header variants={fadeUp} className="mb-10 sm:mb-14">
        <p className="eyebrow">קבוצות</p>
        <h1 className="page-title mt-2">הקבוצות שלי.</h1>
        <p className="mt-4 max-w-2xl text-xl text-muted sm:text-2xl">משפחה, חברות, שכנים - כל קבוצה עם הלוח המשותף שלה.</p>
      </motion.header>

      <motion.div variants={fadeUp} className="mb-14 grid gap-4 sm:gap-5 md:grid-cols-2">
        <CreateGroupForm />

        <JoinGroupForm />
      </motion.div>

      <motion.div variants={fadeUp}>
        <GroupList />
      </motion.div>



    </motion.section>
  );
}
