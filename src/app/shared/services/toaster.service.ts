import { Injectable } from '@angular/core';
import * as bulmaToast from 'bulma-toast';

@Injectable({
    providedIn: 'root',
})
export class ToasterService {
    constructor() {
        bulmaToast.setDefaults({
            position: 'bottom-center',
            opacity: 0.8,
            duration: 3000,
            animate: { in: 'fadeIn', out: 'fadeOut' },
            dismissible: true,
            closeOnClick: true,
            pauseOnHover: true,
        });
    }

    showSuccess(message: string) {
        bulmaToast.toast({
            message,
            type: 'is-success',
        });
    }

    showError(message: string) {
        bulmaToast.toast({
            message,
            type: 'is-danger',
        });
    }

    showInfo(message: string) {
        bulmaToast.toast({
            message,
            type: 'is-link',
        });
    }
}
