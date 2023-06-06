import { Component, Input, OnInit } from '@angular/core';
import { globalConstants } from 'src/app/shared/configs/constants';
import { AppModalService } from 'src/app/shared/services/app-modal.service';

@Component({
    selector: 'app-modal',
    templateUrl: './app-modal.component.html',
    styleUrls: ['./app-modal.component.scss'],
})
export class AppModalComponent implements OnInit {
    constructor(public modalService: AppModalService) {}

    @Input() modalTitle = 'Warning';
    @Input() modalMessage = '';

    MODAL_TYPES = globalConstants.ModalTypes;

    ngOnInit(): void {}
}
