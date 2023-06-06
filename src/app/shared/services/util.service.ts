import { Injectable } from '@angular/core';

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
}
