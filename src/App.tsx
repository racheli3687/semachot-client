import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import CelebrationFormPage from "./pages/CelebrationFormPage";
import CelebrationDetailsPage from "./pages/CelebrationDetailsPage";
import GroupsPage from "./pages/GroupsPage";
import GroupPage from "./pages/GroupPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

function App() {
  return (
    <Routes>

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />

          <Route path="celebrations/new" element={<CelebrationFormPage key="new" />} />
          <Route path="celebrations/:id/edit" element={<CelebrationFormPage key="edit" />} />
          <Route path="celebrations/:id" element={<CelebrationDetailsPage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="groups/:id" element={<GroupPage />} />
          <Route path="profile" element={<ProfilePage />} />

        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App;
