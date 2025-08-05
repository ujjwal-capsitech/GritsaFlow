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
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";

const { Title, Text } = Typography;
const { Option } = Select;

interface EmployeeRef {
    empId: string;
    empName: string;
}

interface Project {
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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async (values: any) => {
        setLoading(true);
        try {
            const payload: Project = {
                projectId: values.projectId,
                projectTitle: values.title,
                projectDescription: values.description,
                projectStatus: values.status,
                dueDate: values.dueDate.format("YYYY-MM-DD"),
                employees: values.employees?.map((name: string, idx: number) => ({
                    empId: `${idx + 1}`,
                    empName: name,
                })),
            };

            const res = await api.post<ApiResponse<Project>>(
                "/ProjectControllers",
                payload
            );
            if (res.data.status) {
                message.success("Project created successfully!");
                fetchProjects();
                form.resetFields();
            } else {
                message.error(res.data.message || "Failed to create project");
            }
        } catch {
            message.error("Error creating project");
        } finally {
            setLoading(false);
        }
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
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        onClick={() =>
                            navigate("/Home/Pages/Task", { state: { task: record } })
                        }
                    >
                        Edit
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => handleDelete(record.projectId)}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Row gutter={24} style={{ minHeight: "100vh", padding: 24 }}>
            <Col xs={24} md={12}>
                <Card
                    title={<Text style={{ color: "#985858ff" }}>Create New Project</Text>}
                    style={{ marginBottom: 24 }}
                    bordered={false}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleCreateProject}
                        requiredMark={false}
                    >
                        <Form.Item
                            label="Project Title"
                            name="title"
                            rules={[
                                { required: true, message: "Please input the Project Title!" },
                            ]}
                        >
                            <Input placeholder="Enter Project Title" />
                        </Form.Item>
                        <Form.Item
                            label="Employees"
                            name="employees"
                            rules={[{ required: false }]}
                        >
                            <Select mode="multiple" placeholder="Add/Remove Employees" />
                        </Form.Item>
                        <Form.Item
                            label="Status"
                            name="status"
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
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: "Please input description!" }]}
                        >
                            <Input.TextArea rows={3} placeholder="Project Description" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block>
                                Create Project
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
                        pagination={false}
                        rowKey="projectId"
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default Project;
