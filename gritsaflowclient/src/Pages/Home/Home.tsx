
import {
    Avatar,
    Dropdown,
    Layout,
    Menu,
    Row,
    Space,
    Spin,
    Typography
} from "antd";
import Sider from "antd/es/layout/Sider";
import {
    ProjectOutlined,
    DashboardOutlined,
    ReconciliationOutlined,
    UserOutlined,
    LogoutOutlined,
    DownOutlined,
    UserAddOutlined
} from '@ant-design/icons';
import { Content, Header } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { setSelectedKey } from "../../redux/slice/HomeSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import AdminDashboard from "../../Pages/Home/Pages/Dashboard";
import Project from "../../Pages/Home/Pages/Project";
import Task from "../../Pages/Home/Pages/Task";
import LoginIcon from "../../Assets/LoginIcon.svg";
import { logout } from "../../redux/slice/LoginSlice";
import { Link, useNavigate } from "react-router-dom";
import { RoleEnum } from '../../api/Role';
import api from "../../api/api";

const { Title } = Typography;

interface User {
    name: string;
    email: string;
    role: RoleEnum;
    avatarUrl?: string;
}

const Home: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const selectedKey = useSelector((state: RootState) => state.home.selectedKey);

    // Local state for user
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch user from backend using axios
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await api.get<User>("User/current");
                setUser(response.data);
            } catch (err) {
                setError("Error loading user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleMenuClick = (e: { key: string }) => {
        dispatch(setSelectedKey(e.key));
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    if (loading) return <Spin fullscreen />;
    if (error) return <div>{error}</div>;

    // Profile menu with user management option for admins
    const profileMenu = (
        <Menu style={{ width: 220 }}>
            <Menu.Item
                key="profile"
                icon={<UserOutlined style={{ paddingTop: 2, paddingRight: 5, fontSize: "20px", fontWeight: "bold" }} />}
            >
                <div>
                    <div style={{ fontWeight: 'bold' }}>{user?.name}</div>
                    <div>{user?.email}</div>
                </div>
            </Menu.Item>

            {user?.role === RoleEnum.Admin && (
                <Menu.Item key="user-management" icon={<UserAddOutlined />}>
                    <Link to="/admin/users">User Management</Link>
                </Menu.Item>
            )}

            <Menu.Item
                key="logout"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
            >
                Logout
            </Menu.Item>
        </Menu>
    );

    const renderContent = () => {
        switch (selectedKey) {
            case '1': return <AdminDashboard />;
            case '2': return <Project />;
            case '3': return <Task />;
            default: return <div>Select an option</div>;
        }
    };

    return (
        <Row style={{ background: "#EDF6FF", minHeight: "100vh" }}>
            <Layout style={{ minHeight: "100vh" }}>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    style={{ background: "#c3cfe2" }}
                >
                    <Row style={{
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        padding: "16px 0",
                        fontSize: 20,
                        fontWeight: "bold",
                        margin: 0,
                    }}>
                        <img
                            src={LoginIcon}
                            alt="login-Illustration"
                            style={{ width: "80%", maxWidth: "50px", marginBottom: 8 }}
                        />
                    </Row>

                    <Menu
                        theme="light"
                        mode="inline"
                        defaultSelectedKeys={["1"]}
                        selectedKeys={[selectedKey]}
                        onClick={handleMenuClick}
                        style={{ background: "#c3cfe2" }}
                    >
                        <Menu.Item key="1" icon={<DashboardOutlined />}>
                            Dashboard
                        </Menu.Item>
                        <Menu.Item key="2" icon={<ProjectOutlined />}>
                            Project
                        </Menu.Item>
                        <Menu.Item key="3" icon={<ReconciliationOutlined />}>
                            Task
                        </Menu.Item>

                        {user?.role === RoleEnum.Admin && (
                            <Menu.Item key="4" icon={<UserAddOutlined />}>
                                <Link to="/admin/users">Create Users</Link>
                            </Menu.Item>
                        )}
                    </Menu>
                </Sider>

                <Layout>
                    <Header style={{
                        background: "#c3cfe2",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0 24px",
                    }}>
                        <Title level={4} style={{ margin: 0 }}>
                            Welcome, {user?.name} ➜{" "}
                            <span style={{ fontWeight: "normal", color: "#444" }}>
                                {user?.role}
                            </span>
                        </Title>

                        <Dropdown overlay={profileMenu} trigger={["click"]}>
                            <Space style={{ cursor: "pointer" }}>
                                <Avatar
                                    src={user?.avatarUrl}
                                    icon={!user?.avatarUrl ? <UserOutlined /> : undefined}
                                    style={{ backgroundColor: user?.avatarUrl ? 'transparent' : '#1890ff' }}
                                />
                                <DownOutlined />
                            </Space>
                        </Dropdown>
                    </Header>

                    <Content style={{
                        padding: "20px",
                        margin: 0,
                        overflowY: "auto",
                        height: "calc(100vh - 64px)",
                        background: "#EDF6FF",
                    }}>
                        {renderContent()}
                    </Content>
                </Layout>
            </Layout>
        </Row>
    );
};

export default Home;
