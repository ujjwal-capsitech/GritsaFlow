import React from "react";
import { Row, Col, Typography, Button, Card } from "antd";
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Row
            justify="center"
            align="middle"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #EDF6FF 0%, #c3cfe2 100%)",
                padding: "24px"
            }}
        >
            <Col
                xs={24}
                sm={20}
                md={16}
                lg={12}
                xl={10}
            >
                <Card
                    style={{
                        textAlign: "center",
                        borderRadius: "16px",
                        backgroundColor: "rgba(255, 255, 255, 0.85)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                    }}
                    bodyStyle={{
                        padding: "40px"
                    }}
                >
                    <Row justify="center" gutter={[0, 24]}>


                        <Col span={24}>
                            <Title
                                level={1}
                                style={{
                                    color: "#2c3e50",
                                    margin: 0
                                }}
                            >
                                404
                            </Title>
                        </Col>

                        <Col span={24}>
                            <Title
                                level={3}
                                style={{
                                    color: "#2c3e50",
                                    fontWeight: "normal",
                                    margin: 0
                                }}
                            >
                                You are Not Authorized to Access This Page 
                            </Title>
                        </Col>

                        

                        <Col span={24} style={{ marginTop: "24px" }}>
                            <Button
                                type="primary"
                                size="large"
                                icon={<HomeOutlined />}
                                onClick={() => navigate("/Home")}
                                style={{
                                    backgroundColor: "#c3cfe2",
                                    borderColor: "#c3cfe2",
                                    borderRadius: "8px",
                                    padding: "0 24px",
                                    height: "40px"
                                }}
                            >
                                Go Back To Login Page 
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};



export default Unauthorized;