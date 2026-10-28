
import GroupList from "../components/groups/GroupList";
import CreateGroupForm from "../components/groups/CreateGroupForm";
import JoinGroupForm from "../components/groups/JoinGroupForm";

export default function GroupsPage() {
  return (
    <main>
      <h1>הקבוצות שלי</h1>

      <CreateGroupForm />

      <hr />

      <JoinGroupForm />

      <hr />

      <GroupList />


      
    </main>
  );
}
