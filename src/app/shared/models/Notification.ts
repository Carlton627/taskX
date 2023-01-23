export interface Notification {
    id: string;
    invokedBy: string;
    invokedFor: string;
    isActionable: boolean;
    createdAt: Date;
    type: string;
    team?: string;
}
