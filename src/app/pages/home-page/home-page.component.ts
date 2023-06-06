import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { Task, TaskMetaData, TaskState } from 'src/app/shared/models/Task';
import {
    globalConstants,
    messages,
    taskTypes,
} from 'src/app/shared/configs/constants';
import { ToasterService } from 'src/app/shared/services/toaster.service';

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
    taskCategories: string[] = ['General'];
    activeCategory: string = globalConstants.DEFAULT_CATEGORY;
    tasksCount = 0;

    constructor(
        private afs: FirestoreService,
        public dataService: DataService,
        private toast: ToasterService
    ) {}

    ngOnInit(): void {
        // INFO: getting task categories
        this.afs.getUser().then(user => {
            const userData = user.data();
            if (userData)
                this.taskCategories = [
                    ...this.taskCategories,
                    ...userData['taskCategories'],
                ];
        });

        // INFO: getting user tasks
        this.populateTaskList();
    }

    ngOnDestroy(): void {}

    private populateTaskList(categoryFilter?: string) {
        this.clearTaskState();
        this.loadingSpinner = true;
        this.activeCategory =
            categoryFilter || globalConstants.DEFAULT_CATEGORY;
        this.afs
            .getTasksFromFirestore(this.activeCategory)
            .then((tasks: any) => {
                this.tasksCount = tasks.size || 0;
                if (!tasks) return;
                tasks.forEach((task: any) => {
                    const taskData = task.data();
                    const taskList = this.filterTaskStateByType(
                        taskData.status
                    );
                    taskList.push(taskData);
                });
                this.loadingSpinner = false;
            });
    }

    private clearTaskState() {
        this.tasks = {
            todo: [],
            inProgress: [],
            completed: [],
        };
    }

    onCategoryChange(category: string) {
        this.populateTaskList(category);
    }

    deleteTaskFromTaskList(taskMetaData: TaskMetaData) {
        const { taskId, taskType } = taskMetaData;
        const taskList = this.filterTaskStateByType(taskType);
        this.findTaskIndexDelete(taskList, taskId);
        this.tasksCount--;
    }

    private findTaskIndexDelete(taskList: Task[], taskId: string) {
        const index = taskList.findIndex(el => el.id === taskId);
        taskList.splice(index, 1);
    }

    transitionTask(taskMetaData: TaskMetaData) {
        const { taskId, taskType, toTaskType } = taskMetaData;
        const shiftToTask = toTaskType ? toTaskType : '';
        if (taskType === taskTypes.TODO_TYPE) {
            this.findTaskIndexTransition(this.tasks.todo, taskId, shiftToTask);
        } else if (taskType === taskTypes.INPROGRESS_TYPE) {
            this.findTaskIndexTransition(
                this.tasks.inProgress,
                taskId,
                shiftToTask
            );
        }
    }

    private findTaskIndexTransition(
        taskList: Task[],
        taskId: string,
        toTaskType: string
    ) {
        if (!toTaskType) return;
        const toTaskList = this.filterTaskStateByType(toTaskType);
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
            this.tasksCount -= taskList.length;
            taskList.splice(0, taskList.length);
        } catch (error) {
            console.log(error);
        }
    }

    addNewTaskToList(task: Task) {
        if (task.category !== this.activeCategory) {
            this.toast.showInfo(
                messages.toastMessages.taskAddedToCategory + task.category
            );
            return;
        }
        const taskList = this.filterTaskStateByType(task.status);
        this.tasksCount++;
        taskList.push(task);
    }
}
