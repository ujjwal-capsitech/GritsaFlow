import { Card, Col, Row } from "antd";
import React from "react";
import ActivityLog from "../../Components/ActivityLog";
const BoardCardEmployee: React.FC = () => {
    return (
        <Row gutter={16}>
            <Col span={17}>
            <Card>
                BoardCardEmployee
                </Card>
            </Col>
            <Col span={7}><ActivityLog /></Col>
        </Row>
    )
}
export default BoardCardEmployee;