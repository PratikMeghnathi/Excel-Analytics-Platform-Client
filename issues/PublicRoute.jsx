import { Navigate, useLocation } from "react-router-dom";
import { LoadingOverlay } from "@/components";
import { useAuth } from "@/context";
import { PATHS } from "@/utils";

function PublicRoute({ children, restricted = false }) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <LoadingOverlay />
    }
    if (restricted && isAuthenticated) {
        const searchParams = new URLSearchParams(location.search);
        const redirect = searchParams.get('redirect');

        if (redirect && !redirect.startsWith(PATHS.SIGNIN) && !redirect.startsWith(PATHS.SIGNUP)) {
            return <Navigate to={decodeURIComponent(redirect)} replace />
        }

        return <Navigate to={PATHS.DASHBOARD} replace />
    }
    return children;
}

export default PublicRoute;