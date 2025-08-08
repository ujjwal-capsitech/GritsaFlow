import { useState } from "react";
import { Button, Form, Input, Modal, Select, message } from "antd";
import api from "../api/api";
import type { RoleEnum } from "../api/Role";

const { Option } = Select;

interface UserRegistrationFormProps {
  visible: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  userName: string;
  password: string;
  email: string;
  role: RoleEnum;
  avatarUrl?: string;
}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    try {
      await api.post("User/register", values);
      message.success("User registered successfully");
      onClose();
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as any).response?.status === 403
      ) {
        message.error("You do not have permission to register users.");
      } else {
        message.error("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create User"
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Username"
          name="userName"
          rules={[{ required: true, message: "Please enter username" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter password" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email", message: "Enter valid email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select placeholder="Select a role">
            <Option value="Admin">Admin</Option>
            <Option value="Employee">Employee</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Avatar URL" name="avatarUrl">
          <Input placeholder="(Optional)" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Register
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserRegistrationForm;
