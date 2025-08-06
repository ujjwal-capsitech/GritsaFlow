//import React, { useState } from 'react';
//import { Form, Input, Button, Select, message } from 'antd';
//import { UserOutlined, MailOutlined, LockOutlined, UserAddOutlined } from '@ant-design/icons';
////import { useCreateUserMutation } from '../redux/api/userApi';
//import { RoleEnum } from '../api/Role';

//const UserRegistrationForm: React.FC = () => {
//    const [form] = Form.useForm();
//    const [createUser, { isLoading }] = useCreateUserMutation();
//    const [success, setSuccess] = useState(false);

//    const onFinish = async (values: any) => {
//        try {
//            await createUser(values).unwrap();
//            message.success('User created successfully');
//            setSuccess(true);
//            form.resetFields();
//            setTimeout(() => setSuccess(false), 3000);
//        } catch (error) {
//            message.error('Failed to create user');
//        }
//    };

//    return (
//        <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
//            <h2 style={{ marginBottom: 24 }}>Create New User</h2>
//            <Form
//                form={form}
//                layout="vertical"
//                onFinish={onFinish}
//                autoComplete="off"
//            >
//                <Form.Item
//                    label="Full Name"
//                    name="name"
//                    rules={[{ required: true, message: 'Please enter full name' }]}
//                >
//                    <Input prefix={<UserOutlined />} placeholder="John Doe" />
//                </Form.Item>

//                <Form.Item
//                    label="Username"
//                    name="userName"
//                    rules={[{ required: true, message: 'Please enter username' }]}
//                >
//                    <Input prefix={<UserOutlined />} placeholder="johndoe" />
//                </Form.Item>

//                <Form.Item
//                    label="Email"
//                    name="email"
//                    rules={[
//                        { required: true, message: 'Please enter email' },
//                        { type: 'email', message: 'Invalid email format' }
//                    ]}
//                >
//                    <Input prefix={<MailOutlined />} placeholder="john@example.com" />
//                </Form.Item>

//                <Form.Item
//                    label="Password"
//                    name="password"
//                    rules={[{ required: true, message: 'Please enter password' }]}
//                >
//                    <Input.Password prefix={<LockOutlined />} placeholder="Password" />
//                </Form.Item>

//                <Form.Item
//                    label="Avatar URL (Optional)"
//                    name="avatarUrl"
//                >
//                    <Input placeholder="https://example.com/avatar.jpg" />
//                </Form.Item>

//                <Form.Item
//                    label="Role"
//                    name="role"
//                    rules={[{ required: true, message: 'Please select role' }]}
//                >
//                    <Select placeholder="Select role">
//                        {Object.values(RoleEnum).map(role => (
//                            <Select.Option key={role} value={role}>
//                                {role.charAt(0).toUpperCase() + role.slice(1)}
//                            </Select.Option>
//                        ))}
//                    </Select>
//                </Form.Item>

//                <Form.Item>
//                    <Button
//                        type="primary"
//                        htmlType="submit"
//                        loading={isLoading}
//                        icon={<UserAddOutlined />}
//                        style={{ width: '100%' }}
//                    >
//                        Create User
//                    </Button>
//                    {success && (
//                        <div style={{ color: 'green', marginTop: 10 }}>
//                            User created successfully!
//                        </div>
//                    )}
//                </Form.Item>
//            </Form>
//        </div>
//    );
//};

//export default UserRegistrationForm;
export { }