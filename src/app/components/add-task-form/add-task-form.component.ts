import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    taskTypes,
    errors,
    globalConstants,
} from 'src/app/shared/configs/constants';
import { Task } from 'src/app/shared/models/Task';
import { DataService } from 'src/app/shared/services/data.service';
import { TaskService } from 'src/app/shared/services/task.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-add-task-form',
    templateUrl: './add-task-form.component.html',
    styleUrls: ['./add-task-form.component.scss'],
})
export class AddTaskFormComponent implements OnInit {
    constructor(
        public dataService: DataService,
        private taskService: TaskService,
        private util: UtilService
    ) {}

    @Input() taskCategories!: string[];
    @Input() activeCategory!: string;
    @Output() taskAdded = new EventEmitter<string>();

    enableDates = false;
    dateErrors = errors.dateInputErrors;
    dateInvalidChecks = {
        startDateCurrentDate: false,
        startDateDeadline: true,
        deadlineCurrentDate: false,
        deadlineStartDate: true,
    };
    datesValid = true;
    isAddTaskComplete = true;

    addTaskForm!: FormGroup;

    ngOnInit(): void {
        this.buildTaskForm();
        const getDeadlineFormField = this.addTaskForm.get('deadline');
        const getStartsOnFormField = this.addTaskForm.get('startsOn');
        this.addTaskForm
            .get('setDeadline')
            ?.valueChanges.subscribe((value: any) => {
                this.enableDates = value;
                if (value) {
                    getDeadlineFormField?.setValidators([Validators.required]);
                    this.datesValid = false;
                } else {
                    getDeadlineFormField?.clearValidators();
                    getStartsOnFormField?.clearValidators();
                    getDeadlineFormField?.reset();
                    getStartsOnFormField?.reset();
                }
                getDeadlineFormField?.updateValueAndValidity();
                getStartsOnFormField?.updateValueAndValidity();
            });

        // TODO: Refactor code to follow DRY
        this.addTaskForm.get('deadline')?.valueChanges.subscribe(value => {
            const selectedDate = this.util.getDateWithMidnightTime(
                new Date(value ? value : '')
            );

            const currentDate = this.util.getDateWithMidnightTime();

            if (selectedDate < currentDate) {
                this.dateInvalidChecks.deadlineCurrentDate = false;
            } else {
                this.dateInvalidChecks.deadlineCurrentDate = true;
            }

            if (getStartsOnFormField?.value) {
                if (
                    selectedDate <
                    this.util.getDateWithMidnightTime(
                        new Date(getStartsOnFormField.value)
                    )
                ) {
                    this.dateInvalidChecks.deadlineStartDate = false;
                } else {
                    this.dateInvalidChecks.deadlineStartDate = true;
                    this.dateInvalidChecks.startDateDeadline = true;
                }
            }

            this.datesValid = this.checkDatesValid();
        });

        //TODO: Refactor code to follow DRY
        this.addTaskForm.get('startsOn')?.valueChanges.subscribe(value => {
            const selectedDate = this.util.getDateWithMidnightTime(
                new Date(value ? value : '')
            );

            const currentDate = this.util.getDateWithMidnightTime();

            if (selectedDate < currentDate) {
                this.dateInvalidChecks.startDateCurrentDate = false;
            } else {
                this.dateInvalidChecks.startDateCurrentDate = true;
            }

            if (getDeadlineFormField?.value) {
                if (
                    selectedDate >
                    this.util.getDateWithMidnightTime(
                        new Date(getDeadlineFormField.value)
                    )
                ) {
                    this.dateInvalidChecks.startDateDeadline = false;
                } else {
                    this.dateInvalidChecks.startDateDeadline = true;
                    this.dateInvalidChecks.deadlineStartDate = true;
                }
            }

            this.datesValid = this.checkDatesValid();
        });
    }

    private buildTaskForm() {
        this.addTaskForm = new FormGroup({
            status: new FormControl(taskTypes.TODO_TYPE, [Validators.required]),
            name: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            setDeadline: new FormControl(false),
            startsOn: new FormControl(''),
            deadline: new FormControl(''),
            category: new FormControl(this.activeCategory, [
                Validators.required,
            ]),
        });
    }

    private checkDatesValid() {
        if (!this.dateInvalidChecks.startDateDeadline) return false;
        if (!this.dateInvalidChecks.startDateCurrentDate) return false;
        if (!this.dateInvalidChecks.deadlineCurrentDate) return false;
        if (!this.dateInvalidChecks.deadlineStartDate) return false;
        return true;
    }

    private createSlug(task: Task) {
        const slugArr = task.name
            .toLowerCase()
            .split(' ')
            .filter((fragment: string) => fragment.match(/^[a-z0-9]+$/i));
        return `${slugArr.join('-')}-${task.id.split('-')[0]}`;
    }

    async addTask() {
        const newTask: Task = {
            name: this.addTaskForm.value.name || '',
            id: uuidv4(),
            description: this.addTaskForm.value.description || '',
            setDeadline: this.addTaskForm.value.setDeadline || false,
            status: this.addTaskForm.value.status || taskTypes.TODO_TYPE,
            category:
                this.addTaskForm.value.category ||
                globalConstants.DEFAULT_CATEGORY,
        };

        if (newTask.setDeadline) {
            newTask.startsOn = this.addTaskForm.value.startsOn || '';
            newTask.deadline = this.addTaskForm.value.deadline || '';
        }

        // TODO: Throw error here for data that is not proper
        if (!this.datesValid || !newTask.name || !newTask.description) return;

        // Assign a slug to the task
        newTask.slug = this.createSlug(newTask);

        try {
            // disable submit button
            this.isAddTaskComplete = false;
            this.taskAdded.emit(newTask.category);

            const saveState = this.activeCategory === newTask.category;

            await this.taskService.addNewTask(newTask, saveState);
            setTimeout(() => {
                this.addTaskForm.reset();
                this.dataService.showAddTaskForm = false;
                // enable submit button
                this.isAddTaskComplete = true;
            }, 1000);
        } catch (err) {
            console.error(err);
            // enable submit button
            this.isAddTaskComplete = true;
        }
    }

    closeForm() {
        this.dataService.showAddTaskForm = false;
    }

    get status() {
        return this.addTaskForm.get('status');
    }

    get name() {
        return this.addTaskForm.get('name');
    }

    get description() {
        return this.addTaskForm.get('description');
    }

    get startsOn() {
        return this.addTaskForm.get('startsOn');
    }

    get deadline() {
        return this.addTaskForm.get('deadline');
    }

    get category() {
        return this.addTaskForm.get('category');
    }
}
