import { User } from './User';

export interface Team {
    name: string;
    description: string;
    createdAt?: Date;
    createdBy?: User;
    members?: User[];
}
