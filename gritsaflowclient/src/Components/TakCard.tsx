import React, { useState, useEffect } from "react";
import { Card, Typography, Select, Row, Col, Progress, message } from "antd";
import ReactECharts from "echarts-for-react";
import api from "../api/api";
import type { TaskReport, Project, ProjectReport, ApiResponse } from "../Components/interface";
const { Title } = Typography;
const { Option } = Select;

//interface TaskReport {
//    name: string;
//    value: number;
//}

//interface Project {
//    projectId: string;
//    projectTitle: string;
//}

//interface ProjectReport {
//    statusReport: TaskReport[];
//    priorityReport: TaskReport[];
//}

//interface ApiResponse<T> {
//    data: T;
//    status: boolean;
//    message?: string;
//}
interface ProjectSelectedProps {
    onProjectSelect: (ProjectId: string) => void;

}
const TaskReportCard: React.FC<ProjectSelectedProps> = ({ onProjectSelect }) => {
    const [scale, setScale] = useState(1);
    const [statusReport, setStatusReport] = useState<TaskReport[]>([]);
    const [priorityReport, setPriorityReport] = useState<TaskReport[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await api.get<ApiResponse<Project[]>>("/ProjectControllers");

            if (response.data.status) {
                setProjects(response.data.data);
                if (response.data.data.length > 0) {
                    const defaultProjectId = response.data.data[0].projectId;
                    setSelectedProject(response.data.data[0].projectId);
                    if (onProjectSelect) onProjectSelect(defaultProjectId);
                } else {
                    message.info("No projects found");
                }
            } else {
                message.error(response.data.message || "Failed to load projects");
            }
        } catch {
            message.error("Error fetching project list");

        } finally {
            setLoading(false);
        }
    };

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
                    message.info("No report data available");
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
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchReport(selectedProject);
        }
    }, [selectedProject]);

    // scale card on resize
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
        <div
            style={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                width: `${100 / scale}%`,
                transition: "transform 0.3s ease",
            }}
        >
            <Card style={{ borderRadius: "14px", padding: "10px" }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: "10px" }}>
                    <Title level={5} style={{ margin: 0 }}>
                        Task Report
                    </Title>
                </Row>

                <Row gutter={16}>
                    {/* Pie Chart */}
                    <Col xs={24} md={12} style={{ textAlign: "center" }}>
                        <ReactECharts option={pieChartOptions} style={{ height: "260px", width: "100%" }} />
                    </Col>

                    {/* Project selector + priorities */}
                    <Col span={12}>
                        <Select
                            value={selectedProject || undefined}
                            onChange={(value) => setSelectedProject(value)}
                            style={{ width: "100%", marginBottom: "15px" }}
                            placeholder="Select Project"
                        >
                            {projects.map((p) => (
                                <Option key={p.projectId} value={p.projectId}>
                                    {p.projectTitle}
                                </Option>
                            ))}
                        </Select>

                        {priorityReport.map((p, idx) => (
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
                        ))}
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default TaskReportCard;
