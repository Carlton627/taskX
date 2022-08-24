export interface Task {
    id: string;
    author: string;
    createdAt: Date;
    description: string;
    name: string;
    setDeadline: boolean;
    status: string;
}
