export interface TaskReport {
    name: string;
    value: number;
}

export interface Project {
    projectId: string;
    projectTitle: string;
}

export interface ProjectReport {
    statusReport: TaskReport[];
    priorityReport: TaskReport[];
}

export interface ApiResponse<T> {
    data: T;
    status: boolean;
    message?: string;
}
