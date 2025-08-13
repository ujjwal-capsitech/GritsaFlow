import React from "react";
import { Row, Col, Card, Typography, Space } from "antd";
import SVGComponent from "../../Assets/SVGComponent";

const { Text, Title } = Typography;

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
        <Card title="Overview">
            <Row gutter={16}>
                {data.map((item, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                        <Space align="center" style={{flexWrap:"wrap",gap:8}}>
                            <span style={{display:"inline-block",width:4,height:"100%",backgroundColor:item.color,borderRadius:2}}/>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <SVGComponent fill={item.color}  width="24px" height="24px"/>
                                <Title level={3} style={{margin:0,fontSize:'24px'}}>
                                    {item.count}
                                </Title>
                            </div>
                            <Text type="secondary" style={{flexShrink:1,minWidth:0,whiteSpace:"normal"}}>
                                {item.label}
                            </Text>
                        </Space>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default Overview;