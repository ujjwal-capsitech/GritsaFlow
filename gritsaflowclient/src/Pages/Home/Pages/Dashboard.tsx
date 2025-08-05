import React from "react";
import TaskReportCard from "../../../Components/TakCard";
import Projectcard from "../../../Components/ProjectCard";
import { Row, Col } from "antd";
import ProjectTimelineCard from "../../../Components/ActivityLog";

const AdminDashboard: React.FC = () => {
    return (
        <Row gutter={[16, 16]} style={{ height: "100%" }}>
   
            <Col
                span={13}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    height: "100%",
                }}
            >
                <TaskReportCard />
                <Projectcard />
            </Col>

        
            <Col span={11} style={{ height: "100%" }}>
                <div style={{ height: "100%" }}>
                    <ProjectTimelineCard />
                </div>
            </Col>
        </Row>
    );
};

export default AdminDashboard;
