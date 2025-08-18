import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    Typography,
    message,
    Spin,
} from "antd";
import dayjs from "dayjs";
import api from "../api/api";

const { Title, Text } = Typography;
const { Option } = Select;

interface Project {
    projectId: string;
    projectTitle: string;
}

interface Employee {
    userId: string;
    name: string;
    userName: string;
}

interface CurrentUser {
    userId: string;
    name: string;
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

const CreateTask: React.FC = () => {
    const [form] = Form.useForm();
    const [projects, setProjects] = useState<Project[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [projectLoading, setProjectLoading] = useState(false);
    const [employeeLoading, setEmployeeLoading] = useState(false);

    // Fetch current user
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get<CurrentUser>("User/current");
                setCurrentUser({
                    userId: response.data.userId,
                    name: response.data.name,
                });
            } catch (error) {
                message.error("Failed to load current user");
            }
        };

        fetchCurrentUser();
    }, []);

    // Fetch projects
    useEffect(() => {
        const fetchProjects = async () => {
            setProjectLoading(true);
            try {
                const response = await api.get<{ data: Project[] }>("/ProjectControllers");
                setProjects(response.data.data || []);
            } catch (error) {
                message.error("Failed to fetch projects");
            } finally {
                setProjectLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Fetch employees
    useEffect(() => {
        const fetchEmployees = async () => {
            setEmployeeLoading(true);
            try {
                const response = await api.get<{ data: { items: Employee[] } }>("/User/basic");
                setEmployees(response.data.data.items || []);
            } catch (error) {
                message.error("Failed to fetch employees");
            } finally {
                setEmployeeLoading(false);
            }
        };

        fetchEmployees();
    }, []);

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
        } catch (error) {
            console.error("Task creation error:", error);
            message.error("Error creating task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row justify="center" align="middle" style={{ display: "flex",padding: "20px" }}>
            <Col xs={24} md={16} >
                <Card
                    title={
                        <Title level={4} style={{ color: "#985858ff" }}>
                            Create New Task
                        </Title>
                    }
                    bordered={false}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        requiredMark={false}
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
                                        {employees.map(employee => (
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
                                        {employees.map(employee => (
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
                </Card>
            </Col>
            </Row>
    );
};

export default CreateTask;