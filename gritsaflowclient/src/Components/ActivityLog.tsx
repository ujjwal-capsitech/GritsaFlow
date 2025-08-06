import React, { useEffect, useState } from "react";
import { Card, Typography, List, Avatar, Row, Col, Spin, Empty } from "antd";
import { ArrowRightOutlined, UserOutlined } from "@ant-design/icons";
import api from "../api/api";

const { Text, Link } = Typography;

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
    data: T;
    status: boolean;
    message?: string;
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

const ActivityLog: React.FC<{ projectId: string }> = ({ projectId }) => {
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchTimeline = async () => {
        try {
            setLoading(true);
            const response = await api.get<ApiResponse<TimelineItem[]>>(
                `/ProjectTimeLineControllers/${projectId}`
            );

            if (response.data.status) {
                setTimeline(response.data.data);
            } else {
                setTimeline([]);
            }
        } catch (err) {
            console.error("Error fetching timeline:", err);
            setTimeline([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchTimeline();
        }
    }, [projectId]);

    return (
        <Card
            title="Project Timeline"
            size="small"
            style={{ width: 745, borderRadius: 8 }}
            bodyStyle={{ maxHeight: 900, overflowY: "auto", padding: 12 }}
        >
            {loading ? (
                <Spin />
            ) : timeline.length === 0 ? (
                <Empty description="No timeline data" />
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
                                                <Link
                                                    href={item.taskLink}
                                                    target="_blank"
                                                    style={{ fontSize: 14, cursor: "pointer" }}
                                                >
                                                    {item.id}
                                                </Link>
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
                        <Col style={{ color: "#999" }}>Nothing More</Col>
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
