import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { Task } from 'src/app/shared/models/Task';
import { TaskMetaData } from 'src/app/shared/models/TaskMetaData';
import { taskTypes } from 'src/app/shared/configs/constants';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
    userSubscription: Subscription | undefined;
    todoTasks: Task[] = [];
    inProgressTasks: Task[] = [];
    completedTasks: Task[] = [];

    constructor(
        private afs: FirestoreService,
        private dataService: DataService
    ) {}

    ngOnInit(): void {
        this.afs.getTasksFromFirestore().then((tasks: any) => {
            if (!tasks) return;
            tasks.forEach((task: any) => {
                const taskData = task.data();
                if (taskData.status === taskTypes.TODO_TYPE) {
                    this.todoTasks.push(taskData);
                } else if (taskData.status === taskTypes.INPROGRESS_TYPE) {
                    this.inProgressTasks.push(taskData);
                } else if (taskData.status === taskTypes.COMPLETED_TYPE) {
                    this.completedTasks.push(taskData);
                }
            });
        });
    }

    ngOnDestroy(): void {}

    deleteTaskFromTaskList(taskMetaData: TaskMetaData) {
        const { taskId, taskType } = taskMetaData;
        if (taskType === taskTypes.TODO_TYPE) {
            this.findTaskIndexDelete(this.todoTasks, taskId);
        } else if (taskType === taskTypes.INPROGRESS_TYPE) {
            this.findTaskIndexDelete(this.inProgressTasks, taskId);
        } else if (taskType === taskTypes.COMPLETED_TYPE) {
            this.findTaskIndexDelete(this.completedTasks, taskId);
        }
    }

    private findTaskIndexDelete(taskList: Task[], taskId: string) {
        const index = taskList.findIndex(el => el.id === taskId);
        taskList.splice(index, 1);
    }

    transitionTask(taskMetaData: TaskMetaData) {
        const { taskId, taskType, toTaskType } = taskMetaData;
        const shiftToTask = toTaskType ? toTaskType : '';
        if (taskType === taskTypes.TODO_TYPE) {
            this.findTaskIndexTransition(
                this.todoTasks,
                this.inProgressTasks,
                taskId,
                shiftToTask
            );
        } else if (taskType === taskTypes.INPROGRESS_TYPE) {
            this.findTaskIndexTransition(
                this.inProgressTasks,
                this.completedTasks,
                taskId,
                shiftToTask
            );
        }
    }

    private findTaskIndexTransition(
        taskList: Task[],
        toTaskList: Task[],
        taskId: string,
        toTaskType: string
    ) {
        if (!toTaskType) return;
        const index = taskList.findIndex(el => el.id === taskId);
        const [updatedTask] = taskList.splice(index, 1);
        updatedTask.status = toTaskType;
        toTaskList.push(updatedTask);
    }

    async deleteAllTasks(taskList: Task[]) {
        try {
            await this.afs.deleteAllTasksFromFirestore(taskList);
            taskList = [];
        } catch (error) {
            console.log(error);
        }
    }
}
