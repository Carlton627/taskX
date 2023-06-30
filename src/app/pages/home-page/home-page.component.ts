import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { Task, TaskMetaData, TaskStateModel } from 'src/app/shared/models/Task';
import {
    globalConstants,
    messages,
    taskTypes,
} from 'src/app/shared/configs/constants';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { TaskState } from 'src/app/shared/store/state/task.state';
import { Observable } from 'rxjs';
import { Store, Select } from '@ngxs/store';
import {
    ClearTasks,
    GetTasks,
} from 'src/app/shared/store/actions/task.actions';
import { TaskService } from 'src/app/shared/services/task.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
    tasks: TaskStateModel = {
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
        private toast: ToasterService,
        public taskService: TaskService
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

    private async populateTaskList(categoryFilter = '') {
        this.loadingSpinner = true;
        const saveState = true;
        await this.taskService.getAllTasks(categoryFilter, saveState);
        this.loadingSpinner = false;
    }

    onCategoryChange(category: string) {
        this.activeCategory = category;
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
        type ObjectKey = keyof TaskStateModel;
        const type = taskType as ObjectKey;
        return this.tasks[type];
    }

    async deleteAllTasks(taskStatus: string) {
        try {
            await this.taskService.deleteTasksByStatus(taskStatus);
        } catch (error) {
            console.log(error);
        }
    }

    addNewTaskToList(taskCategory: string) {
        if (taskCategory !== this.activeCategory) {
            this.toast.showInfo(
                messages.toastMessages.taskAddedToCategory + taskCategory
            );
            return;
        }
    }
}
