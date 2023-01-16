import { Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    userData: User | undefined;
    showAddTaskForm = false;
    showCreateTeamForm = false;

    constructor() {}

    getUserData(user: any) {
        if (!user) return undefined;
        this.userData = {
            id: user?.uid,
            photoURL: user?.photoURL,
            firstName: user?.displayName.split(' ')[0],
            email: user?.email,
            creationTime: user?.metadata?.creationTime,
        };
        return this.userData;
    }
}
