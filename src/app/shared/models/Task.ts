export interface Task {
    id: string;
    author?: string;
    createdAt?: Date;
    description: string;
    name: string;
    setDeadline: boolean;
    status: string;
    category: string;
    startsOn?: string;
    deadline?: string;
    slug?: string;
    assignee?: string;
}

export interface TaskMetaData {
    taskId: string;
    taskType: string;
    toTaskType?: string;
}

export interface TaskStateModel {
    todo: Task[];
    inProgress: Task[];
    completed: Task[];
}
