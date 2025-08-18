import { useState, useEffect } from "react";
import {
    Button,
    Form,
    Input,
    Modal,
    Select,
    message,
    Row,
    Col,
    Upload,
    Card,
    Typography
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../api/api";
import type { RoleEnum } from "../api/Role";

const { Option } = Select;
const { Text } = Typography;

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

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({
    visible,
    onClose,
}) => {
    const [loading, setLoading] = useState(false);
    const [avatarData, setAvatarData] = useState<string | null>(null);

    useEffect(() => {
        if (!visible) {
            setAvatarData(null);
        }
    }, [visible]);

    const onFinish = async (values: FormValues) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                avatarUrl: avatarData || undefined,
            };

            await api.post("User/register", payload);
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

    const validateName = (_: any, value: string) => {
        return value && value.trim() !== ""
            ? Promise.resolve()
            : Promise.reject();
    };

    const handleImageUpload = (file: File) => {
        if (!file.type.match("image/jpeg")) {
            message.error("Please select a JPEG image");
            return Upload.LIST_IGNORE;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                const base64Data = `data:${file.type};base64,${btoa(
                    new Uint8Array(event.target.result as ArrayBuffer).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        ""
                    )
                )}`;
                setAvatarData(base64Data);
                message.success("Image uploaded successfully");
            }
        };
        reader.readAsArrayBuffer(file);

        return false; // prevent auto-upload
    };

    return (
        <Modal
            title="Create User"
            open={visible}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Col >
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ password: "Welcome" }}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[
                                    { required: true, message: "Please enter name" },
                                    { validator: validateName },
                                ]}
                            >
                                <Input placeholder="Enter full name" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Username"
                                name="userName"
                                rules={[
                                    { required: true, message: "Please enter username" },
                                    { validator: validateName },
                                ]}
                            >
                                <Input placeholder="Enter username" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    { required: true, message: "Password is required" },
                                ]}
                            >
                                <Input.Password disabled />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, type: "email", message: "Enter valid email" },
                                    { validator: validateName },
                                ]}
                            >
                                <Input placeholder="Enter email address" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Role"
                                name="role"
                                rules={[
                                    { required: true, message: "Please select a role" },
                                ]}
                            >
                                <Select placeholder="Select a role">
                                    <Option value="admin">Admin</Option>
                                    <Option value="teamlead">Team Lead</Option>
                                    <Option value="employee">Employee</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Avatar">
                                <Upload
                                    beforeUpload={handleImageUpload}
                                    showUploadList={false}
                                    accept="image/jpeg"
                                >
                                    <Button icon={<UploadOutlined />}>
                                        Upload Avatar (JPEG)
                                    </Button>
                                </Upload>
                                {avatarData && (
                                    <Card
                                        size="small"
                                        style={{ marginTop: 12, background: "#fff" }}
                                    >
                                        <Text type="secondary">Preview (first 50 chars):</Text>
                                        <br />
                                        <Text code>
                                            {avatarData.substring(0, 50)}...
                                        </Text>
                                    </Card>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    block
                                >
                                    Register
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Modal>
    );
};

export default UserRegistrationForm;
