import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import { fetchUserProfile, updateUserProfile } from "../redux/slice/UserProfileSlice";
import {
    selectUserProfile,
    selectUserProfileLoading,
    selectUserProfileError
} from "../redux/slice/UserProfileSlice";
import { Button, Form, Input, Row, Col, Avatar, Typography, Skeleton, message, Upload } from "antd";
import { UserOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload/interface';

const { Title } = Typography;

const UserProfilePage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(selectUserProfile);
    const loading = useSelector(selectUserProfileLoading);
    const error = useSelector(selectUserProfileError);
    const [avatarData, setAvatarData] = useState<string | null>(null);
    const [form] = Form.useForm();

    // Initialize form with user data
    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

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
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            return false;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                setAvatarData(e.target.result as string);
            }
        };
        reader.readAsDataURL(file);
        return false; // Prevent default upload behavior
    };

    const onFinish = (values: any) => {
        const updatedData = {
            ...values,
            avatarUrl: avatarData || undefined,
        };

        dispatch(updateUserProfile(updatedData))
            .unwrap()
            .then(() => {
                message.success('Profile updated successfully');
            })
            .catch((err) => {
                message.error(err || 'Failed to update profile');
            });
    };

    if (loading && !user) {
        return (
            <Row justify="center" style={{ padding: 24 }}>
                <Col span={24}>
                    <Skeleton active paragraph={{ rows: 6 }} />
                </Col>
            </Row>
        );
    }

    if (error) {
        return (
            <Row justify="center" style={{ padding: 24 }}>
                <Col span={24}>
                    <div style={{ color: 'red' }}>{error}</div>
                </Col>
            </Row>
        );
    }

    return (
        <Row justify="center" style={{ padding: 24 }}>
            <Col xs={24} sm={20} md={16} lg={12} xl={10}>
                <Title level={2} style={{ textAlign: 'center' }}>User Profile</Title>

                <Row justify="center" style={{ marginBottom: 24 }}>
                    <Avatar
                        src={avatarData}
                        icon={!avatarData && <UserOutlined />}
                        size={128}
                    />
                </Row>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
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
                                rules={[{ required: true, message: 'Please input your name!' }]}
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
                                    { required: true, message: 'Please input your email!' },
                                    { type: 'email', message: 'Please enter a valid email!' },
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
                                    { min: 6, message: 'Password must be at least 6 characters!' },
                                ]}
                            >
                                <Input.Password placeholder="Leave blank to keep current password" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Role"
                                name="role"
                            >
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
                                    loading={loading}
                                    block
                                >
                                    Update Profile
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Row>
    );
};

export default UserProfilePage;