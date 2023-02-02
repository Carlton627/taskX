export interface User {
    id: string;
    photoURL: string;
    name: string;
    email: string;
    creationTime: Date;
    taskCategories?: string[];
}
