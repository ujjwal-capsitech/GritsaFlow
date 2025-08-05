import {  Avatar, Dropdown, Layout, Menu, Row, Space, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import {
    ProjectOutlined,
    DashboardOutlined,
    ReconciliationOutlined,
    UserOutlined,
    LogoutOutlined,
    DownOutlined,

} from '@ant-design/icons';
import { Content, Header } from "antd/es/layout/layout";
import React from "react";
import { setSelectedKey } from "../../redux/slice/HomeSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, Rootstate } from "../../redux/store";
import AdminDashboard from "../../Pages/Home/Pages/Dashboard";
import Project from "../Home/Pages/Project";
import Task from "../Home/Pages/Task"
import LoginIcon from "../../Assets/LoginIcon.svg";
import {logout} from "../../redux/slice/LoginSlice";
import { useNavigate } from "react-router";



const Home: React.FC = () => {
    const { Title } = Typography;
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const selectedKey = useSelector((state: Rootstate) => state.home.selectedKey);

    const handleMenuClick = (e: { key: string }) => {
        dispatch(setSelectedKey(e.key));
    };
    const handleLogout = () =>{
        dispatch(logout());
        navigate("/");
    };
     const user = {
       name: "Ujjwal Raj",
       email: "ujjwal.raj@capsitech.com",
       role: "Employee",
       avatarUrl:
         "https://app.capsitask.com/v1/api/user/profilepicture?id=68652838045c6576ca1e63c3&isThumb=0?t=nThpZ6vcTKS+PXWk6qkbnw==", // ? use your actual image or fallback
     };

const profileMenu = (
  <Menu style={{ width: 220 }}>
    <Menu.Item
      key="1"
      icon={
        <UserOutlined
          style={{
            paddingTop: 2,
            paddingRight: 5,
            paddingLeft: 0,
            fontSize: "20px",
            fontWeight:"bold"
          }}
        />
      }
    >
      <Row>
        <Content> {user.name} </Content>
        <Content> {user.email} </Content>
      </Row>
    </Menu.Item>
    <Menu.Item key="2" danger icon={<LogoutOutlined />} onClick={handleLogout}>
      Logout
    </Menu.Item>
  </Menu>
);

    const renderContent = () => {
        switch (selectedKey) {
            case '1':
                return <AdminDashboard />;
            case '2':
                return <Project />;
       
            case '3':
                return <Task />;
            default:
                return <div>Select an option</div>;
        }
    };

    return (
      <Row style={{ background: "#EDF6FF" }}>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            style={{
              background: "#c3cfe2",
            }}
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
                Dash Board
              </Menu.Item>
              <Menu.Item key="2" icon={<ProjectOutlined />}>
                Project
              </Menu.Item>
              <Menu.Item key="3" icon={<ReconciliationOutlined />}>
                Task
              </Menu.Item>
            </Menu>
          </Sider>

          <Layout>
            {/* Header with profile */}
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
                Welcome, {user.name} ➜{" "}
                <span style={{ fontWeight: "normal", color: "#444" }}>
                  {user.role}
                </span>
              </Title>

              <Dropdown
                overlay={profileMenu}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Space style={{ cursor: "pointer" }}>
                  <Avatar src={user.avatarUrl} />
                  <DownOutlined />
                </Space>
              </Dropdown>
            </Header>

            {/* Page Content */}
            <Content
              style={{
                padding: "20px",
                margin: 0,
                overflowY: "auto",
                height: "calc(100vh - 64px)",
                background: "#EDF6FF",
              }}
            >
              {renderContent()}
            </Content>
          </Layout>
        </Layout>
      </Row>
    );
};
export default Home;

