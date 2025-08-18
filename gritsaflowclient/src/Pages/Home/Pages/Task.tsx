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
    Tabs,
    List,
    Avatar,
    message,
    Spin,
    Typography
} from "antd";
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useLocation, useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../../api/api";

const { Option } = Select;
const { Text } = Typography;

const priorityMap: Record<number, string> = {
    0: "high",
    1: "Medium",
    2: "Low",
};

const statusMap: Record<number, string> = {
    0: "Backlog",
    1: "NeedToDiscuss",
    2: "Todo",
    3: "InProgress",
    4: "Developed",
    5: "UAT",
    6: "Testing",
    7: "Done",
};

const reversePriorityMap: Record<string, number> = {
    high: 0,
    Medium: 1,
    Low: 2,
};

const reverseStatusMap: Record<string, number> = {
    Backlog: 0,
    NeedToDiscuss: 1,
    Todo: 2,
    InProgress: 3,
    Developed: 4,
    UAT: 5,
    Testing: 6,
    Done: 7,
};

interface Project {
    projectId: string;
    projectTitle: string;
}

interface Employee {
    empId: string;
    empName: string;
}

interface Comment {
    name: string;
    comment: string;
    createdAt: string;
}

interface Creator {
    id: string;
    name: string;
    createdAt: string;
}

interface Updator {
    id: string;
    name: string;
    updatedAt: string;
}

interface TaskData {
    id: string;
    taskId: string;
    title: string;
    project: Project;
    taskStatus: number;
    priority: number;
    dueDate: string;
    assignedToId: string;
    reportToId: string;
    comments: Comment[];
    description: string;
    isDeleted: boolean;
    creator: Creator;
    updator: Updator;
}

const Task: React.FC = () => {
    const location = useLocation();
    const { taskId: urlTaskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();
    const [taskData, setTaskData] = useState<TaskData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("description");
    const [comments, setComments] = useState<Comment[]>([]);
    const [projectEmployees, setProjectEmployees] = useState<Employee[]>([]);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get("User/current");
                setCurrentUser(response.data);
            } catch (err) {
                console.error("Failed to fetch current user", err);
            }
        };

        fetchCurrentUser();
    }, []);

    const fetchTask = async (identifier: string) => {
        try {
            // First try to fetch by internal ID
            try {
                const response = await api.get(`/tasks/${identifier}`);
                if (response.data?.data) {
                    setTaskData(response.data.data);
                    return response.data.data;
                }
            } catch (internalIdError) {
                console.log("Falling back to taskId search");
            }

            // If internal ID fails, fetch by taskId
            const allTasksResponse = await api.get("/tasks");
            if (allTasksResponse.data?.status && allTasksResponse.data.data) {
                const task = allTasksResponse.data.data.find(
                    (t: TaskData) => t.taskId === identifier
                );

                if (task) {
                    setTaskData(task);
                    return task;
                }
            }

            throw new Error("Task not found");
        } catch (err) {
            message.error("Failed to load task data");
            console.error(err);
            navigate("/not-found");
            return null;
        }
    };

    const fetchProjectEmployees = async (projectId: string) => {
        setLoadingEmployees(true);
        try {
            const response = await api.get(`/ProjectControllers/${projectId}`);
            setProjectEmployees(response.data?.data?.employees || []);
        } catch (err) {
            message.error("Failed to load project employees");
            console.error(err);
        } finally {
            setLoadingEmployees(false);
        }
    };

    useEffect(() => {
        const loadTask = async () => {
            setLoading(true);
            try {
                // Use task from location state if available
                if (location.state?.task) {
                    const task = location.state.task;
                    setTaskData(task);
                    setComments(task?.comments || []);
                    if (task?.project?.projectId) {
                        await fetchProjectEmployees(task.project.projectId);
                    }
                }
                // Otherwise fetch from API
                else if (urlTaskId) {
                    const task = await fetchTask(urlTaskId);
                    if (task) {
                        setComments(task?.comments || []);
                        if (task?.project?.projectId) {
                            await fetchProjectEmployees(task.project.projectId);
                        }
                    }
                }
                else {
                    throw new Error("No task identifier provided");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadTask();
    }, [urlTaskId, location.state]);

    useEffect(() => {
        if (!taskData) return;

        form.setFieldsValue({
            projectId: taskData.project?.projectId || "",
            taskId: taskData.taskId || "",
            title: taskData.title || "",
            description: taskData.description || "",
            priority: priorityMap[taskData.priority] || "Low",
            dueDate: taskData.dueDate ? dayjs(taskData.dueDate) : null,
            assignee: taskData.assignedToId || "",
            reporter: taskData.reportToId || "",
            status: statusMap[taskData.taskStatus] || "Backlog",
            newComment: ""
        });
    }, [taskData, form]);

    const handleSubmit = async () => {
        if (!taskData || !currentUser) return;

        try {
            const values = form.getFieldsValue();
            const newComment = values.newComment;

            // Prepare updated comments array
            const updatedComments = [...comments];
            if (newComment && newComment.trim()) {
                updatedComments.push({
                    name: currentUser.name,
                    comment: newComment,
                    createdAt: new Date().toISOString()
                });
            }

            // Prepare updated task object
            const updatedTask = {
                ...taskData,
                title: values.title,
                description: values.description,
                dueDate: values.dueDate ? values.dueDate.toISOString() : null,
                assignedToId: values.assignee,
                reportToId: values.reporter,
                priority: reversePriorityMap[values.priority as string],
                taskStatus: reverseStatusMap[values.status as string],
                comments: updatedComments,
                updator: {
                    id: currentUser.userId,
                    name: currentUser.name,
                }
            };

            await api.put(`/tasks/${taskData.id}`, updatedTask);

            // Update local state
            setTaskData(updatedTask);
            setComments(updatedComments);
            form.setFieldsValue({ newComment: "" });

            message.success("Task saved successfully");
            setIsEditMode(false);
        } catch (err) {
            message.error("Failed to save task");
            console.error(err);
        }
    };

    const shouldShowEditButton = () => {
        if (!currentUser || !taskData) return false;

        if (currentUser.role !== "employee") return true;

        return taskData.assignedToId === currentUser.userId;
    };

    if (loading) return <Spin tip="Loading Task..." />;
    if (!taskData) return <div>No task found.</div>;

    return (
        <Row gutter={24} style={{ padding: 24 }}>
            <Col xs={24} md={16}>
                <Card
                    bordered={false}
                    extra={
                        <Button
                            type="text"
                            icon={isEditMode ? <EyeOutlined /> : <EditOutlined />}
                            onClick={() => setIsEditMode(!isEditMode)}
                            style={{ display: shouldShowEditButton() ? "inline-block" : "none" }}
                        >
                            {isEditMode ? "View" : "Edit"}
                        </Button>
                    }
                >
                    <Form form={form} layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Project ID" name="projectId">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Task ID" name="taskId">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[{ required: true }]}
                        >
                            <Input disabled={!isEditMode} />
                        </Form.Item>

                        <Tabs activeKey={activeTab} onChange={setActiveTab}>
                            <Tabs.TabPane key="description" tab="Description" />
                            <Tabs.TabPane key="comments" tab="Comments" />
                        </Tabs>

                        <div style={{ padding: 16 }}>
                            {activeTab === "description" ? (
                                <Form.Item
                                    name="description"
                                    rules={[{ required: true }]}
                                >
                                    <Input.TextArea
                                        rows={4}
                                        placeholder="Write description..."
                                        disabled={!isEditMode}
                                    />
                                </Form.Item>
                            ) : (
                                <>
                                    {isEditMode && (
                                        <Form.Item name="newComment" label="Create Comment">
                                            <Input.TextArea
                                                rows={2}
                                                placeholder="Write your comment here..."
                                            />
                                        </Form.Item>
                                    )}

                                    <Card style={{ marginTop: 24 }}>
                                        <List
                                            dataSource={comments}
                                            locale={{ emptyText: "No comments yet" }}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={<Avatar>{item.name?.[0]}</Avatar>}
                                                        title={
                                                            <span>
                                                                {item.name}{" "}
                                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                                    {dayjs(item.createdAt).format("MMM D, YYYY h:mm A")}
                                                                </Text>
                                                            </span>
                                                        }
                                                        description={<span>{item.comment}</span>}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                </>
                            )}
                        </div>
                    </Form>
                </Card>
            </Col>

            <Col xs={24} md={8}>
                <Card
                    title="Task Details"
                    bordered={false}
                    headStyle={{ background: "#f7f7c2" }}
                    style={{ border: "1px solid #f0f0f0" }}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item label="Priority" name="priority">
                            <Select disabled={!isEditMode}>
                                <Option value="high">High</Option>
                                <Option value="Medium">Medium</Option>
                                <Option value="Low">Low</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Due Date" name="dueDate">
                            <DatePicker
                                style={{ width: "100%" }}
                                disabled={!isEditMode}
                            />
                        </Form.Item>

                        <Form.Item label="Assigned To" name="assignee">
                            <Select
                                showSearch
                                optionFilterProp="children"
                                loading={loadingEmployees}
                                filterOption={(input, option) =>
                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                disabled={!isEditMode}
                            >
                                {projectEmployees.map(emp => (
                                    <Option key={emp.empId} value={emp.empId}>
                                        {emp.empName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Report To" name="reporter">
                            <Select
                                showSearch
                                optionFilterProp="children"
                                loading={loadingEmployees}
                                filterOption={(input, option) =>
                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                disabled={!isEditMode}
                            >
                                {projectEmployees.map(emp => (
                                    <Option key={emp.empId} value={emp.empId}>
                                        {emp.empName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Status" name="status">
                            <Select disabled={!isEditMode}>
                                <Option value="Backlog">Backlog</Option>
                                <Option value="NeedToDiscuss">Need To Discuss</Option>
                                <Option value="Todo">Todo</Option>
                                <Option value="InProgress">In Progress</Option>
                                <Option value="Developed">Developed</Option>
                                <Option value="UAT">UAT</Option>
                                <Option value="Testing">Testing</Option>
                                <Option value="Done">Done</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Card>

                {isEditMode && (
                    <div style={{ textAlign: "right", marginTop: 16 }}>
                        <Button type="primary" onClick={handleSubmit}>
                            Save Task
                        </Button>
                    </div>
                )}
            </Col>
        </Row>
    );
};

export default Task;