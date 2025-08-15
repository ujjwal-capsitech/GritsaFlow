import { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Select, message, Row, Col } from "antd";
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
    const [avatarData, setAvatarData] = useState<string | null>(null); // Stores base64 encoded image

    // Reset form and avatar data when modal closes
    useEffect(() => {
        if (!visible) {
            setAvatarData(null);
        }
    }, [visible]);

    const onFinish = async (values: FormValues) => {
        setLoading(true);
        try {
            // Prepare payload with base64 avatar if exists
            const payload = {
                ...values,
                avatarUrl: avatarData || undefined  // Send base64 string or undefined
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

    // Validation function to ensure fields aren't just whitespace
    const validateName = (_: any, value: string) => {
        return value && value.trim() !== ""
            ? Promise.resolve()
            : Promise.reject(new Error("Field cannot be empty"));
    };

    // Handle image upload and convert to base64
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check if file is JPEG
        if (!file.type.match('image/jpeg')) {
            message.error('Please select a JPEG image');
            return;
        }

        const reader = new FileReader();

        // On file load complete
        reader.onload = (event) => {
            if (event.target?.result) {
                // Format: data:image/jpeg;base64,<actual-base64-data>
                const base64Data = `data:${file.type};base64,${btoa(
                    new Uint8Array(event.target.result as ArrayBuffer)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                )}`;

                setAvatarData(base64Data);
                message.success("Image converted to base64");
            }
        };

        // Read file as binary data
        reader.readAsArrayBuffer(file);
    };

    return (
        <Modal
            title="Create User"
            open={visible}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Form
                layout="vertical"
                onFinish={onFinish}
                // Set password default value to "Welcome"
                initialValues={{ password: "Welcome" }}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                { required: true, message: "Please enter name" },
                                { validator: validateName }
                            ]}
                        >
                            <Input />
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
                                { validator: validateName }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                { required: true, message: "Password is required" }
                            ]}
                        >
                            {/* Disabled password field with default value */}
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
                                { validator: validateName }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label="Role"
                            name="role"
                            rules={[
                                { required: true, message: "Please select a role" }
                            ]}
                        >
                            <Select placeholder="Select a role">
                                <Option value="admin">Admin</Option>
                                <Option value="teamlead">Teamlead</Option>
                                <Option value="employee">Employee</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label="Avatar">
                            <input
                                type="file"
                                accept="image/jpeg"
                                onChange={handleImageUpload}
                                style={{ width: '100%' }}
                            />
                            {avatarData && (
                                <div style={{ marginTop: 10, fontSize: 12 }}>
                                    <p>Base64 Preview (first 50 chars):</p>
                                    <div style={{
                                        background: '#f0f0f0',
                                        padding: 8,
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {avatarData.substring(0, 50)}...
                                    </div>
                                </div>
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
        </Modal>
    );
};

export default UserRegistrationForm;