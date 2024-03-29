import { Injectable } from '@angular/core';
import { TaskStateModel } from '../models/Task';
import { taskTypes } from '../configs/constants';

@Injectable({
    providedIn: 'root',
})
export class UtilService {
    constructor() {}

    getDateWithMidnightTime(date = new Date(), hours = 0) {
        return new Date(date.setHours(hours, 0, 0, 0));
    }

    findDaysLeft(dateDiff: number) {
        return Math.ceil(dateDiff / (1000 * 3600 * 24));
    }

    getElementIndex<T>(arr: T[], findElement: T) {
        return arr.findIndex((element: T) => element === findElement);
    }

    filterTaskStateByType(taskType: string): keyof TaskStateModel {
        type ObjectKey = keyof TaskStateModel;
        const type = taskType as ObjectKey;
        return type;
    }

    getNewTaskType(oldTaskType: string) {
        if (oldTaskType === taskTypes.TODO_TYPE) {
            return taskTypes.INPROGRESS_TYPE;
        }
        return taskTypes.COMPLETED_TYPE;
    }
}
