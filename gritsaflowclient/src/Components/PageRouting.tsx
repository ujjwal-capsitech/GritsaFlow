// Example: AdminRoute.tsx
//src/Components/PageRouting
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { Rootstate } from "../redux/store";
import { RoleEnum } from "../api/Role";
// import type { JSX } from "react";
import type React from "react";
// import Unauthorized from "../Pages/Unauthorized";

interface Rolegaurds {
    allowedRoles: RoleEnum[];
    children: React.ReactNode;
}
const PageRoute: React.FC<Rolegaurds> = ({ allowedRoles, children }) => { 
    const { Role } = useSelector((state: Rootstate) => state.auth);
    if (!allowedRoles.includes(Role)) {
        return <Navigate to="/Unauthorized" replace />;
    }
    return <>{ children}</>
};

export default PageRoute;