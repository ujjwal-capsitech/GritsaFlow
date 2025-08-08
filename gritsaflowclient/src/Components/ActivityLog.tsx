import React, { useEffect, useState } from "react";
import { Card, Typography, List, Avatar, Row, Col, Skeleton, Empty, message } from "antd";
import { ArrowRightOutlined, UserOutlined } from "@ant-design/icons";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

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
    const navigate = useNavigate();

    useEffect(() => {
        if (!projectId) return;

        const fetchTimeline = async () => {
            setLoading(true);
            try {
                const response = await api.get<ApiResponse<any[]>>(
                    `/ProjectTimeLineControllers/${projectId}`
                );

                const apiData = response.data;

                if (apiData && apiData.status === true) {
                    const mappedData: TimelineItem[] = apiData.data.map((item) => ({
                        id: item.id || item.taskId || "", // fallback if needed
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

        fetchTimeline();
    }, [projectId]);

    if (!projectId) return null;

    return (
        <Card
            title="Project Timeline"
            size="small"
            style={{ width: 745, borderRadius: 8 }}
            bodyStyle={{ maxHeight: 900, overflowY: "auto", padding: 12 }}
        >
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
                                style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}
                            >
                                <List.Item.Meta
                                    avatar={
                                        item.avatarUrl ? (
                                            <Avatar src={item.avatarUrl} />
                                        ) : (
                                            <Avatar size={40} icon={<UserOutlined />} />
                                        )
                                    }
                                    title={
                                        <Row justify="space-between" align="middle">
                                            <Col>
                                                <Text strong>{item.userName}</Text>
                                                <br />
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {new Date(item.dateTime).toLocaleString()}
                                                </Text>
                                            </Col>
                                            <Col>
                                                <span
                                                    onClick={() => navigate(`/Home/tasks/${item.id}`)}
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#1890ff",
                                                        cursor: "pointer",
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
                                        style={{
                                            marginTop: 6,
                                            gap: 8,
                                            justifyContent: "center",
                                            fontSize: 12,
                                        }}
                                    >
                                        <span style={labelStyleFrom}>{item.fromLabel}</span>
                                        <ArrowRightOutlined style={{ fontSize: 18, color: "#999" }} />
                                        <span style={labelStyleTo}>{item.toLabel}</span>
                                    </Row>
                                )}
                            </List.Item>
                        )}
                    />
                    <Row justify="space-between" style={{ marginTop: 8, fontSize: 12 }}>
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
