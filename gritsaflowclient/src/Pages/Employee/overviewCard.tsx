import React, { useState, useEffect } from "react";
import { Row, Col, Card, Typography, Space, Skeleton, message } from "antd";
import SVGComponent from "../../Assets/SVGComponent";
import api from "../../api/api";

const { Text, Title } = Typography;

// Define status types based on API response
type TaskStatus =
    | 'Backlog'
    | 'NeedToDiscuss'
    | 'Todo'
    | 'InProgress'
    | 'Developed'
    | 'UAT'
    | 'Testing'
    | 'Done';

interface Task {
    taskStatus: TaskStatus;
    assignedToId: string;
}

interface TasksResponse {
    status: boolean;
    message: string;
    data: Task[];
}

interface CurrentUser {
    userId: string;
}

// Status configuration with colors
const statusConfig = [
    { statusKey: 'Todo', label: 'Todo', color: '#1890ff' },
    { statusKey: 'InProgress', label: 'In Progress', color: '#52c41a' },
    { statusKey: 'Developed', label: 'Developed', color: '#faad14' },
    { statusKey: 'UAT', label: 'UAT', color: '#faad14' },
    { statusKey: 'Testing', label: 'Testing', color: '#faad14' },
    { statusKey: 'NeedToDiscuss', label: 'NeedToDiscuss', color: '#faad14' },
    { statusKey: 'Backlog', label: 'Backlog', color: '#faad14' },
    { statusKey: 'Done', label: 'Done', color: '#faad14' },
];

const Overview: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [counts, setCounts] = useState<Record<TaskStatus, number>>({
        Backlog: 0,
        NeedToDiscuss: 0,
        Todo: 0,
        InProgress: 0,
        Developed: 0,
        UAT: 0,
        Testing: 0,
        Done: 0
    });

    // Fetch current user ID
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get<CurrentUser>("User/current");
                setCurrentUserId(response.data.userId);
            } catch (error) {
                console.error("Error fetching current user:", error);
                message.error("Failed to load user data");
            }
        };

        fetchCurrentUser();
    }, []);

    // Fetch tasks for current user
    useEffect(() => {
        const fetchTasks = async () => {
            if (!currentUserId) return;

            try {
                const response = await api.get<TasksResponse>("Tasks");

                if (response.data.status && response.data.data) {
                    // Initialize counts with zeros
                    const newCounts = {
                        Backlog: 0,
                        NeedToDiscuss: 0,
                        Todo: 0,
                        InProgress: 0,
                        Developed: 0,
                        UAT: 0,
                        Testing: 0,
                        Done: 0
                    };

                    // Count tasks for each status that belong to current user
                    response.data.data.forEach(task => {
                        if (task.assignedToId === currentUserId && newCounts.hasOwnProperty(task.taskStatus)) {
                            newCounts[task.taskStatus] += 1;
                        }
                    });

                    setCounts(newCounts);
                } else {
                    message.error(response.data.message || "Failed to load tasks");
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
                message.error("Failed to load task data");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [currentUserId]);

    if (loading || !currentUserId) {
        return (
            <Card title="Overview">
                <Row gutter={16}>
                    {statusConfig.map((_, index) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={index}>
                            <Skeleton active paragraph={{ rows: 1 }} />
                        </Col>
                    ))}
                </Row>
            </Card>
        );
    }

    return (
        <Card title="Your Tasks Overview">
            <Row gutter={16}>
                {statusConfig.map((status, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                        <Space align="center" style={{ flexWrap: "wrap", gap: 8 }}>
                            <span style={{
                                display: "inline-block",
                                width: 4,
                                height: "100%",
                                backgroundColor: status.color,
                                borderRadius: 2
                            }} />
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <SVGComponent fill={status.color} width="24px" height="24px" />
                                <Title level={3} style={{ margin: 0, fontSize: '24px' }}>
                                    {counts[status.statusKey as TaskStatus] || 0}
                                </Title>
                            </div>
                            <Text
                                type="secondary"
                                style={{ flexShrink: 1, minWidth: 0, whiteSpace: "normal" }}
                            >
                                {status.label}
                            </Text>
                        </Space>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default Overview;