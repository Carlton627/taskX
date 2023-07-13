import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { TaskStateModel } from 'src/app/shared/models/Task';
import { globalConstants, messages } from 'src/app/shared/configs/constants';
import { ToasterService } from 'src/app/shared/services/toaster.service';
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
