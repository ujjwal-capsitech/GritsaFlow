// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import PageRoute from "./Components/PageRouting";
import Home from "./Pages/Home/Home";
import Unauthorized from "./Pages/Unauthorized";
import HomeEmp from "./Pages/Employee/HomeEmp.tsx";
import HomeTeamLead from "./Pages/Teamlead/HomeTeamLead.tsx";
import PageNotFound from './Pages/pageNotFound.tsx';
import { RoleEnum } from "./api/Role";
import SessionTimeout from "./Components/SessionTimeOut";
import Task from "./Pages/Home/Pages/Task";
import AdminDashboard from "./Pages/Home/Pages/Dashboard";
import Project from "./Pages/Home/Pages/Project";
import ProjectCard from "./Components/ProjectCard";
import  "../src/App.css";
import UserProfilePage from "./Components/ UserProfilePage.tsx";

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
                    <Route path="tasks/:taskId" element={<Task />} />
                </Route>

                <Route path="/Employee" element={
                    <PageRoute allowedRoles={[RoleEnum.Employee]}>
                        <HomeEmp />
                    </PageRoute>
                } ><Route path="tasks/:taskId" element={<Task />} /></Route>
                <Route path="/AdminDashboard" element={
                    <PageRoute allowedRoles={[RoleEnum.Admin]}>
                        <AdminDashboard />
                    </PageRoute>
                } />
                <Route path="/Projects" element={
                    <Project />
                } />
                <Route path="/TeamLead" element={
                    <PageRoute allowedRoles={[RoleEnum.TeamLead]}>
                        <HomeTeamLead />
                    </PageRoute>
                } >
                    <Route path="tasks/:taskId" element={<Task />} />
                </Route>
                <Route path="/ProjectCard" element={
                    <ProjectCard />
                } />
                <Route path="/profile" element={
          
                        <UserProfilePage />
                    
                } />

            </Routes>
        </Router>
    );
};

export default App;