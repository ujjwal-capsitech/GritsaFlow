import React, { useEffect, useState } from "react";
import { Table, message, Card, Row, Typography, Skeleton } from "antd";
import AppPagination from "./AppPagination";
import api from "../api/api";

interface User {
    userId: string;
    name: string;
    userName: string;
}

interface Project {
    projectId: string;
    projectTitle: string;
    employees: { empId: string; empName: string }[];
}

const { Title } = Typography;

const ProjectCard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(3);
    const [totalItems, setTotalItems] = useState(0);

    const fetchUsers = async (page: number, size: number) => {
        try {
            setLoading(true);
            const res = await api.get("User/basic", {
                params: { pageNumber: page, pageSize: size },
            });

            if (res.data && res.data.data) {
                setUsers(res.data.data.items || []);
                setTotalItems(res.data.data.totalItems || 0);
            } else {
                message.error("Invalid data format from server");
            }
            console.log("Projects API Response:", res.data);

        } catch (error) {
            console.error("Error fetching users:", error);
            message.error("Failed to load users");
        } finally {
            setLoading(false);
        }

    };


    const fetchProjects = async () => {
        try {
            const res = await api.get("ProjectControllers"); 
            if (res.data && Array.isArray(res.data.data)) {
                setProjects(res.data.data); 
            } else {
                setProjects([]); 
                console.error("Unexpected project data format", res.data);
                message.error("Data is Emptty");
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
            message.error("Failed to load projects");
        }
    };


    useEffect(() => {
        fetchUsers(currentPage, pageSize);
        fetchProjects();
    }, [currentPage, pageSize]);

    // Maping project empId == userId
    const usersWithProjects = users.map((user) => {
        const userProjects = projects.filter((project) =>
            project.employees?.some((emp) => emp.empId === user.userId)
        );

        return {
            ...user,
            projectTitles: userProjects.map((p) => p.projectTitle).join(", "),
        };
    });

    const columns = [
        {
            title: "User ID",
            dataIndex: "userId",
            key: "userId",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "userName",
            key: "userName",
        },
        {
            title: "Projects",
            dataIndex: "projectTitles",
            key: "projectTitles",
            render: (text: string) => text ||"No projects",
        },
    ];

    return (
        <Card style={{ borderRadius: "14px", padding: "10px", overflow: "auto", height: "382px" }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: "10px" }}>
                <Title level={5} style={{ margin: 0 }}>
                    Employees
                </Title>
            </Row>

            <Table
                columns={columns}
                dataSource={usersWithProjects}
                rowKey="userId"
                bordered
                pagination={false}
                sticky={true}
                locale={{
                    emptyText: loading ? (
                        <Skeleton active paragraph={{ rows: 3 }} />
                    ) : (
                        "No data"
                    ),
                }}
            />

            <AppPagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={totalItems}
                onChange={(page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                }}
            />
        </Card>
    );
};

export default ProjectCard;
