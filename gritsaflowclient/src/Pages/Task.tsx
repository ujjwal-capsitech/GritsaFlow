import React, { useState } from "react";
import { Button, Col, Modal } from "antd";
import CreateTask from "../Components/CreateTask";
import TaskTable from "../Components/TaskTable";

const TasksPage: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <Col>
           
            <TaskTable />

            <Modal
                title="Create New Task"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                destroyOnClose
                width={600}
            >
                <CreateTask
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                />
            </Modal>
        </Col>
    );
};

export default TasksPage;