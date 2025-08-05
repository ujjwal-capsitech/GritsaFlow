//src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import PageRoute from "../src/Components/PageRouting";
import Home from "../src/Pages/Home/Home";
import Unauthorized from "../src/Pages/Unauthorized";
import EmployeeDashboard from "../src/Pages/Employee/EmployeeDashboard";
import TeamLeadDashboard from "../src/Pages/Teamlead/TeamLeadDashboard";
import PageNotFound from "../src/Pages/pageNotFound";
import { RoleEnum } from "./api/Role";
import SessionTimeout from "./Components/SessionTimeOut";

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
                <Route path="/Employee" element=
                    {
                        <PageRoute allowedRoles={[RoleEnum.Employee]}>
                            <EmployeeDashboard />
                        </PageRoute>
                    } />
                <Route path="/TeamLead" element=
                    {
                        <PageRoute allowedRoles={[RoleEnum.TeamLead]}>
                            <TeamLeadDashboard />
                        </PageRoute>} />
            </Routes>
        </Router>
    );
};

export default App;
