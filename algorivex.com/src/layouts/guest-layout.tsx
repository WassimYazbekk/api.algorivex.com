import { useAuthContext } from "@/contexts/auth-context";
import { Navigate, Outlet } from "react-router-dom";

const GuestLayout = () => {
    const { authToken } = useAuthContext();

    if (authToken) return <Navigate to="/dashboard" />;

    return (
        <main className="min-h-screen w-full flex items-center justify-center">
            <Outlet />
        </main>
    );
};

export default GuestLayout;
