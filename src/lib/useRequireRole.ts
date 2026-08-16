import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth, UserRole } from "@/context/AuthContext";

const LOGIN_PATH_BY_ROLE: Record<UserRole, string> = {
    homeowner: "/login",
    contractor: "/contractor/login",
    admin: "/admin/login",
};

// Redirects to the right login page if there's no session for `role` yet.
// Returns isReady=true once it's safe to render the protected content.
export const useRequireRole = (role: UserRole) => {
    const { session, isLoading } = useAuth();
    const router = useRouter();

    const hasAccess = !!session && session.role === role;

    useEffect(() => {
        if (isLoading) return;

        if (!hasAccess) {
            const loginPath = LOGIN_PATH_BY_ROLE[role];
            const redirect = encodeURIComponent(router.asPath);
            router.replace(`${loginPath}?redirect=${redirect}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, hasAccess, role]);

    return {
        session,
        isReady: !isLoading && hasAccess,
    };
};
