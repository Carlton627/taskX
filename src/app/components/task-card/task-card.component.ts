import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { taskTypes, styleConfigs } from 'src/app/shared/configs/constants';
import { TaskMetaData } from 'src/app/shared/models/Task';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { UtilService } from 'src/app/shared/services/util.service';

@Component({
    selector: 'app-task-card',
    templateUrl: './task-card.component.html',
    styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit {
    constructor(private afs: FirestoreService, private util: UtilService) {}

    @Input() task: any;

    @Output() deletedTaskMetaData = new EventEmitter<TaskMetaData>();
    @Output() transistionTaskMetaData = new EventEmitter<TaskMetaData>();

    styleClass: string = '';
    tagClassName: string = '';
    dateMessage: string = '';
    buttonName: string = '';

    private setTaskConfig() {
        if (this.task?.status === taskTypes.TODO_TYPE) {
            this.tagClassName = 'is-warning';
            this.buttonName = 'Mark in progress';
        } else if (this.task?.status === taskTypes.INPROGRESS_TYPE) {
            this.tagClassName = 'is-info';
            this.buttonName = 'Mark completed';
        } else if (this.task?.status === taskTypes.COMPLETED_TYPE) {
            this.tagClassName = 'is-success';
        }
    }

    private getNewTaskType(oldTaskType: string) {
        if (oldTaskType === taskTypes.TODO_TYPE) {
            return taskTypes.INPROGRESS_TYPE;
        }
        return taskTypes.COMPLETED_TYPE;
    }

    ngOnInit(): void {
        this.setTaskConfig();
        if (this.task?.setDeadline) this.setDeadlineMessage();
    }

    async deleteTask(taskId: string, taskType: string) {
        try {
            await this.afs.deleteTaskFromFirestore(taskId);
            this.deletedTaskMetaData.emit({ taskId, taskType });
        } catch (error) {
            console.log(error);
        }
    }

    async transitionTask(taskId: string, taskType: string) {
        try {
            const toTaskType = this.getNewTaskType(taskType);
            await this.afs.updateTaskStatus(taskId, toTaskType);
            this.transistionTaskMetaData.emit({ taskId, taskType, toTaskType });
        } catch (error) {
            console.log(error);
        }
    }

    setDeadlineMessage() {
        const currentDate = this.util.getDateWithMidnightTime();
        const deadline = this.util.getDateWithMidnightTime(
            new Date(this.task?.deadline)
        );
        let startDateCrossed = true;

        if (this.task?.startsOn) {
            const startDate = this.util.getDateWithMidnightTime(
                new Date(this.task?.startsOn)
            );
            if (startDate > currentDate) {
                // task has not yet begun
                const daysLeft = this.util.findDaysLeft(
                    startDate.valueOf() - currentDate.valueOf()
                );
                this.dateMessage =
                    daysLeft > 1
                        ? `Starts in ${daysLeft} days`
                        : 'Starts Tomorrow';
                this.styleClass = styleConfigs.TextInfo;
                startDateCrossed = false;
            }
        }

        if (!startDateCrossed) return; // if start date is not crossed then we dont check for deadline

        if (deadline >= currentDate) {
            const daysLeft = this.util.findDaysLeft(
                deadline.valueOf() - currentDate.valueOf()
            );
            const daysLeftFormatter = new Intl.RelativeTimeFormat('en-us', {
                style: 'long',
            });
            this.dateMessage = daysLeft
                ? `Due ${daysLeftFormatter.format(daysLeft, 'days')}`
                : 'Due Today';
            this.styleClass = styleConfigs.TextSuccess;
        } else {
            this.dateMessage = 'Deadline crossed';
            this.styleClass = styleConfigs.TextError;
        }
    }
}
