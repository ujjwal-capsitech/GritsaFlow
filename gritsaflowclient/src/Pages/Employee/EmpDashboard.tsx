import type React from "react";
import OverviewCard from "./overviewCard";
import { Col, Row } from "antd";
import ActivityLog from "../../Components/ActivityLog";
import AssignedProjectCard from "./AssignedProjectCard";
import TaskReportCard from "../../Components/TakCard";
//import ProjectCard from "../../Components/ProjectCard";

const EmpDashboard: React.FC = () => {
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
export default EmpDashboard;
//[horzontal,vertical]