import React, { useState, useEffect } from "react";
import { Table, Tag, Typography, Spin, Button, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import api from "../api/api";
import { RoleEnum } from "../api/Role";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Text } = Typography;

interface Task {
    id: string;
    taskId: string;
    title: string;
    project: {
        projectId: string;
        projectTitle: string;
    };
    taskStatus: string;
    priority: string;
    dueDate: string;
    assignedToId: string;
    reportToId: string;
    comments: any[];
    description: string;
}
interface Employee {
    empId: string;
    name: string;
}

interface CurrentUser {
    userId: string;
    name: string;
    role: string;
    projectId?: string;
}

interface Project {
    projectId: string;
    projectTitle: string;
    employees: Array<{
        empId: string;
        name: string;
    }>;
}

const statusColors: Record<string, string> = {
    Backlog: "gray",
    NeedToDiscuss: "orange",
    Todo: "blue",
    InProgress: "blue",
    Developed: "cyan",
    UAT: "purple",
    Testing: "gold",
    Done: "green",
};

const priorityColors: Record<string, string> = {
    high: "red",
    Medium: "orange",
    Low: "green",
};

const TaskTable: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [userProjects, setUserProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const userRes = await api.get<CurrentUser>("User/current");
                setCurrentUser(userRes.data);

                let userProjectIds: string[] = [];
                let allEmployees: Employee[] = [];

                // Fetch projects and employees
                try {
                    const projectsRes = await axios.get<{ data: Project[] }>(
                        "https://localhost:7219/employees/all",
                        { withCredentials: true }
                    );

                    const allProjects = projectsRes.data.data || [];
                    let relevantProjects = allProjects;

                    // For non-admins, filter projects to those the user is part of
                    if (userRes.data.role !== RoleEnum.Admin) {
                        relevantProjects = allProjects.filter((project) =>
                            project.employees.some((emp) => emp.empId === userRes.data.userId)
                        );
                        userProjectIds = relevantProjects.map((project) => project.projectId);
                    }

                    setUserProjects(relevantProjects);

                    // Extract unique employees from relevant projects
                    const employeeMap = new Map<string, Employee>();
                    relevantProjects.forEach((project) => {
                        project.employees.forEach((emp) => {
                            if (!employeeMap.has(emp.empId)) {
                                employeeMap.set(emp.empId, emp);
                            }
                        });
                    });
                    allEmployees = Array.from(employeeMap.values());
                    setEmployees(allEmployees);
                } catch (error) {
                    message.error("Failed to load project data");
                    console.error("Error fetching projects:", error);
                }

                // Fetch and filter tasks
                const tasksRes = await api.get<{ data: Task[] }>("/Tasks");
                let filteredTasks = tasksRes.data.data || [];

                if (userRes.data.role !== RoleEnum.Admin) {
                    filteredTasks = filteredTasks.filter((task) =>
                        userProjectIds.includes(task.project.projectId)
                    );
                }

                setTasks(filteredTasks);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                message.error("Failed to load tasks");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    const getEmployeeName = (employeeId: string) => {
        const employee = employees.find((emp) => emp.empId === employeeId);
        return employee ? employee.name : employeeId; 
    };
    const handleTaskClick = (taskId: string) => {
        if (!currentUser) return;

        const role = currentUser.role;
        let path = `/tasks/${taskId}`; // fallback

        if (role === RoleEnum.Admin) {
            path = `/Home/tasks/${taskId}`;
        } else if (role === RoleEnum.TeamLead) {
            path = `/Teamlead/tasks/${taskId}`;
        } else if (role === RoleEnum.Employee) {
            path = `/Employee/tasks/${taskId}`;
        }

        navigate(path);
    };

    const columns: ColumnsType<Task> = [
        {
            title: "Task ID",
            dataIndex: "taskId",
            key: "taskId",
            sorter: (a, b) => a.taskId.localeCompare(b.taskId),
            render: (taskId, record) => (
                <Button
                    type="link"
                    onClick={() => handleTaskClick(record.taskId)}
                    style={{ padding: 0 }}
                >
                    {taskId}
                </Button>
            ),
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: "Project",
            key: "project",
            render: (_, record) => (
                <Text>
                    {record.project.projectTitle} ({record.project.projectId})
                </Text>
            ),
            sorter: (a, b) =>
                a.project.projectTitle.localeCompare(b.project.projectTitle),
        },
        {
            title: "Status",
            dataIndex: "taskStatus",
            key: "status",
            filters: Object.keys(statusColors).map((status) => ({
                text: status,
                value: status,
            })),
            onFilter: (value, record) => record.taskStatus === (value as string),
            render: (status: string) => (
                <Tag color={statusColors[status]}>{status}</Tag>
            ),
        },
        {
            title: "Priority",
            dataIndex: "priority",
            key: "priority",
            filters: Object.keys(priorityColors).map((priority) => ({
                text: priority,
                value: priority,
            })),
            onFilter: (value, record) => record.priority === (value as string),
            render: (priority: string) => (
                <Tag color={priorityColors[priority]}>{priority}</Tag>
            ),
        },
        {
            title: "Due Date",
            dataIndex: "dueDate",
            key: "dueDate",
            sorter: (a, b) =>
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
            render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm"),
        },
        {
            title: "Assigned To",
            dataIndex: "assignedToId",
            key: "assignedTo",
            sorter: (a, b) => {
                const aName = getEmployeeName(a.assignedToId);
                const bName = getEmployeeName(b.assignedToId);
                return aName.localeCompare(bName);
            },
            render: (assignedToId: string) => (
                <Text>{getEmployeeName(assignedToId)}</Text>
            ),
        },
    
    ];

    return (
        <Spin spinning={loading}>
            <Table
                columns={columns}
                dataSource={tasks}
                rowKey="taskId"
                bordered
                pagination={{ pageSize: 10 }}
                scroll={{ x: "max-content" }}
            />
        </Spin>
    );
};

export default TaskTable;

