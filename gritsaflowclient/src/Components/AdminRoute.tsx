//import React from 'react';
//import { useSelector } from 'react-redux';
//import { Navigate } from 'react-router-dom';
//import type { RootState } from '../redux/store';
//import { RoleEnum } from '../api/Role';
//import Unauthorized from '../Pages/Unauthorized';

//const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//    const { role } = useSelector((state: RootState) => state.auth);

//    if (role === RoleEnum.Admin) {
//        return <>{children}</>;
//    }

//    return role ? <Unauthorized /> : <Navigate to="/" replace />;
//};

//export default AdminRoute;
export { }