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
} from "antd";
import { useLocation, useParams } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../../api/api";

const { Option } = Select;

const priorityMap: Record<number, string> = {
    1: "High",
    2: "Medium",
    3: "Low",
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
    High: 1,
    Medium: 2,
    Low: 3,
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
    const { taskId } = useParams<{ taskId: string }>();
    const [taskData, setTaskData] = useState<TaskData | null>(location.state?.task || null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("description");
    const [comments, setComments] = useState<Comment[]>([]);
    const [comment, setComment] = useState("");
    const [projectEmployees, setProjectEmployees] = useState<Employee[]>([]);
    const [loadingEmployees, setLoadingEmployees] = useState(false);

    const [mainForm] = Form.useForm();
    const [detailsForm] = Form.useForm();

    const fetchTask = async () => {
        try {
            const response = await api.get(`/tasks/${taskId}`);
            const data: TaskData = response.data?.data;
            setTaskData(data);
            setComments(data?.comments || []);

            // Fetch project employees after task data is loaded
            if (data?.project?.projectId) {
                fetchProjectEmployees(data.project.projectId);
            }
        } catch (err) {
            message.error("Failed to load task data");
            console.error(err);
        } finally {
            setLoading(false);
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
        if (!taskData && taskId) {
            fetchTask();
        } else if (taskData) {
            setComments(taskData?.comments || []);
            setLoading(false);

            // Fetch project employees if taskData is available via state
            if (taskData?.project?.projectId) {
                fetchProjectEmployees(taskData.project.projectId);
            }
        }
    }, [taskId]);

    useEffect(() => {
        if (!taskData) return;

        // Set values for left-side form
        mainForm.setFieldsValue({
            projectId: taskData.project?.projectId || "",
            taskId: taskData.taskId || "",
            title: taskData.title || "",
            description: taskData.description || "",
        });

        // Set values for right-side form
        detailsForm.setFieldsValue({
            priority: priorityMap[taskData.priority] || "Low",
            dueDate: taskData.dueDate ? dayjs(taskData.dueDate) : null,
            assignee: taskData.assignedToId || "",
            reporter: taskData.reportToId || "",
            status: statusMap[taskData.taskStatus] || "Backlog",
        });
    }, [taskData]);

    const handleComment = async () => {
        if (comment.trim() && taskData) {
            const newComment = {
                name: "Ujjwal Raj",
                comment,
                createdAt: new Date().toISOString(),
            };

            try {
                await api.patch(`/tasks/${taskData.taskId}/comment`, {
                    comment: newComment.comment,
                });

                setComments((prev) => [newComment, ...prev]);
                setComment("");
                message.success("Comment added");
            } catch (err) {
                message.error("Failed to add comment");
                console.error(err);
            }
        }
    };

    const handleSubmit = async () => {
        if (!taskData) return;

        try {
            const main = mainForm.getFieldsValue();
            const details = detailsForm.getFieldsValue();

            const updatedTask = {
                ...taskData,
                title: main.title,
                description: main.description,
                dueDate: details.dueDate ? details.dueDate.toISOString() : null,
                assignedToId: details.assignee,
                reportToId: details.reporter,
                priority: reversePriorityMap[details.priority as string],
                taskStatus: reverseStatusMap[details.status as string],
            };

            await api.put(`/tasks/${taskData.taskId}`, updatedTask);
            message.success("Task saved successfully");
        } catch (err) {
            message.error("Failed to save task");
            console.error(err);
        }
    };

    if (loading) return <Spin tip="Loading Task..." />;
    if (!taskData) return <div>No task found.</div>;

    return (
        <Row gutter={24} style={{ padding: 24 }}>
            <Col xs={24} md={16}>
                <Card bordered={false}>
                    <Form form={mainForm} layout="vertical">
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

                        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                        <Tabs activeKey={activeTab} onChange={setActiveTab}>
                            <Tabs.TabPane key="description" tab="Description" />
                            <Tabs.TabPane key="comments" tab="Comments" />
                        </Tabs>

                        <div style={{ padding: 16 }}>
                            {activeTab === "description" ? (
                                <Form.Item name="description" rules={[{ required: true }]}>
                                    <Input.TextArea rows={4} placeholder="Write description..." />
                                </Form.Item>
                            ) : (
                                <>
                                    <Form.Item label="Create Comment">
                                        <Input.TextArea
                                            rows={2}
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Write your comment here..."
                                        />
                                    </Form.Item>
                                    <Button type="primary" onClick={handleComment}>
                                        Submit Comment
                                    </Button>

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
                                                                <span style={{ fontSize: 12 }}>
                                                                    {dayjs(item.createdAt).format("MMM D, YYYY h:mm A")}
                                                                </span>
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
                    <Form form={detailsForm} layout="vertical">
                        <Form.Item label="Priority" name="priority">
                            <Select>
                                <Option value="High">High</Option>
                                <Option value="Medium">Medium</Option>
                                <Option value="Low">Low</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Due Date" name="dueDate">
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>

                        <Form.Item label="Assigned To" name="assignee">
                            <Select
                                showSearch
                                optionFilterProp="children"
                                loading={loadingEmployees}
                                filterOption={(input, option) =>
                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                }
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
                            >
                                {projectEmployees.map(emp => (
                                    <Option key={emp.empId} value={emp.empId}>
                                        {emp.empName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Status" name="status">
                            <Select>
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

                <div style={{ textAlign: "right", marginTop: 16 }}>
                    <Button type="primary" onClick={handleSubmit}>
                        Save Task
                    </Button>
                </div>
            </Col>
        </Row>
    );
};

export default Task;