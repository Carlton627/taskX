import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AppModalService {
    constructor() {}

    modalActive = false;
    modalType = '';
    private action = new Subject<number>();
    private selectedOption = new Subject<number>();

    showModal(modalType: string) {
        this.modalActive = true;
        this.modalType = modalType;
    }

    closeModal() {
        this.modalActive = false;
        this.modalType = '';
    }

    sendAction(action: number) {
        this.action.next(action);
    }

    getAction(): Observable<number> {
        return this.action.asObservable();
    }

    sendOption(option: number) {
        this.selectedOption.next(option);
    }

    getOption(): Observable<number> {
        return this.selectedOption.asObservable();
    }
}
