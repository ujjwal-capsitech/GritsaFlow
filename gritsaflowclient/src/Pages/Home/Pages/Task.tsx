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
} from "antd";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../../api/api"; 

const { Option } = Select;

const Task: React.FC = () => {
  const location = useLocation();
  const taskData = location.state?.task || {};

  const [activeTab, setActiveTab] = useState("description");
  const [comments, setComments] = useState<any[]>(taskData.comments || []);
  const [comment, setComment] = useState("");
  const [mainForm] = Form.useForm();
  const [detailsForm] = Form.useForm();

  // Load task details from backend if not passed
  useEffect(() => {
    if (!taskData?.taskId) {
      message.error("Task data not found");
    }
  }, [taskData]);

  const handleComment = async () => {
    if (comment.trim()) {
      try {
        const payload = {
          name: "You", // ideally use logged-in user
          comment,
          createdAt: new Date().toISOString(),
        };

        // ✅ Update backend
        await api.patch(
          `/tasks/${taskData.taskId}/description`,
          payload.comment
        );

        setComments((prev) => [payload, ...prev]);
        setComment("");
        message.success("Comment added");
      } catch (err) {
        message.error("Failed to add comment");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const main = mainForm.getFieldsValue();
      const details = detailsForm.getFieldsValue();

      const updatedTask = {
        ...taskData,
        title: main.title,
        description: main.description,
        dueDate: details.dueDate
          ? details.dueDate.toISOString()
          : taskData.dueDate,
        assignedToId: details.assignee,
        reportToId: details.reporter,
        taskStatus: details.status,
      };

      await api.put(`/tasks/${taskData.taskId}`, updatedTask);
      message.success("Task saved successfully");
    } catch (err) {
      message.error("Failed to save task");
    }
  };

  const initialValues = {
    projectId: taskData?.projectId || "",
    projectTitle: taskData?.projectTitle || "",
    taskId: taskData?.taskId || "",
    title: taskData?.title || "",
    description: taskData?.description || "",
  };

  const dueDate = taskData?.dueDate ? dayjs(taskData.dueDate) : undefined;

  return (
    <Row gutter={24} style={{ padding: 24 }}>
      <Col xs={24} md={16}>
        <Card bordered={false}>
          <Form form={mainForm} layout="vertical" initialValues={initialValues}>
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

            {/* Tabs for description & comments*/}
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <Tabs.TabPane key="description" tab="Description" />
              <Tabs.TabPane key="comments" tab="Comments" />
            </Tabs>

            <div style={{ padding: 16, borderRadius: 4 }}>
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
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar>{item.name?.[0]}</Avatar>}
                            title={
                              <span>
                                {item.name}{" "}
                                <span style={{ fontSize: 12 }}>
                                  {dayjs(item.createdAt).format(
                                    "MMM D, YYYY h:mm A"
                                  )}
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

      {/* Right Editable Task Details */}
      <Col xs={24} md={8}>
        <Card
          title="Task Details"
          bordered={false}
          headStyle={{ background: "#f7f7c2" }}
          style={{ border: "1px solid #f0f0f0" }}
        >
          <Form
            form={detailsForm}
            layout="vertical"
            initialValues={{
              priority: taskData?.priority || "Low",
              dueDate,
              assignee: taskData?.assignedToId,
              reporter: taskData?.reportToId,
              status: taskData?.taskStatus,
            }}
          >
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
              <Input />
            </Form.Item>
            <Form.Item label="Report To" name="reporter">
              <Input />
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
