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
    Table,
    Tag,
    message,
    Space
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from 'dayjs';
import api from "../../../api/api";

const { Title, Text } = Typography;
const { Option } = Select;

interface EmployeeRef {
    empId: string;
    empName: string;
}

interface UserBasicDto {
    userId: string;
    name: string;
    userName: string;
}

interface Project {
    id?: string;
    projectId: string;
    projectTitle: string;
    projectDescription: string;
    projectStatus: string;
    dueDate: string;
    employees?: EmployeeRef[];
}

interface ApiResponse<T> {
    data: T;
    status: boolean;
    message?: string;
}

const statusColors: Record<string, string> = {
    Ongoing: "blue",
    Completed: "green",
    UnderService: "orange",
    Todo: "red",
};

const Project: React.FC = () => {
    const [form] = Form.useForm();
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<UserBasicDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isVisible, setisVisible] = useState(false);
    

    const fetchProjects = async () => {
        try {
            const res = await api.get<ApiResponse<Project[]>>("/ProjectControllers");
            if (res.data.status) {
                setProjects(res.data.data);
            }
        } catch {
            message.error("Failed to fetch projects");
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get<ApiResponse<UserBasicDto[]>>("/User/basic");
            if (res.data.status) {
                setUsers(res.data.data.items);
            }
        } catch {
            message.error("Failed to fetch users");
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchUsers();
    }, []);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const payload: Project = {
                projectId: values.projectId,
                projectTitle: values.projectTitle,
                projectDescription: values.projectDescription,
                projectStatus: values.projectStatus,
                dueDate: dayjs(values.dueDate).toISOString(),
                employees: values.employees?.map((userId: string) => {
                    const user = users.find(u => u.userId === userId);
                    return {
                        empId: userId,
                        empName: user?.name || ''
                    };
                }),
            };

            if (editingId) {
                await api.put(`/ProjectControllers/${editingId}`, payload);
                message.success("Project updated successfully!");
            } else {
                await api.post("/ProjectControllers", payload);
                message.success("Project created successfully!");
            }

            fetchProjects();
            resetForm();
        } catch {
            message.error(editingId ? "Error updating project" : "Error creating project");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (project: Project) => {
        setEditingId(project.id || null);
        form.setFieldsValue({
            projectId: project.projectId,
            projectTitle: project.projectTitle,
            projectDescription: project.projectDescription,
            projectStatus: project.projectStatus,
            dueDate: dayjs(project.dueDate),
            employees: project.employees?.map(emp => emp.empId),
        });
        setisVisible(false);
    };

    const handleView = (project: Project) => {
        form.setFieldsValue({
            projectId: project.projectId,
            projectTitle: project.projectTitle,
            projectDescription: project.projectDescription,
            projectStatus: project.projectStatus,
            dueDate: dayjs(project.dueDate),
            employees: project.employees?.map(emp => emp.empId),
        });
        form.getFieldInstance('projectId').focus();
        setisVisible(true);
        
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/ProjectControllers/${id}`);
            message.success("Project deleted successfully");
            fetchProjects();
        } catch {
            message.error("Error deleting project");
        }
    };

    const resetForm = () => {
        form.resetFields();
        setEditingId(null);
    };

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('MMM D, YYYY h:mm A');
    };

    const columns: ColumnsType<Project> = [
        {
            title: "Project ID",
            dataIndex: "projectId",
            key: "projectId",
        },
        {
            title: "Project Title",
            dataIndex: "projectTitle",
            key: "projectTitle",
        },
        {
            title: "Status",
            dataIndex: "projectStatus",
            key: "projectStatus",
            render: (status) => (
                <Tag color={statusColors[status] || "default"}>{status}</Tag>
            ),
        },
        {
            title: "Due Date",
            dataIndex: "dueDate",
            key: "dueDate",
            render: (date) => formatDate(date),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleView(record)}>
                        View
                    </Button>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => handleDelete(record.projectId)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Row gutter={24} style={{padding: 24 }}>
            <Col xs={24} md={12}>
                <Card
                    title={<Text style={{ color: "#985858ff" }}>
                        {editingId ? 'Edit Project' : 'Create New Project'}
                    </Text>}
                    style={{ marginBottom: 24 }}
                    bordered={false}
                    extra={editingId && (
                        <Button onClick={resetForm}>Cancel</Button>
                    )}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        requiredMark={false}
                        disabled={isVisible }
                    >
                        <Form.Item
                            label="Project ID"
                            name="projectId"
                            rules={[
                                { required: true, message: "Please input the Project ID!" },
                            ]}
                        >
                            <Input placeholder="Enter Project ID" />
                        </Form.Item>

                        <Form.Item
                            label="Project Title"
                            name="projectTitle"
                            rules={[
                                { required: true, message: "Please input the Project Title!" },
                            ]}
                        >
                            <Input placeholder="Enter Project Title" />
                        </Form.Item>

                        <Form.Item
                            label="Employees"
                            name="employees"
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select Employees"
                                options={users.map(user => ({
                                    value: user.userId,
                                    label: `${user.name} (${user.userName})`
                                }))}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Status"
                            name="projectStatus"
                            rules={[{ required: true, message: "Please select status!" }]}
                        >
                            <Select placeholder="Select Status">
                                <Option value="Todo">Todo</Option>
                                <Option value="Ongoing">Ongoing</Option>
                                <Option value="Completed">Completed</Option>
                                <Option value="UnderService">Under Service</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Due Date"
                            name="dueDate"
                            rules={[{ required: true, message: "Please select due date!" }]}
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                showTime
                                format="MMM D, YYYY h:mm A"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="projectDescription"
                            rules={[{ required: true, message: "Please input description!" }]}
                        >
                            <Input.TextArea rows={3} placeholder="Project Description" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                            >
                                {editingId ? 'Update Project' : 'Create Project'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
            <Col xs={24} md={12}>
                <Card
                    title={
                        <Title level={4} style={{ color: "#985858ff" }}>
                            Project List
                        </Title>
                    }
                    bordered={false}
                >
                    <Table
                        columns={columns}
                        dataSource={projects}
                        rowKey="projectId"
                        pagination={{ pageSize: 5 }}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default Project;