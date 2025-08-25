import {
    Avatar,
    Button,
    Card,
    Col,
    Dropdown,
    Layout,
    Menu,
    Modal,
    Row,
    Space,
    Typography,
    message,
} from "antd";
import Sider from "antd/es/layout/Sider";
import {
    ProjectOutlined,
    DashboardOutlined,
    UserOutlined,
    LogoutOutlined,
    DownOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import LoginIcon from "../../Assets/LoginIcon.svg";
import { logout } from "../../redux/slice/LoginSlice";
import { useNavigate, Outlet } from "react-router-dom";
import { RoleEnum } from "../../api/Role";
import api from "../../api/api";
//import UserRegistrationForm from "../../Components/UserRegistrationForm";
import EmpDashboard from "./EmpDashboard";
import BoardCardEmployee from "./BoardCardEmployee";
import UserProfilePage from "../../Components/ UserProfilePage";
// import CreateTask from "../../Components/CreateTask";
import Task from "../Task";
import CreateTask from "../../Components/CreateTask";
import AdminDashboard from "../Dashboard";
import Dashboard from "../Dashboard";

const { Title } = Typography;

interface User {
    name: string;
    email: string;
    role: RoleEnum;
    avatarUrl?: string;
}

const HomeEmp: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [selectedKey, setSelectedKey] = useState(() => {
        const savedKey = localStorage.getItem("selectedKey");
        if (savedKey) return savedKey;
        return "1";
    });

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    //const [isModalVisible, setIsModalVisible] = useState(false);
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false); // New state for profile modal
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await api.get<User>("User/current");
                setUser(response.data);
            } catch {
                setError("Error loading user data");
                message.error("Error loading user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleMenuClick = (e: { key: string }) => {
        setSelectedKey(e.key);
        localStorage.setItem("selectedKey", e.key);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };
    
    if (error) return <Card>{error}</Card>;

    const profileMenu = (
        <Menu style={{ width: 220 }}>
            <Menu.Item
                key="profile"
                icon={
                    <UserOutlined
                        style={{
                            paddingTop: 2,
                            paddingRight: 5,
                            fontSize: "20px",
                            fontWeight: "bold",
                        }}
                    />
                }
                onClick={() => setIsProfileModalVisible(true)}
            >
                Profile
            </Menu.Item>

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
            case "1":
                return <Dashboard />;
            case "2":
                return <BoardCardEmployee />;
            case "3":
                return <Task />;

            default:
                return "Select an option";
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
            <Row
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "16px 0",
                fontSize: 20,
                fontWeight: "bold",
                margin: 0,
              }}
            >
              <img
                src={LoginIcon}
                alt="login-Illustration"
                onClick={() => navigate("/Employee")}
                style={{ width: "80%", maxWidth: "50px", marginBottom: 8 }}
              />
            </Row>

            <Menu
              theme="light"
              mode="inline"
              selectedKeys={[selectedKey]}
              onClick={handleMenuClick}
              style={{ background: "#c3cfe2" }}
            >
                        <Menu.Item key="1"  icon={<DashboardOutlined />}>
                Dashboard
              </Menu.Item>
              <Menu.Item key="2" icon={<ProjectOutlined />}>
                Board
              </Menu.Item>
              <Menu.Item key="3" icon={<ProjectOutlined />}>
                Tasks
              </Menu.Item>
            </Menu>
          </Sider>

          <Layout>
            <Header
              style={{
                background: "#c3cfe2",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 24px",
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                Welcome, {user?.name} <ArrowRightOutlined />{" "}
                {
                  <span style={{ fontWeight: "normal", color: "#444" }}>
                    {" "}
                    {user?.role}{" "}
                  </span>
                }
              </Title>
              <Space>
                <Button
                  color="blue"
                  variant="link"
                  onClick={() => setIsCreateModalVisible(true)}
                  style={{ marginBottom: 16 }}
                >
                  Create Task
                </Button>

                <Dropdown overlay={profileMenu} trigger={["click"]}>
                  <Space style={{ cursor: "pointer" }}>
                    <Avatar
                      src={user?.avatarUrl}
                      icon={!user?.avatarUrl ? <UserOutlined /> : undefined}
                      style={{
                        backgroundColor: user?.avatarUrl
                          ? "transparent"
                          : "#1890ff",
                      }}
                    />
                    <DownOutlined />
                  </Space>
                </Dropdown>
              </Space>
            </Header>

            <Content
              style={{
                padding: "20px",
                margin: 0,
                overflowY: "auto",
                height: "calc(100vh - 64px)",
                background: "#EDF6FF",
              }}
            >
              {/* Add Outlet for nested routes */}

              <Outlet />

              {!window.location.pathname.includes("/Employee/tasks/") &&
                renderContent()}
            </Content>
          </Layout>
        </Layout>
        <Modal
          title="Create New Task"
          open={isCreateModalVisible}
          onCancel={() => setIsCreateModalVisible(false)}
          footer={null}
          destroyOnClose
          width={600}
        >
          <CreateTask
            visible={isCreateModalVisible}
            onClose={() => setIsCreateModalVisible(false)}
          />
        </Modal>
        <UserProfilePage
          visible={isProfileModalVisible}
          onClose={() => setIsProfileModalVisible(false)}
        />
      
      </Row>
    );
};


export default HomeEmp;
