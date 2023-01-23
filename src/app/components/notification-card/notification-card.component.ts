import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { globalConstants } from 'src/app/shared/configs/constants';
import { Notification } from 'src/app/shared/models/Notification';

@Component({
    selector: 'app-notification-card',
    templateUrl: './notification-card.component.html',
    styleUrls: ['./notification-card.component.scss'],
})
export class NotificationCardComponent implements OnInit {
    constructor() {}

    @Input() notification!: Notification;
    @Output() deleteNotification = new EventEmitter<string>();

    notificationText = '';
    showNotificationActions = false;

    ngOnInit(): void {
        if (
            this.notification.type ===
            globalConstants.NotificationTypes.TEAM_INVITE
        ) {
            this.notificationText = `${this.notification.invokedBy} has invited you to join team ${this.notification.team}`;
        } else {
            this.notificationText = `Misc info notification`;
        }
    }

    clearNotification(notificationID: string) {
        this.deleteNotification.emit(notificationID);
    }
}
