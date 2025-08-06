import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import { RoleEnum } from "../api/Role";
import type React from "react";

interface Rolegaurds {
    allowedRoles: RoleEnum[];
    children: React.ReactNode;
}

const PageRoute: React.FC<Rolegaurds> = ({ allowedRoles, children }) => {
    const { role } = useSelector((state: RootState) => state.auth);

    if (!role) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/Unauthorized" replace />;
    }

    return <>{children}</>;
};

export default PageRoute;