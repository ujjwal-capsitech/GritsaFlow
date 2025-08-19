import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../redux/store";
import {
    fetchUserProfile,
    updateUserProfile
} from "../redux/slice/UserProfileSlice";
import {
    selectUserProfile,
    selectUserProfileLoading,
    selectUserProfileError
} from "../redux/slice/UserProfileSlice";
import {
    Button,
    Form,
    Input,
    Row,
    Col,
    Avatar,
    Skeleton,
    message,
    Upload,
    Modal
} from "antd";
import { UserOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload/interface';

interface UserProfileModalProps {
    visible: boolean;
    onClose: () => void;
}

const UserProfilePage: React.FC<UserProfileModalProps> = ({ visible, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(selectUserProfile);
    const loading = useSelector(selectUserProfileLoading);
    const error = useSelector(selectUserProfileError);
    const [avatarData, setAvatarData] = useState<string | null>(null);
    const [form] = Form.useForm();
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (visible) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, visible]);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                name: user.name,
                email: user.email,
                role: user.role,
            });
            if (user.avatarUrl) {
                setAvatarData(user.avatarUrl);
            }
        }
    }, [user, form]);

    const handleImageUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Image must smaller than 2MB!");
            return false;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                setAvatarData(e.target.result as string);
            }
        };
        reader.readAsDataURL(file);
        return false;
    };

    const onFinish = (values: any) => {
        setIsUpdating(true);
        const updatedData = {
            ...values,
            avatarUrl: avatarData || user?.avatarUrl,
        };

        if (!updatedData.password) {
            delete updatedData.password;
        }

        dispatch(updateUserProfile(updatedData))
            .unwrap()
            .then(() => {
                message.success("Profile updated successfully");
                onClose();
            })
            .catch((err) => {
                message.error(err || "Failed to update profile");
            })
            .finally(() => {
                setIsUpdating(false);
            });
    };

    return (
        <Modal
            title="User Profile"
            open={visible}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            width={600}
        >
            {loading && !user ? (
                <Skeleton active paragraph={{ rows: 6 }} />
            ) : error ? (
                <div style={{ color: "red" }}>
                    {error}
                    <Button onClick={() => dispatch(fetchUserProfile())}>Retry</Button>
                </div>
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        name: user?.name || "",
                        email: user?.email || "",
                        role: user?.role || "",
                    }}
                >
                    <Row justify="center" style={{ marginBottom: 24 }}>
                        <Avatar
                            src={avatarData || user?.avatarUrl}
                            icon={!avatarData && !user?.avatarUrl && <UserOutlined />}
                            size={128}
                        />
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Avatar">
                                <Upload
                                    beforeUpload={handleImageUpload}
                                    showUploadList={false}
                                    accept="image/jpeg,image/png"
                                >
                                    <Button>Upload New Avatar</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: "Please input your name!" }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: "Please input your email!" },
                                    { type: "email", message: "Please enter a valid email!" },
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
                                rules={[{ min: 6, message: "Password must be at least 6 characters!" }]}
                            >
                                <Input.Password placeholder="Leave blank to keep current password" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Role" name="role">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading || isUpdating}
                                    block
                                >
                                    Update Profile
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            )}
        </Modal>
    );
};

export default UserProfilePage;