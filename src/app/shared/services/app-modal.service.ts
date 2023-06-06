import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AppModalService {
    constructor() {}

    modalActive = false;
    modalType = '';
    private action = new Subject<any>();

    showModal(modalType: string) {
        this.modalActive = true;
        this.modalType = modalType;
    }

    closeModal() {
        this.modalActive = false;
        this.modalType = '';
    }

    sendAction(action: any) {
        this.action.next(action);
    }

    getAction(): Observable<any> {
        return this.action.asObservable();
    }
}
