import React, { useEffect, useState } from "react";
import {
    Card,
    Typography,
    List,
    Avatar,
    Row,
    Col,
    Skeleton,
    Empty,
    message,
    Select,
} from "antd";
import { ArrowRightOutlined, UserOutlined } from "@ant-design/icons";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import type { Project } from "./interface";
import axios from "axios";
import { RoleEnum } from "../api/Role";

const { Text } = Typography;
const { Option } = Select;

type TimelineItem = {
    id: string;
    userName: string;
    avatarUrl?: string;
    dateTime: string;
    description: string;
    taskLink: string;
    fromLabel?: string;
    toLabel?: string;
};

interface ApiResponse<T> {
    status: boolean;
    message: string;
    data: T;
}

interface ProjectResponse {
    projectId: string;
    projectTitle: string;
    employees: {
        empId: string;
        empName: string;
    }[];
}

const labelStyleFrom = {
    backgroundColor: "#ffe4e6",
    color: "#8b2c57ff",
    padding: "2px 6px",
    borderRadius: 6,
    display: "inline-block",
    minWidth: 80,
    textAlign: "center" as const,
    fontSize: 12,
    fontWeight: 500,
};

const labelStyleTo = {
    backgroundColor: "#dcfce7",
    color: "#389259ff",
    padding: "2px 8px",
    borderRadius: 6,
    display: "inline-block",
    minWidth: 80,
    textAlign: "center" as const,
    fontSize: 12,
    fontWeight: 500,
};

const ActivityLog: React.FC<{ projectId?: string }> = ({ projectId }) => {
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
    const navigate = useNavigate();

    // Fetch current user
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get("User/current");
                setCurrentUserId(response.data.userId);
                setCurrentUserRole(response.data.role);
            } catch (error) {
                console.error("Error fetching current user:", error);
                message.error("Failed to load user data");
            }
        };

        fetchCurrentUser();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);

            // Admin users see all projects
            if (currentUserRole === "admin") {
                const response = await api.get<ApiResponse<Project[]>>(
                    "/ProjectControllers"
                );
                if (response.data.status) {
                    setProjects(response.data.data);
                    if (response.data.data.length > 0) {
                        const defaultProjectId =
                            projectId || response.data.data[0].projectId;
                        setSelectedProject(defaultProjectId);
                    }
                } else {
                    message.error(response.data.message || "Failed to load projects");
                }
            }
            // other than admin 
            else if (currentUserId) {
                const response = await axios.get<ApiResponse<ProjectResponse[]>>(
                    "https://localhost:7219/employees/all",
                    { withCredentials: true }
                );

                if (response.data.status && response.data.data) {
                    // Filter projects where current user is a member
                    const userProjects = response.data.data
                        .filter((project) =>
                            project.employees.some((emp) => emp.empId === currentUserId)
                        )
                        .map((project) => ({
                            projectId: project.projectId,
                            projectTitle: project.projectTitle,
                        }));

                    setProjects(userProjects);

                    if (userProjects.length > 0) {
                        // Use provided projectId if available and valid
                        const validProject = userProjects.find(
                            (p) => p.projectId === projectId
                        );
                        setSelectedProject(
                            validProject ? projectId : userProjects[0].projectId
                        );
                    }
                } else {
                    message.error(response.data.message || "No projects found for user");
                }
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
            message.error("Failed to load project data");
        } finally {
            setLoading(false);
        }
    };

    // Fetch projects when user data changes
    useEffect(() => {
        if (currentUserId !== null && currentUserRole !== null) {
            fetchProjects();
        }
    }, [currentUserId, currentUserRole]);

    const fetchTimeline = async (projId: string) => {
        if (!projId) return;
        setLoading(true);
        try {
            const response = await api.get<ApiResponse<any[]>>(
                `/ProjectTimeLineControllers/${projId}`
            );

            if (response.data.status) {
                const mappedData: TimelineItem[] = response.data.data.map((item) => ({
                    id: item.id || item.taskId || "",
                    userName: item.userName || "Unknown",
                    avatarUrl: item.avatarUrl,
                    dateTime: item.dateTime,
                    description: item.description,
                    taskLink: item.taskLink,
                    fromLabel: item.fromLabel,
                    toLabel: item.toLabel,
                }));

                setTimeline(mappedData);
            } else {
                message.warning("No timeline data found.");
                setTimeline([]);
            }
        } catch (err) {
            message.error("Error fetching timeline.");
            console.error("Error fetching timeline:", err);
            setTimeline([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedProject) {
            fetchTimeline(selectedProject);
        }
    }, [selectedProject]);

    return (
        <Card
            title="Project Timeline"
            size="small"
            style={{
                maxWidth: 745,
                width: "100%",
                borderRadius: 8,
                margin: "0 auto",
            }}
            bodyStyle={{ maxHeight: 900, overflowY: "auto", padding: 12 }}
        >
            {/* Project Select */}
            <Select
                value={selectedProject || undefined}
                onChange={(value) => setSelectedProject(value)}
                style={{ width: "100%", marginBottom: "15px" }}
                placeholder="Select Project"
                loading={loading}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                    (option?.children as unknown as string)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                }
            >
                {projects.map((p) => (
                    <Option key={p.projectId} value={p.projectId}>
                        {p.projectTitle}
                    </Option>
                ))}
            </Select>

            {loading ? (
                <List
                    dataSource={[1, 2, 3]}
                    renderItem={(item) => (
                        <List.Item key={item}>
                            <Skeleton avatar paragraph={{ rows: 2 }} active />
                        </List.Item>
                    )}
                />
            ) : timeline.length === 0 ? (
                <Empty description="No timeline data available." />
            ) : (
                <>
                    <List
                        itemLayout="vertical"
                        dataSource={timeline}
                        renderItem={(item) => (
                            <List.Item
                                key={item.id + item.dateTime}
                                style={{
                                    padding: "8px 0",
                                    borderBottom: "1px solid #f0f0f0",
                                }}
                            >
                                <List.Item.Meta
                                    avatar={
                                        item.avatarUrl ? (
                                            <Avatar src={item.avatarUrl} size={40} />
                                        ) : (
                                            <Avatar size={40} icon={<UserOutlined />} />
                                        )
                                    }
                                    title={
                                        <Row
                                            justify="space-between"
                                            align="middle"
                                            gutter={[8, 8]}
                                            style={{ flexWrap: "wrap" }}
                                        >
                                            <Col
                                                xs={24}
                                                sm={16}
                                                style={{ minWidth: 0, wordBreak: "break-word" }}
                                            >
                                                <Text strong style={{ fontSize: "1rem" }}>
                                                    {item.userName}
                                                </Text>
                                                <br />
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {new Date(item.dateTime).toLocaleString()}
                                                </Text>
                                            </Col>

                                            <Col xs={24} sm={8} style={{ textAlign: "right" }}>
                                                <span
                                                    onClick={() => {
                                                        const role = localStorage.getItem("Role")

                                                        let path = `/tasks/${item.id}`; // fallback

                                                        if (role === RoleEnum.Admin) {
                                                            path = `/Home/tasks/${item.id}`;
                                                        } else if (role === RoleEnum.TeamLead) {
                                                            path = `/Teamlead/tasks/${item.id}`;
                                                        } else if (role === RoleEnum.Employee) {
                                                            path = `/Employee/tasks/${item.id}`;
                                                        }

                                                        navigate(path);
                                                    }}
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#1890ff",
                                                        cursor: "pointer",
                                                        wordBreak: "break-word",
                                                    }}
                                                >
                                                    {item.id}
                                                </span>
                                            </Col>
                                        </Row>
                                    }
                                    description={
                                        <Text style={{ fontSize: 13, color: "#555" }}>
                                            {item.description}
                                        </Text>
                                    }
                                />
                                {item.fromLabel && item.toLabel && (
                                    <Row
                                        align="middle"
                                        justify="center"
                                        style={{
                                            marginTop: 6,
                                            gap: 8,
                                            fontSize: 12,
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <span style={labelStyleFrom}>{item.fromLabel}</span>
                                        <ArrowRightOutlined
                                            style={{ fontSize: 18, color: "#999" }}
                                        />
                                        <span style={labelStyleTo}>{item.toLabel}</span>
                                    </Row>
                                )}
                            </List.Item>
                        )}
                    />
                    <Row
                        justify="space-between"
                        style={{ marginTop: 8, fontSize: 12, flexWrap: "wrap" }}
                    >
                        <Col style={{ color: "#999" }}>
                            Items: {timeline.length} of {timeline.length}
                        </Col>
                    </Row>
                </>
            )}
        </Card>
    );
};

export default ActivityLog;