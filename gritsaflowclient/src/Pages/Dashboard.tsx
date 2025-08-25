import React from "react";
import TaskReportCard from "../Components/TakCard";
import ProjectCard from "../Components/ProjectCard";
import { Row, Col } from "antd";
import ActivityLog from "../Components/ActivityLog";
import { RoleEnum } from "../api/Role";
import AssignedProjectCard from "./Employee/AssignedProjectCard";
import OverviewCard from "./Employee/overviewCard";

const Dashboard: React.FC = () => {
    const role = localStorage.getItem("Role");
    if (role !== RoleEnum.Admin) {
        return (
            <Row gutter={[16, 18]} >
                <Col span={17} style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%" }}>
                    <AssignedProjectCard />
                    <OverviewCard />
                    <TaskReportCard />

                </Col>
                <Col span={7}><ActivityLog /></Col>
            </Row>

        )
    }
    else {
        return (
            <Row gutter={[16, 16]} style={{ height: "100%" }}>
                <Col span={13} style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%" }}>
                    <TaskReportCard />
                    <ProjectCard />
                </Col>

                <Col span={11}>

                    <ActivityLog />

                </Col>

            </Row>
        );
    }
};

export default Dashboard;
