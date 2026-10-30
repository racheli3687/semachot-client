
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "./Loading";

export default function GuestRoute() {
    const { status } = useAuth();

    if (status === "loading") {
        return <Loading />;
    }

    if (status === "authenticated") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
