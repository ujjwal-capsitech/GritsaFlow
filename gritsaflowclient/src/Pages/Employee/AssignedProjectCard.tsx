import React, { useState } from "react";
import { Row, Col, Card, Typography, Avatar, Dropdown, Menu, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { data } from "react-router";
import api from "../../api/api";

const { Title, Text } = Typography;

const AssignedProjectCard: React.FC = () => {
    const [selectedMember, setSelectedMember] = useState<string | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    const handleChange = (value: string) => {
        setSelectedMember(value);
    };

    const data = [
        {
            projectId: "SPC",
            ProjectTitle: "Sponsicore",
            Employess: [
                { EmpId: "U-16", Empname: "Suresh Kumar" },
                { EmpId: "U-15", Empname: "Satish Kumar" },
                { EmpId: "U-14", Empname: "Santosh Kumar" },
                { EmpId: "U-13", Empname: "Sukhdev Kumar" },
                { EmpId: "U-12", Empname: "Surendra Kumar" },
                { EmpId: "U-11", Empname: "Surya Kumar" },
                { EmpId: "U-10", Empname: "Sulochan Kumar" },
            ]
        },
        {
            projectId: "TTP",
            ProjectTitle: "TotalTimePay",
            Employess: [
                { EmpId: "U-16", Empname: "Suresh Kumar" },
                { EmpId: "U-15", Empname: "Satish Kumar" },
                { EmpId: "U-14", Empname: "Santosh Kumar" },
                { EmpId: "U-13", Empname: "Sukhdev Kumar" },
                { EmpId: "U-12", Empname: "Surendra Kumar" },
                { EmpId: "U-11", Empname: "Surya Kumar" },
                { EmpId: "U-10", Empname: "Sulochan Kumar" },
            ]
        }
    ];
    return (
        <Row gutter={[16, 16]}>
            {data.map((project) => {
                const menu = (
                    <Menu
                        onClick={(info) => {
                            handleChange(info.key);
                        }}
                    >
                        {project.Employess.map((item) => (
                            <Menu.Item key={item.Empname}>
                                <Avatar
                                    size="small"
                                    style={{ backgroundColor: '#1890ff', marginRight: 8 }}
                                >
                                    {item.Empname.charAt(0)}  
                                </Avatar>
                                {item.Empname}
                            </Menu.Item>
                        ))}
                    </Menu>
                );

                return (
                
                    <Col
                        xs={24}
                        sm={12}
                        md={12}
                        lg={8}
                        xl={6}
                        key={project.projectId}
                    >
                        <Card
                            title={<Title level={4} style={{ margin: 0 }}>{project.ProjectTitle}</Title>}
                            headStyle={{ padding: "0 16px", borderBottom: "1px solid #f0f0f0" }}
                            bodyStyle={{ padding: "16px" }}
                            hoverable
                        >
                            <Dropdown overlay={menu} trigger={["click"]}>
                                <Text strong style={{ cursor: "pointer", userSelect: "none" }}>
                                    Members <DownOutlined style={{ fontSize: 10 }} />
                                </Text>
                            </Dropdown>
                            {selectedMember && (
                                <Row style={{ marginTop: 8 }}>
                                    <Text type="secondary">Selected: {selectedMember}</Text>
                                </Row>
                            )}
                        </Card>
                    </Col>
                   
                );
            })}
        </Row>
    );
};

export default AssignedProjectCard;
