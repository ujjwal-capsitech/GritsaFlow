import React, { useState, useEffect } from "react";
import {
    Card,
    Typography,
    Select,
    Row,
    Col,
    Progress,
    message,
    List,
    Skeleton,
    Empty,
} from "antd";
import ReactECharts from "echarts-for-react";
import api from "../api/api";
import axios from "axios";
import type {
    TaskReport,
    Project,
    ProjectReport,
    ApiResponse,
} from "../Components/interface";

const { Title } = Typography;
const { Option } = Select;

interface ProjectResponse {
    projectId: string;
    projectTitle: string;
    employees: {
        empId: string;
        empName: string;
    }[];
}

const TaskReportCard: React.FC = () => {
    const [scale, setScale] = useState(1);
    const [statusReport, setStatusReport] = useState<TaskReport[]>([]);
    const [priorityReport, setPriorityReport] = useState<TaskReport[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

    // fetch current user
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

    // fetch projects based on role
    const fetchProjects = async () => {
        try {
            setLoading(true);

            if (currentUserRole === "admin") {
                // Admin ? all projects
                const response = await api.get<ApiResponse<Project[]>>(
                    "/ProjectControllers"
                );

                if (response.data.status) {
                    setProjects(response.data.data);
                    if (response.data.data.length > 0) {
                        setSelectedProject(response.data.data[0].projectId);
                    }
                } else {
                    message.error(response.data.message || "Failed to load projects");
                }
            } else if (currentUserId) {
                // Non-admin ? only their projects
                const response = await axios.get<ApiResponse<ProjectResponse[]>>(
                    "https://localhost:7219/employees/all",
                    { withCredentials: true }
                );

                if (response.data.status && response.data.data) {
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
                        setSelectedProject(userProjects[0].projectId);
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

    useEffect(() => {
        if (currentUserId !== null && currentUserRole !== null) {
            fetchProjects();
        }
    }, [currentUserId, currentUserRole]);

    // fetch report for selected project
    const fetchReport = async (projectId: string) => {
        try {
            setLoading(true);
            const response = await api.get<ApiResponse<ProjectReport>>(
                `/ProjectControllers/${projectId}/report`
            );

            if (response.data.status) {
                setStatusReport(response.data.data.statusReport || []);
                setPriorityReport(response.data.data.priorityReport || []);
                if ((response.data.data.statusReport || []).length === 0) {
                    message.warning("No report data available");
                }
            } else {
                message.error(response.data.message || "Failed to load report");
            }
        } catch {
            message.error("Error fetching report");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedProject) {
            fetchReport(selectedProject);
        }
    }, [selectedProject]);

    // handle responsiveness
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            let newScale = 1;
            if (width < 600) newScale = 0.7;
            else if (width < 400) newScale = 0.5;
            setScale(newScale);
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const pieChartOptions = {
        tooltip: { trigger: "item" },
        legend: {
            orient: "vertical",
            left: "right",
            itemGap: 12,
        },
        series: [
            {
                name: "Tasks",
                type: "pie",
                radius: ["40%", "70%"],
                label: { show: false },
                emphasis: { label: { show: true, fontSize: 12 } },
                labelLine: { show: false },
                data: statusReport.map((item, index) => ({
                    value: item.value,
                    name: item.name,
                    itemStyle: {
                        color: [
                            "#4C9AFF",
                            "#A5B4FC",
                            "#60A5FA",
                            "#22D3EE",
                            "#F472B6",
                            "#E879F9",
                            "#FBBF24",
                            "#34D399",
                        ][index % 8],
                    },
                })),
            },
        ],
    };

    return (
        <Col
            style={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                width: `${100 / scale}%`,
                transition: "transform 0.3s ease",
            }}
        >
            <Card style={{ borderRadius: "14px", padding: "10px" }}>
                <Row
                    justify="space-between"
                    align="middle"
                    style={{ marginBottom: "10px" }}
                >
                    <Title level={5} style={{ margin: 0 }}>
                        Task Report
                    </Title>
                </Row>

                <Row gutter={16}>
                    {/* Pie Chart */}
                    <Col xs={24} md={12} style={{ textAlign: "center" }}>
                        <ReactECharts
                            option={pieChartOptions}
                            style={{ height: "260px", width: "100%" }}
                        />
                    </Col>

                    {/* Project selector + priorities */}
                    <Col span={12}>
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
                        ) : statusReport.length === 0 ? (
                            <Empty description="No report data available." />
                        ) : priorityReport.length === 0 ? (
                            <Empty description="No priority data available." />
                        ) : (
                            priorityReport.map((p, idx) => (
                                <Row key={idx} align="middle" style={{ marginBottom: "12px" }}>
                                    <Col span={6}>{p.name}</Col>
                                    <Col span={12}>
                                        <Progress
                                            percent={Math.min((p.value / 10) * 100, 100)}
                                            showInfo={false}
                                            strokeColor={
                                                p.name.toLowerCase() === "high"
                                                    ? "#ef4444"
                                                    : p.name.toLowerCase() === "medium"
                                                        ? "#3b82f6"
                                                        : "#22c55e"
                                            }
                                            trailColor="#f3f4f6"
                                            status="active"
                                        />
                                    </Col>
                                    <Col span={6} style={{ textAlign: "right" }}>
                                        {p.value}
                                    </Col>
                                </Row>
                            ))
                        )}
                    </Col>
                </Row>
            </Card>
        </Col>
    );
};

export default TaskReportCard;
