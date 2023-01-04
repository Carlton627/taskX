import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { Task, TaskMetaData, TaskState } from 'src/app/shared/models/Task';
import { taskTypes } from 'src/app/shared/configs/constants';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
    tasks: TaskState = {
        todo: [],
        inProgress: [],
        completed: [],
    };
    loadingSpinner = true;

    constructor(
        private afs: FirestoreService,
        public dataService: DataService
    ) {}

    ngOnInit(): void {
        this.afs.getTasksFromFirestore().then((tasks: any) => {
            if (!tasks) return;
            tasks.forEach((task: any) => {
                const taskData = task.data();
                const taskList = this.filterTaskStateByType(taskData.status);
                taskList.push(taskData);
            });
            this.loadingSpinner = false;
        });
    }

    ngOnDestroy(): void {}

    deleteTaskFromTaskList(taskMetaData: TaskMetaData) {
        const { taskId, taskType } = taskMetaData;
        const taskList = this.filterTaskStateByType(taskType);
        this.findTaskIndexDelete(taskList, taskId);
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
                this.tasks.todo,
                this.tasks.inProgress,
                taskId,
                shiftToTask
            );
        } else if (taskType === taskTypes.INPROGRESS_TYPE) {
            this.findTaskIndexTransition(
                this.tasks.inProgress,
                this.tasks.completed,
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

    private filterTaskStateByType(taskType: string) {
        type ObjectKey = keyof TaskState;
        const type = taskType as ObjectKey;
        return this.tasks[type];
    }

    async deleteAllTasks(taskList: Task[]) {
        try {
            await this.afs.deleteAllTasksFromFirestore(taskList);
            taskList.splice(0, taskList.length);
        } catch (error) {
            console.log(error);
        }
    }

    addNewTaskToList(task: Task) {
        const taskList = this.filterTaskStateByType(task.status);
        taskList.push(task);
    }
}
