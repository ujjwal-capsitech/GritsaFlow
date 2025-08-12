import React from "react";
import { Row, Col, Card, Typography, Space } from "antd";
import SVGComponent from "../../Assets/SVGComponent";

const { Text, Title } = Typography;
//Backlog,
//    NeedToDiscuss,
//    Done
//}

const Overview: React.FC = () => {
    const data = [
        { color: "#1890ff", count: 23, label: "Todo" },
        { color: "#52c41a", count: 8, label: "In Progress" },
        { color: "#faad14", count: 1, label: "Developed" },
        { color: "#faad14", count: 16, label: "UAT" },
        { color: "#faad14", count: 25, label: "Testing" },
        { color: "#faad14", count: 55, label: "NeedToDiscuss" },
        { color: "#faad14", count: 5, label: "Backlog" },
        { color: "#faad14", count: 3, label: "Done" },

    ];

    return (
        <Card
            title="Overview"

        >
            <Row gutter={16}>
                {data.map((item, index) => (
                    <Col xs={24} sm={8} key={index}>
                        <Space align="start">
                            <span
                                style={{
                                    display: "inline-block",
                                    width: 4,
                                    height: "100%",
                                    backgroundColor: item.color,
                                    borderRadius: 2,
                                }}
                            />
                            <Space direction="horizontal" size={0} style={{ display: "flex", alignItems: "center" }}>
                                <SVGComponent fill={item.color} />
                                <Title level={3} style={{ margin: 5, display: "flex", alignItems: "center" }}>
                                    {item.count}
                                </Title>
                                <Text type="secondary" style={{ display: "flex", alignItems: "center" }}>{item.label}</Text>
                            </Space>
                        </Space>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default Overview;
