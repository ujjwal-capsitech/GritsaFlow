import React, { useState, useEffect } from "react";
import { Card, Typography, Select, Row, Col, Progress, message } from "antd";
import ReactECharts from "echarts-for-react";
import api from "../api/api";

const { Title } = Typography;
const { Option } = Select;
interface TaskReport {
    name: string;
    value: number;
}

interface Project {
    projectId: string;
    projectTitle: string;
}

interface ApiResponse<T> {
    data: T;
    status: boolean;
    message?: string;
}



const priorities = [
    { label: "High", value: 107, color: "#22c55e" },
    { label: "Medium", value: 395, color: "#3b82f6" },
    { label: "Low", value: 186, color: "#ef4444" },
];

const TaskReportCard: React.FC = () => {
    const [scale, setScale] = useState(1);
    const [data, setData] = useState<TaskReport[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    const fetchProjects = async () => {
        try {
            setLoading(true); //  start loading here too
            const response = await api.get<ApiResponse<Project[]>>(
                "/ProjectControllers"
            );

            console.log("Projects Response:", response.data); // debug log

            if (response.data.status) {
                setProjects(response.data.data);
                if (response.data.data.length > 0) {
                    setSelectedProject(response.data.data[0].projectId); // default select first project
                } else {
                    message.info("No projects found"); // nicer than error
                }
            } else {
                message.error(response.data.message || "Failed to load projects");
            }
        } catch (err) {
            message.error("Error fetching project list");
        } finally {
            setLoading(false); // end loading
        }
    };
    const fetchReport = async (projectId: string) => {
        try {
            setLoading(true);
            const response = await api.get<ApiResponse<TaskReport[]>>(
                `/ProjectControllers/${projectId}/report`
            );

            console.log("Report Response:", response.data); // debug log

            if (response.data.status) {
                setData(response.data.data);
                if (response.data.data.length === 0) {
                    message.info("No report data available");
                }
            } else {
                message.error(response.data.message || "Failed to load report");
            }
        } catch {
            message.error("Error fetching report");
        } finally {
            setLoading(false); //  always stop loading
        }
    };
    useEffect(() => {
        const handleResize = () => {
            // Example: scale card based on window width, min 0.5 max 1
            const width = window.innerWidth;
            let newScale = 1;
            if (width < 600) newScale = 0.7;
            else if (width < 400) newScale = 0.5;
            setScale(newScale);
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // initialize

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchReport(selectedProject);
        }
    }, [selectedProject]);

    // Optional: dynamically adjust scale on window resize
    useEffect(() => {
        const handleResize = () => {
            // Example: scale card based on window width, min 0.5 max 1
            const width = window.innerWidth;
            let newScale = 1;
            if (width < 600) newScale = 0.7;
            else if (width < 400) newScale = 0.5;
            setScale(newScale);
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // initialize

        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const pieChartOptions = {
        tooltip: { trigger: "item" },
        legend: {
            orient: "vertical",
            left: "right",
            top: "ce",
            icon: "circle",
            itemGap: 12,
            textStyle: {
                fontSize: 12,
            },
        },
        series: [
            {
                name: "Tasks",
                type: "pie",
                radius: ["40%", "70%"],
                avoidLabelOverlap: true,
                label: { show: false, position: "center" },
                emphasis: { label: { show: true, fontSize: 12 } },
                labelLine: { show: false },
                data: data.map((item, index) => ({
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
                width: `${100 / scale}%`, // Prevent container shrinking in layout
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
                    <Col xs={24} md={12} style={{ textAlign: "center" }}>
                        <ReactECharts
                            option={pieChartOptions}
                            style={{ height: "260px", width: "100%" }}
                        />
                    </Col>

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

                        {priorities.map((p, idx) => (
                            <Row key={idx} align="middle" style={{ marginBottom: "12px" }}>
                                <Col span={6}>{p.label}</Col>
                                <Col span={12}>
                                    <Progress
                                        percent={Math.min((p.value / 400) * 100, 100)}
                                        showInfo={false}
                                        strokeColor={p.color}
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
