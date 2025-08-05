import React from "react";
import { Card, Typography, List, Avatar, Row, Col } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Text, Link } = Typography;

type TimelineItem = {
    id: string;
    userName: string;
    avatarUrl: string;
    dateTime: string;
    description: string;
    taskLink: string;
    fromLabel?: string;
    toLabel?: string;
};

const dummyTimeline: TimelineItem[] = [
    {
        id: "SPC-001",
        userName: "Ujjwal Raj",
        avatarUrl: "https://app.capsitask.com/v1/api/user/profilepicture?id=68652838045c6576ca1e63c3&isThumb=0?t=nThpZ6vcTKS+PXWk6qkbnw==",
        dateTime: "Wednesday, July 30, 2025 1:35 PM",
        description: "Ujjwal Raj Update The Due Date",
        taskLink: "SPC-001",
        fromLabel: "31 Jul 2025",
        toLabel: "06 Aug 2025",
    },
    {
        id: "SPC-689",
        userName: "Ujjwal Raj",
        avatarUrl: "https://app.capsitask.com/v1/api/user/profilepicture?id=68652838045c6576ca1e63c3&isThumb=0?t=nThpZ6vcTKS+PXWk6qkbnw==",
        dateTime: "Tuesday, July 22, 2025 8:03 PM",
        description: "Ujjwal Raj Created the Issue Assigned to :- Ujjwal Raj",
        taskLink: "SPC-689",
    },
    {
        id: "SPC-674",
        userName: "Ujjwal Raj",
        avatarUrl: "https://app.capsitask.com/v1/api/user/profilepicture?id=68652838045c6576ca1e63c3&isThumb=0?t=nThpZ6vcTKS+PXWk6qkbnw==",
        dateTime: "Monday, July 21, 2025 8:01 PM",
        description: "Ujjwal Raj Update The Status",
        taskLink: "SPC-674",
        fromLabel: "In Progress",
        toLabel: "Done",
    },
    {
        id: "SPC-674",
        userName: "Ujjwal Raj",
        avatarUrl: "https://app.capsitask.com/v1/api/user/profilepicture?id=68652838045c6576ca1e63c3&isThumb=0?t=nThpZ6vcTKS+PXWk6qkbnw==",
        dateTime: "Friday, July 18, 2025 7:57 PM",
        description: "Ujjwal Raj Update The Due Date",
        taskLink: "SPC-674",
        fromLabel: "18 Jul 2025",
        toLabel: "21 Jul 2025",
    },
    {
        id: "SPC-674",
        userName: "Ujjwal Raj",
        avatarUrl: "https://app.capsitask.com/v1/api/user/profilepicture?id=68652838045c6576ca1e63c3&isThumb=0?t=nThpZ6vcTKS+PXWk6qkbnw==",
        dateTime: "Wednesday, July 16, 2025 8:00 PM",
        description: "Ujjwal Raj Update The Due Date",
        taskLink: "SPC-674",
        fromLabel: "16 Jul 2025",
        toLabel: "18 Jul 2025",
    },
    {
        id: "SPC-674",
        userName: "Ujjwal Raj",
        avatarUrl: "https://app.capsitask.com/v1/api/user/profilepicture?id=68652838045c6576ca1e63c3&isThumb=0?t=nThpZ6vcTKS+PXWk6qkbnw==",
        dateTime: "Tuesday, July 15, 2025 8:06 PM",
        description: "Ujjwal Raj Update The Due Date",
        taskLink: "SPC-674",
    },
];

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

const ProjectTimelineCard: React.FC = () => {
    return (
        <Card
            title="Project Timeline"
            size="small"
            style={{width: 745, borderRadius: 8 }}
            bodyStyle ={{ maxHeight: 900, overflowY: "auto", padding: 12 }}
        >
            <List
                itemLayout="vertical"
                dataSource={dummyTimeline}
                renderItem={(item) => (
                    <List.Item
                        key={item.id + item.dateTime}
                        style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={item.avatarUrl} />}
                            title={
                                <Row justify="space-between" align="middle">
                                    <Col>
                                        <Text strong>{item.userName}</Text>
                                        <br />
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {item.dateTime}
                                        </Text>
                                    </Col>
                                    <Col>
                                        <Link
                                            href={`NSOINLOSN/${item.taskLink}`}
                                            target="_blank"
                                            style={{ fontSize: 14, cursor: "pointer" }}
                                        >
                                            {item.taskLink}
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
                    Items: {dummyTimeline.length} of {dummyTimeline.length}
                </Col>
            </Row>
        </Card>
    );
};

export default ProjectTimelineCard;
