import { User } from './User';

export interface Team {
    name: string;
    description: string;
    photoURL?: string;
    createdAt?: Date;
    createdBy?: User;
    members?: User[];
}

// Each Team document will have a subcollection in it for the members
