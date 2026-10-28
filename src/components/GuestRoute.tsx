
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function GuestRoute() {
    const { status } = useAuth();

    if (status === "loading") {
        return <p>טוען...</p>;
    }

    if (status === "authenticated") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
