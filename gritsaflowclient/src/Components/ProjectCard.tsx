import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Card,
  Row,
  Col,
  Typography,
  Skeleton,
  Select,
  Button,
  Tag,
} from "antd";
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
  employees?: Array<{
    empId: string;
    empName: string;
  }>;
}

interface ProjectEmployee {
  empId: string;
  empName: string;
}

const { Title } = Typography;
const { Option } = Select;

const ProjectCard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [filteredEmployees, setFilteredEmployees] = useState<ProjectEmployee[]>(
    []
  );
  const [userProjectsMap, setUserProjectsMap] = useState<
    Record<string, string[]>
  >({});

  const fetchUsers = async (page: number, size: number) => {
    try {
      setLoading(true);
      const res = await api.get("User/basic", {
        params: { pageNumber: page, pageSize: size },
      });

      if (res.data?.data) {
        setUsers(res.data.data.items || []);
        setTotalItems(res.data.data.totalItems || 0);
      } else {
        message.error("Invalid data format from server");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setProjectLoading(true);
      const res = await api.get("ProjectControllers");
      if (res.data?.data) {
        const projectsData = res.data.data.map((p: any) => ({
          projectId: p.projectId,
          projectTitle: p.projectTitle,
          employees: p.employees || [],
        }));

        setProjects(projectsData);

        // Create a mapping of user IDs to project titles
        const mapping: Record<string, string[]> = {};
        projectsData.forEach((project: Project) => {
          if (project.employees) {
            project.employees.forEach((emp) => {
              if (!mapping[emp.empId]) {
                mapping[emp.empId] = [];
              }
              mapping[emp.empId].push(project.projectTitle);
            });
          }
        });

        setUserProjectsMap(mapping);
      } else {
        setProjects([]);
        message.warning("No projects available");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      message.error("Failed to load projects");
    } finally {
      setProjectLoading(false);
    }
  };

  const fetchEmployeesByProject = async (projectId: string) => {
    try {
      setLoading(true);
      const res = await api.get(`ProjectControllers/${projectId}/employees`);
      if (res.data?.data) {
        setFilteredEmployees(res.data.data);
      } else {
        setFilteredEmployees([]);
        message.warning("No employees found for this project");
      }
    } catch (error) {
      console.error("Error fetching project employees:", error);
      message.error("Failed to load project employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, pageSize);
    fetchProjects();
  }, [currentPage, pageSize]);

  // Handle project filter change
  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    fetchEmployeesByProject(value);
  };

  // Clear project filter
  const clearFilter = () => {
    setSelectedProject(null);
    setFilteredEmployees([]);
  };

  // Prepare data for table
  const getTableData = () => {
    if (selectedProject && filteredEmployees.length > 0) {
      return filteredEmployees.map((emp) => ({
        key: emp.empId,
        userId: emp.empId,
        name: emp.empName,
        // userName: users.find((u) => u.userId === emp.empId)?.userName || "N/A",
        projectTitles:
          projects.find((p) => p.projectId === selectedProject)?.projectTitle ||
          "N/A",
      }));
    }

    return users.map((user) => ({
      key: user.userId,
      userId: user.userId,
      name: user.name,
      userName: user.userName,
      projectTitles: userProjectsMap[user.userId]
        ? userProjectsMap[user.userId].join(", ")
        : "No projects assigned",
    }));
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      responsive: ["sm"],
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    
    {
      title: "Projects",
      dataIndex: "projectTitles",
      key: "projectTitles",
      render: (text: string, record: any) => {
        if (selectedProject) {
          return <Tag color="blue">{text}</Tag>;
        }

        if (text === "No projects assigned") {
          return <span style={{ color: "#999" }}>{text}</span>;
        }

        return (
          <div>
            {text.split(", ").map((project, index) => (
              <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                {project}
              </Tag>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <Card style={{ borderRadius: "14px", padding: "10px" }}>
      <Row
        justify="space-between"
        align="middle"
        gutter={[16, 16]}
        style={{ marginBottom: 16 }}
      >
        <Col>
          <Title level={5} style={{ margin: 0 }}>
            Employees
          </Title>
        </Col>

        <Col>
          <Row gutter={8}>
            <Col>
              <Select
                placeholder="Filter by project"
                style={{ width: 200 }}
                onChange={handleProjectChange}
                value={selectedProject}
                loading={projectLoading}
                allowClear
                onClear={clearFilter}
              >
                {projects.map((project) => (
                  <Option key={project.projectId} value={project.projectId}>
                    {project.projectTitle}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Button onClick={clearFilter} disabled={!selectedProject}>
                Clear Filter
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <Table
        columns = {columns}
        dataSource={getTableData()}
        rowKey="key"
        bordered
        pagination={false}
        loading={loading}
        scroll={{ x: true }}
        locale={{
          emptyText: loading ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : (
            "No data available"
          ),
        }}
      />

      {!selectedProject && (
        <AppPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
        />
      )}
    </Card>
  );
};

export default ProjectCard;
