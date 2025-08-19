import React, { useState, useEffect } from "react";
import { Row, Col, Card, Typography, Avatar, Dropdown, Menu, message, Skeleton } from "antd";
import { DownOutlined } from "@ant-design/icons";
import api from "../../api/api";
import axios from "axios";

const { Title, Text } = Typography;

interface Employee {
    empId: string;
    empName: string;
}

interface Project {
    projectId: string;
    projectTitle: string;
    employees: Employee[];
}

const AssignedProjectCard: React.FC = () => {
    const [selectedMembers, setSelectedMembers] = useState<Record<string, string>>({});
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    // Fetch current user to get userId
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                // CORRECTED: Use the User/current endpoint
                const response = await api.get("User/current");
                setUserId(response.data.userId); // Use userId field
            } catch (error) {
                message.error("Failed to load user data");
                console.error("Error fetching current user:", error);
            }
        };

        fetchCurrentUser();
    }, []);

    // Fetch projects for the current user
    useEffect(() => {
        const fetchProjects = async () => {
            if (!userId) return;

            setLoading(true);
            try {
                // Get all projects with employees
                const allProjectsResponse = await axios.get("https://localhost:7219/employees/all", {
                    withCredentials: true
                });

                // CORRECTED: Access response data properly
                const allProjects: Project[] = allProjectsResponse.data.data;

                // Filter projects that include the current user
                const userProjects = allProjects.filter(project =>
                    project.employees.some(emp => emp.empId === userId)
                );

                setProjects(userProjects);
            } catch (error) {
                message.error("Failed to load project data");
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [userId]);

    const handleMemberSelect = (projectId: string, memberName: string) => {
        setSelectedMembers(prev => ({
            ...prev,
            [projectId]: memberName
        }));
    };

    if (loading) {
        return (
            <Row gutter={[16, 16]}>
                {[1, 2].map((_, index) => (
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} key={index}>
                        <Card>
                            <Skeleton active paragraph={{ rows: 4 }} />
                        </Card>
                    </Col>
                ))}
            </Row>
        );
    }

    if (projects.length === 0) {
        return (
            <Card>
                <Text>No projects assigned to you</Text>
            </Card>
        );
    }

    return (
        <Row gutter={[16, 16]}>
            {projects.map((project) => {
                const menu = (
                    <Menu>
                        {project.employees.map((employee) => (
                            <Menu.Item
                                key={employee.empId}
                                onClick={() => handleMemberSelect(project.projectId, employee.empName)}
                            >
                                <Avatar
                                    size="small"
                                    style={{ backgroundColor: '#1890ff', marginRight: 8 }}
                                >
                                    {employee.empName.charAt(0)}
                                </Avatar>
                                {employee.empName}
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
                            title={<Title level={4} style={{ margin: 0 }}>{project.projectTitle}</Title>}
                            
                            hoverable
                        >
                            <Dropdown overlay={menu} trigger={["click"]}>
                                <Text strong style={{ cursor: "pointer", userSelect: "none" }}>
                                    Members ({project.employees.length}) <DownOutlined style={{ fontSize: 10 }} />
                                </Text>
                            </Dropdown>
                            {selectedMembers[project.projectId] && (
                                <Row style={{ marginTop: 8 }}>
                                    <Text type="secondary">Selected: {selectedMembers[project.projectId]}</Text>
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