import React, { useState, useEffect } from 'react';
import {
    Card, List, Tag, Typography, Avatar, Col, Row, Spin, message
} from 'antd';
import {
    CheckCircleOutlined, SyncOutlined, CodeOutlined, ExperimentOutlined,
    BugOutlined, CheckOutlined, QuestionOutlined, UnorderedListOutlined
} from '@ant-design/icons';
import { TaskStatus } from "../../api/Role";
import ActivityLog from '../../Components/ActivityLog';
import api from '../../api/api';
import axios from 'axios';

const { Text, Title } = Typography;

interface User {
    userId: string;
    name: string;
}

interface Project {
    projectId: string;
    projectTitle: string;
}

interface Task {
    id: string;
    taskId: string;
    title: string;
    project: Project;
    taskStatus: TaskStatus;
    priority: string;
    dueDate?: string;
    assignedToId?: string;
}

interface TasksResponse {
    status: boolean;
    message: string;
    data: Task[];
}

interface UsersResponse {
    status: boolean;
    message: string;
    data: {
        items: User[];
        totalItems: number;
        pageNumber: number;
        pageSize: number;
    };
}

interface CurrentUserResponse {
    userId: string;
    name: string;
    userName: string;
    role: string;
    email: string;
    avatarUrl: string;
}

interface EmployeeAllResponse {
    status: boolean;
    data: {
        projectId: string;
        projectTitle: string;
        employees: { empId: string; empName: string }[];
    }[];
}

const BoardCardEmployee: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [userProjects, setUserProjects] = useState<string[]>([]);

    // 1. Fetch current user
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get<CurrentUserResponse>("User/current");
                setCurrentUserId(response.data.userId);
            } catch (error) {
                console.error("Error fetching current user:", error);
                message.error("Failed to load user data");
            }
        };
        fetchCurrentUser();
    }, []);

    // 2. Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get<UsersResponse>("User/basic");
                if (response.data.status && response.data.data?.items) {
                    const usersMap: Record<string, string> = {};
                    response.data.data.items.forEach(user => {
                        usersMap[user.userId] = user.name;
                    });
                    setUsers(usersMap);
                } else {
                    message.error(response.data.message || "Failed to load users");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                message.error("Failed to load user data");
            }
        };
        fetchUsers();
    }, []);

    // 3. Fetch projects from /employees/all
    useEffect(() => {
        const fetchUserProjects = async () => {
            if (!currentUserId) return;
            try {
                const response = await axios.get<EmployeeAllResponse>(
                    "https://localhost:7219/employees/all",
                    { withCredentials: true }
                );
                if (response.data.status && Array.isArray(response.data.data)) {
                    const userProjectIds = response.data.data
                        .filter(project =>
                            project.employees.some(emp => emp.empId === currentUserId)
                        )
                        .map(project => project.projectId);
                    setUserProjects(userProjectIds);
                } else {
                    message.error("Failed to load user projects");
                }
            } catch (error) {
                console.error("Error fetching user projects:", error);
                message.error("Failed to load project data");
            }
        };
        fetchUserProjects();
    }, [currentUserId]);

    // 4. Fetch tasks for user's projects
    useEffect(() => {
        const fetchTasks = async () => {
            if (!currentUserId || userProjects.length === 0) return;
            setLoading(true);
            try {
                const response = await api.get<TasksResponse>("Tasks");
                if (response.data.status && response.data.data) {
                    const projectTasks = response.data.data.filter(task =>
                        userProjects.includes(task.project.projectId)
                    );
                    setTasks(projectTasks);
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
    }, [currentUserId, userProjects]);

    const statusConfig = [
        { status: TaskStatus.Backlog, title: 'Backlog', icon: <UnorderedListOutlined />, color: '#8D8D8D' },
        { status: TaskStatus.NeedToDiscuss, title: 'Need to Discuss', icon: <QuestionOutlined />, color: '#FFA940' },
        { status: TaskStatus.Todo, title: 'Todo', icon: <CheckCircleOutlined />, color: '#1890FF' },
        { status: TaskStatus.InProgress, title: 'In Progress', icon: <SyncOutlined spin />, color: '#722ED1' },
        { status: TaskStatus.Developed, title: 'Developed', icon: <CodeOutlined />, color: '#13C2C2' },
        { status: TaskStatus.UAT, title: 'UAT', icon: <ExperimentOutlined />, color: '#F759AB' },
        { status: TaskStatus.Testing, title: 'Testing', icon: <BugOutlined />, color: '#FAAD14' },
        { status: TaskStatus.Done, title: 'Done', icon: <CheckOutlined />, color: '#52C41A' }
    ];

    const priorityColors = { high: 'red', medium: 'orange', low: 'green' };

    const getTasksByStatus = (status: TaskStatus) =>
        tasks.filter(task => task.taskStatus === status);

    if (loading || !currentUserId || userProjects.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Row gutter={16} style={{ padding: '20px', height: '100%' }}>
            <Col span={17}>
                <Title level={3} style={{ marginBottom: 24 }}>Project Task Board</Title>
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
                                    bodyStyle={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}
                                >
                                    <List
                                        dataSource={statusTasks}
                                        renderItem={task => (
                                            <List.Item key={task.id} style={{ margin: '0 8px 8px', padding: 0 }}>
                                                <Card
                                                    size="small"
                                                    title={
                                                        <Col style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <Text strong style={{ fontSize: 13 }}>{task.taskId}</Text>
                                                            <Tag color={priorityColors[task.priority.toLowerCase() as keyof typeof priorityColors]}>
                                                                {task.priority}
                                                            </Tag>
                                                        </Col>
                                                    }
                                                    extra={task.assignedToId && (
                                                        <Avatar size="small" style={{ backgroundColor: '#1890ff', fontSize: 10 }}>
                                                            {users[task.assignedToId]?.charAt(0) || 'U'}
                                                        </Avatar>
                                                    )}
                                                    style={{ width: '100%', borderLeft: `3px solid ${config.color}` }}
                                                >
                                                    <Text style={{ fontSize: 13 }}>{task.title}</Text>
                                                    {task.assignedToId && users[task.assignedToId] && (
                                                        <Col style={{ marginTop: 8 }}>
                                                            <Text type="secondary" style={{ fontSize: 11 }}>
                                                                {users[task.assignedToId]}
                                                            </Text>
                                                        </Col>
                                                    )}
                                                    {task.project?.projectTitle && (
                                                        <Col style={{ marginTop: 4 }}>
                                                            <Text type="secondary" style={{ fontSize: 11 }}>
                                                                Project: {task.project.projectTitle}
                                                            </Text>
                                                        </Col>
                                                    )}
                                                    {task.dueDate && (
                                                        <Col style={{ marginTop: 4 }}>
                                                            <Text type="secondary" style={{ fontSize: 11 }}>
                                                                Due: {new Date(task.dueDate).toLocaleDateString()}
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
