import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import PageRoute from "./Components/PageRouting";
import Home from "./Pages/Home/Home";
import Unauthorized from "./Pages/Unauthorized";
import EmployeeDashboard from "./Pages/Employee/EmployeeDashboard";
import TeamLeadDashboard from "./Pages/Teamlead/TeamLeadDashboard";
import PageNotFound from "./Pages/pageNotFound";
import { RoleEnum } from "./api/Role";
import SessionTimeout from "./Components/SessionTimeOut";
//import AdminRoute from "./Components/AdminRoute"; // New component
//import AdminUsers from "./Pages/Admin/AdminUser"; // New page

const App: React.FC = () => {
    return (
        <Router>
            <SessionTimeout />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<PageNotFound />} />

                <Route path="/Home" element={
                    <PageRoute allowedRoles={[RoleEnum.Admin]}>
                        <Home />
                    </PageRoute>
                } />

                <Route path="/Employee" element={
                    <PageRoute allowedRoles={[RoleEnum.Employee]}>
                        <EmployeeDashboard />
                    </PageRoute>
                } />

                <Route path="/TeamLead" element={
                    <PageRoute allowedRoles={[RoleEnum.TeamLead]}>
                        <TeamLeadDashboard />
                    </PageRoute>
                } />

                {/* New admin route */}
            {/*    <Route path="/admin/users" element={*/}
            {/*        <AdminRoute>*/}
            {/*            <AdminUsers />*/}
            {/*        </AdminRoute>*/}
            {/*    } />*/}
            </Routes>
        </Router>
    );
};

export default App;