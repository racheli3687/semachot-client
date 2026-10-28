
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
    const { status } = useAuth();

    if (status === "loading") {
        return <div  style={{ textAlign: "center", padding: "40px" }}>
            <p>טוען...</p>
            <p>
                בכניסה הראשונה השרת עשוי להתעורר.
                הפעולה יכולה להימשך עד דקה, נא להמתין.
            </p>
        </div>
    }

    if (status === "unauthenticated") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
