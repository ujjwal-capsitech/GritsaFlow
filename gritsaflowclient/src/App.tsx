// App.tsx
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
import Task from "./Pages/Home/Pages/Task";
import AdminDashboard from "./Pages/Home/Pages/Dashboard";
import Project from "./Pages/Home/Pages/Project";

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
                }>
                    {/* Add nested route for tasks */}
                    <Route path="tasks/:taskId" element={<Task />} />
                </Route>

                <Route path="/Employee" element={
                    <PageRoute allowedRoles={[RoleEnum.Employee]}>
                        <EmployeeDashboard />
                    </PageRoute>
                } />
                <Route path="/AdminDashboard" element={

                    <PageRoute allowedRoles={[RoleEnum.Admin]}>
                        <AdminDashboard/>
                    </PageRoute>
                } />
                <Route path="/Projects" element={
                     
                    <PageRoute allowedRoles={[RoleEnum.Admin]}>
                        <Project />
                    </PageRoute>
                } />
                

                <Route path="/TeamLead" element={
                    <PageRoute allowedRoles={[RoleEnum.TeamLead]}>
                        <TeamLeadDashboard />
                    </PageRoute>
                } />
            </Routes>
        </Router>
    );
};

export default App;