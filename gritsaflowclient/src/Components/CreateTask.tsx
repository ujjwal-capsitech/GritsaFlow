import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    Row,
    Select,
    message
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import api from "../api/api";
import axios from "axios";

// const { Title, Text } = Typography;
const { Option } = Select;

interface Project {
    projectId: string;
    projectTitle: string;
    employees: Array<{
        empId: string;
        name: string;
    }>;
}

interface Employee {
    userId: string;
    name: string;
    userName: string;
}

interface CurrentUser {
    userId: string;
    name: string;
    role: string;
}

interface TaskFormValues {
    taskId: string;
    title: string;
    projectId: string;
    taskStatus: string;
    priority: string;
    dueDate: dayjs.Dayjs;
    assignedToId: string;
    reportToId: string;
    description: string;
}

interface TaskPayload {
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
    description: string;
    creator?: {
        id: string;
        name: string;
        createdAt: string;
    };
    updator?: {
        id: string;
        name: string;
        updatedAt: string;
    };
}

const statusOptions = [
    "Backlog",
    "NeedToDiscuss",
    "Todo",
    "InProgress",
    "Developed",
    "UAT",
    "Testing",
    "Done",
];

const priorityOptions = ["high", "Medium", "Low"];

const CreateTask: React.FC<{ visible: boolean; onClose: () => void }> = ({
    visible,
    onClose,
}) => {
    const [form] = Form.useForm();
    const [projects, setProjects] = useState<Project[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [projectLoading, setProjectLoading] = useState(false);
    const [employeeLoading, setEmployeeLoading] = useState(false);

    useEffect(() => {
        if (!visible) return;

        const fetchData = async () => {
            try {
                // Fetch current user
                const userRes = await api.get<CurrentUser>("User/current");
                setCurrentUser(userRes.data);

                // Fetch projects
                setProjectLoading(true);
                const projRes = await api.get<{ data: Project[] }>("/ProjectControllers");
                let allProjects = projRes.data.data || [];

                // If user is not admin, filter projects to only those the user is part of
                if (userRes.data.role !== "Admin") {
                    try {
                        // Get all projects with employees to check which ones the user belongs to
                        const projectsWithEmployeesRes = await axios.get<{ data: Project[] }>(
                            "https://localhost:7219/employees/all",
                            {
                                withCredentials: true,
                            }
                        );

                        const projectsWithEmployees = projectsWithEmployeesRes.data.data || [];
                        const userProjects = projectsWithEmployees.filter(project =>
                            project.employees.some(emp => emp.empId === userRes.data.userId)
                        );

                        // Filter available projects to only those the user belongs to
                        allProjects = allProjects.filter(project =>
                            userProjects.some(userProject => userProject.projectId === project.projectId)
                        );
                    } catch (error) {
                        console.error("Error fetching user projects:", error);
                        message.error("Failed to load user projects");
                    }
                }

                setProjects(allProjects);

                // Fetch all employees initially
                setEmployeeLoading(true);
                const empRes = await api.get<{ data: { items: Employee[] } }>("/User/basic");
                setEmployees(empRes.data.data.items || []);
            } catch (error) {
                message.error("Failed to load data");
            } finally {
                setProjectLoading(false);
                setEmployeeLoading(false);
            }
        };

        fetchData();
    }, [visible]);

    // Handle project selection change to filter employees
    const handleProjectChange = (projectId: string) => {
        if (!projectId) {
            setFilteredEmployees(employees);
            return;
        }

        const selectedProject = projects.find(p => p.projectId === projectId);
        if (selectedProject && selectedProject.employees) {
            // Filter employees to only those in the selected project
            const projectEmployeeIds = selectedProject.employees.map(emp => emp.empId);
            const filtered = employees.filter(emp =>
                projectEmployeeIds.includes(emp.userId)
            );
            setFilteredEmployees(filtered);
        } else {
            setFilteredEmployees(employees);
        }
    };

    const handleSubmit = async (values: TaskFormValues) => {
        if (!currentUser) {
            message.error("User information not available");
            return;
        }

        setLoading(true);

        try {
            const selectedProject = projects.find(p => p.projectId === values.projectId);

            if (!selectedProject) {
                message.error("Selected project not found");
                return;
            }

            const payload: TaskPayload = {
                taskId: values.taskId,
                title: values.title,
                project: {
                    projectId: selectedProject.projectId,
                    projectTitle: selectedProject.projectTitle,
                },
                taskStatus: values.taskStatus,
                priority: values.priority,
                dueDate: values.dueDate.toISOString(),
                assignedToId: values.assignedToId,
                reportToId: values.reportToId,
                description: values.description,
                creator: {
                    id: currentUser.userId,
                    name: currentUser.name,
                    createdAt: new Date().toISOString(),
                },
                updator:
                {
                    id: currentUser.userId,
                    name: currentUser.name,
                    updatedAt: new Date().toISOString(),

                }

            };

            await api.post("/Tasks", payload);
            message.success("Task created successfully!");
            form.resetFields();
            onClose();
        } catch (error) {
            console.error("Task creation error:", error);
            message.error("Error creating task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row justify="center" align="middle" style={{ display: "flex", padding: "20px" }}>
            <Col xs={24} md={16} >

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    requiredMark={false}
                    disabled={loading}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Project"
                                name="projectId"
                                rules={[{ required: true, message: "Please select project!" }]}
                            >
                                <Select
                                    placeholder="Select Project"
                                    loading={projectLoading}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.children ?? '')
                                            .toString()
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    onChange={handleProjectChange}
                                >
                                    {projects.map(project => (
                                        <Option key={project.projectId} value={project.projectId}>
                                            {project.projectTitle} ({project.projectId})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: "Please input title!" }]}
                    >
                        <Input placeholder="Enter task title" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Please input description!" }]}
                    >
                        <Input.TextArea rows={3} placeholder="Task description" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Status"
                                name="taskStatus"
                                rules={[{ required: true, message: "Please select status!" }]}
                            >
                                <Select placeholder="Select status">
                                    {statusOptions.map(status => (
                                        <Option key={status} value={status}>
                                            {status}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Priority"
                                name="priority"
                                rules={[{ required: true, message: "Please select priority!" }]}
                            >
                                <Select placeholder="Select priority">
                                    {priorityOptions.map(priority => (
                                        <Option key={priority} value={priority}>
                                            {priority}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Due Date"
                        name="dueDate"
                        rules={[{ required: true, message: "Please select due date!" }]}
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Assigned To"
                                name="assignedToId"
                                rules={[{ required: true, message: "Please select assignee!" }]}
                            >
                                <Select
                                    placeholder="Select assignee"
                                    loading={employeeLoading}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.children ?? '')
                                            .toString()
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {(filteredEmployees.length > 0 ? filteredEmployees : employees).map(employee => (
                                        <Option key={employee.userId} value={employee.userId}>
                                            {employee.name} ({employee.userName})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Report To"
                                name="reportToId"
                                rules={[{ required: true, message: "Please select reporter!" }]}
                            >
                                <Select
                                    placeholder="Select reporter"
                                    loading={employeeLoading}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.children ?? '')
                                            .toString()
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {(filteredEmployees.length > 0 ? filteredEmployees : employees).map(employee => (
                                        <Option key={employee.userId} value={employee.userId}>
                                            {employee.name} ({employee.userName})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{ width: "100%" }}
                        >
                            Create Task
                        </Button>
                    </Form.Item>
                </Form>
            </Col>

        </Row>
    );
};

export default CreateTask;