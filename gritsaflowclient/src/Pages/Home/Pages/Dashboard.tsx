import React, { useState } from "react";
import TaskReportCard from "../../../Components/TakCard";
import Projectcard from "../../../Components/ProjectCard";
import { Row, Col } from "antd";
import ActivityLog from "../../../Components/ActivityLog";

const AdminDashboard: React.FC = () => {
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");
    console.log("selectedProjectId from AdminDashboard:", selectedProjectId);


    return (
        <Row gutter={[16, 16]} style={{ height: "100%" }}>
            <Col span={13} style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%" }}>
                <TaskReportCard /> 
                <Projectcard onProjectSelect={setSelectedProjectId} /> 
            </Col>

            <Col span={11}>
                {selectedProjectId ? (
                    <ActivityLog projectId={selectedProjectId} />
                ) : (
                    <div>Please select a project to view timeline</div>
                )}
            </Col>

        </Row>
    );
};

export default AdminDashboard;
