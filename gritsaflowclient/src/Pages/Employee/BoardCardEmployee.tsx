
import React, { useState } from 'react';
import { Card, List, Tag, Typography, Avatar, Col, Row } from 'antd';
import {
    CheckCircleOutlined,
    SyncOutlined,
    CodeOutlined,
    ExperimentOutlined,
    BugOutlined,
    CheckOutlined,
    QuestionOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import { TaskStatus } from "../../api/Role"
import ActivityLog from '../../Components/ActivityLog';
const { Text,Title } = Typography;

interface Task {
    id: string;
    title: string;
    status: TaskStatus;
    assignee?: string;
    priority: 'Low' | 'Medium' | 'High';
    dueDate?: string;
}

const BoardCardEmployee: React.FC = () => {

    const [tasks] = useState<Task[]>([
        { id: 'SPC-725', title: 'Send Email When User Signs Up', status: TaskStatus.Todo, priority: 'High' },
        { id: 'SPC-648', title: 'Improve Security Protocols', status: TaskStatus.Todo, priority: 'High' },
        { id: 'SPC-650', title: 'Add Sample Data Generator', status: TaskStatus.Todo, priority: 'High' },
        { id: 'SPC-709', title: 'Send Email To Admin On New User', status: TaskStatus.Todo, assignee: 'Debanik Saha', priority: 'High' },
        { id: 'SPC-712', title: 'Change In Structure Of Database', status: TaskStatus.Todo, priority: 'High' },
        { id: 'SPC-705', title: 'Fix Page Not Found Issue', status: TaskStatus.InProgress, priority: 'High' },
        { id: 'SPC-731', title: 'Show Added By Admin Tag', status: TaskStatus.InProgress, priority: 'High' },
        { id: 'SPC-500', title: 'Add Export To PDF Functionality', status: TaskStatus.InProgress, priority: 'High' },
        { id: 'SPC-673', title: 'Match Company Address Records', status: TaskStatus.InProgress, priority: 'Medium' },
        { id: 'SPC-670', title: 'Sponsicore App Dashboard Redesign', status: TaskStatus.InProgress, priority: 'Medium' },
        { id: 'SPC-600', title: 'Backend API Optimization', status: TaskStatus.Backlog, priority: 'Medium' },
        { id: 'SPC-615', title: 'Database Migration', status: TaskStatus.Developed, priority: 'High' },
        { id: 'SPC-620', title: 'Payment Gateway Integration', status: TaskStatus.UAT, priority: 'High' },
        { id: 'SPC-635', title: 'Security Audit', status: TaskStatus.Testing, priority: 'Medium' },
        { id: 'SPC-699', title: 'Onboarding Workflow', status: TaskStatus.Done, priority: 'Low' },
        { id: 'SPC-701', title: 'User Profile Enhancement', status: TaskStatus.NeedToDiscuss, priority: 'Medium' },
        { id: 'SPC-702', title: 'Mobile Responsive Fixes', status: TaskStatus.NeedToDiscuss, priority: 'High' },
    ]);

    // Status metadata
    const statusConfig = [
        {
            status: TaskStatus.Backlog,
            title: 'Backlog',
            icon: <UnorderedListOutlined />,
            color: '#8D8D8D'
        },
        {
            status: TaskStatus.NeedToDiscuss,
            title: 'Need to Discuss',
            icon: <QuestionOutlined />,
            color: '#FFA940'
        },
        {
            status: TaskStatus.Todo,
            title: 'Todo',
            icon: <CheckCircleOutlined />,
            color: '#1890FF'
        },
        {
            status: TaskStatus.InProgress,
            title: 'In Progress',
            icon: <SyncOutlined twoToneColor="#eb2f96" spin />,
            color: '#722ED1'
        },
        {
            status: TaskStatus.Developed,
            title: 'Developed',
            icon: <CodeOutlined />,
            color: '#13C2C2'
        },
        {
            status: TaskStatus.UAT,
            title: 'UAT',
            icon: <ExperimentOutlined />,
            color: '#F759AB'
        },
        {
            status: TaskStatus.Testing,
            title: 'Testing',
            icon: <BugOutlined />,
            color: '#FAAD14'
        },
        {
            status: TaskStatus.Done,
            title: 'Done',
            icon: <CheckOutlined />,
            color: '#52C41A'
        }
    ];

    const priorityColors = {
        High: 'red',
        Medium: 'orange',
        Low: 'green',
    };




    const getTasksByStatus = (status: TaskStatus) =>
        tasks.filter(task => task.status === status);


    return (
        <Row gutter={16} style={{ padding: '20px', height: '100%' }}>
            <Col span={17}>
                <Title level={3} style={{ marginBottom: 24 }}>Sponsicore Task Board</Title>

                <Row gutter={16} style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
                    {statusConfig.map(config => {
                        const statusTasks = getTasksByStatus(config.status);
                        return (
                            <Col key={config.status} flex="300px" style={{ height: '100%' }}>
                                <Card
                                    title={
                                        <Col style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ color: config.color, marginRight: 8 }}>{config.icon}</span>
                                            <Text strong>{config.title}</Text>
                                            <Tag style={{ marginLeft: 8 }}>{statusTasks.length}</Tag>
                                        </Col>
                                    }
                                    size="small"
                                    headStyle={{
                                        backgroundColor: '#f0f2f5',
                                        borderBottom: `2px solid ${config.color}`,
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 1
                                    }}
                                    style={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
                                    }}
                                    bodyStyle={{
                                        flex: 1,
                                        overflowY: 'auto',
                                        padding: '8px 0'
                                    }}
                                >
                                    <List
                                        dataSource={statusTasks}
                                        renderItem={task => (
                                            <List.Item key={task.id} style={{ margin: '0 8px 8px', padding: 0 }}>
                                                <Card
                                                    size="small"
                                                    title={
                                                        <Col style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <Text strong style={{ fontSize: 13 }}>{task.id}</Text>
                                                            <Tag color={priorityColors[task.priority]}>{task.priority}</Tag>
                                                        </Col>
                                                    }
                                                    extra={task.assignee && (
                                                        <Avatar size="small" style={{ backgroundColor: '#1890ff', fontSize: 10 }}>
                                                            {task.assignee.split(' ').map(n => n[0]).join('')}
                                                        </Avatar>
                                                    )}
                                                    style={{ width: '100%', borderLeft: `3px solid ${config.color}` }}
                                                >
                                                    <Text style={{ fontSize: 13 }}>{task.title}</Text>
                                                    {task.assignee && (
                                                        <Col style={{ marginTop: 8 }}>
                                                            <Text type="secondary" style={{ fontSize: 11 }}>
                                                                {task.assignee}
                                                            </Text>
                                                        </Col>
                                                    )}
                                                </Card>
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Col>

            <Col span={7}>
                <ActivityLog />
            </Col>
        </Row>
    );
};

export default BoardCardEmployee;