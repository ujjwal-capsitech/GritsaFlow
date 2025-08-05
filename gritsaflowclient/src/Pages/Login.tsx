import React from "react";
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Button,
    Typography,
    message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../api/api";
import { useDispatch } from "react-redux";
import { setIsLogin, setRole, setTokenExpiry } from "../redux/slice/LoginSlice";
import type { AppDispatch } from "../redux/store";
import LoginIcon from "../Assets/LoginIcon.svg";
import type { RoleEnum } from "../api/Role";

const { Title } = Typography;

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
   

    const loginMutation = useMutation<
        { message: string },
        Error,
        { UserName: string; Password: string }
    >({
        mutationFn: async (loginData) => {
            const response = await api.post("User/login", loginData);
            return response.data;
        },
        // Login.tsx (onSuccess callback)
        onSuccess: (data) => {
            message.success("Logged in Successfully");

            dispatch(setIsLogin(true));
            dispatch(setRole(data.user.role as RoleEnum));
            dispatch(setTokenExpiry(data.tokenExpiry));

            localStorage.setItem("isLogin", "true");
            localStorage.setItem("Role", data.user.role);
            localStorage.setItem("tokenExpiry", data.tokenExpiry);

            navigate("/Home");
        },
        

        //},
        //onError: (err: any) => {
        //    console.error("Login error:", err.response?.data || err.message);
        //    message.error("Login failed. Please check credentials.");
        //},
    });

    const onFinish = (values: 
    {
        
        UserName: string;
        Password: string;
    }) => {
        loginMutation.mutate(values);
    };

    return (
        <Row justify="center" align="middle" style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", padding: "20px" }}>
            <Col xs={22} sm={20} md={16} lg={10} xl={8}>
                <Card style={{
                    width: '100%',
                    maxWidth: '700px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    background: "#f5f7fa",
                }}
                    bodyStyle={{
                        display: "flex",
                        padding: 0
                    }}>
                    <Row style={{
                        flex: 1,
                        background: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>

                        <img src={LoginIcon}
                            alt="login-Illustration"
                            style={{width:"80%",maxWidth:"250px"} }></img>
                    </Row>

                    <Row style={{
                        flex: 1,
                        padding: '50px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>

                        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
                            Gritsa Flows
                        </Title>

                        <Form name="login" onFinish={onFinish} layout="vertical">
                            <Form.Item
                                label="Username"
                                name="UserName"
                                rules={[{ required: true, message: "Please input your username!" }]}
                            >
                                <Input placeholder="Enter your username" />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="Password"
                                rules={[{ required: true, message: "Please input your password!" }]}
                            >
                                <Input.Password placeholder="Enter your password" />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    loading={loginMutation.isPending}
                                >
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};

export default Login;
