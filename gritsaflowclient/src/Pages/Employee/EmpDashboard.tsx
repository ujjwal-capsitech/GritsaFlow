import type React from "react";
import OverviewCard from "./overviewCard";
import { Col, Row } from "antd";
import ActivityLog from "../../Components/ActivityLog";

const EmpDashboard: React.FC = () =>
{
    return (
        <Row gutter={[20,18]} >  
            <Col span={13}><OverviewCard /></Col> 
            <Col span={11}><ActivityLog /></Col> 
        </Row>
    )

}
export default EmpDashboard;
//[horzontal,vertical]