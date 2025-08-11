import React from "react";
import { Pagination } from "antd";

interface AppPaginationProps {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onChange: (page: number, size: number) => void;
    align?: "left" | "center" | "right";
}

const AppPagination: React.FC<AppPaginationProps> = ({
    currentPage,
    pageSize,
    totalItems,
    onChange,
}) => {
    return (
        <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={onChange}
            onShowSizeChange={onChange}
            style={{ marginTop: 16, textAlign: "right" }}
        />
    );
};

export default AppPagination;
