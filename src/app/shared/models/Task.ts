export interface Task {
    id: string;
    author?: string;
    createdAt?: Date;
    description: string;
    name: string;
    setDeadline: boolean;
    status: string;
    startsOn?: string;
    deadline?: string;
}

export interface TaskMetaData {
    taskId: string;
    taskType: string;
    toTaskType?: string;
}

export interface TaskState {
    todo: Task[];
    inProgress: Task[];
    completed: Task[];
}
