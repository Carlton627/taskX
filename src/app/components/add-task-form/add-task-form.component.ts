import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { taskTypes, errors } from 'src/app/shared/configs/constants';
import { Task } from 'src/app/shared/models/Task';
import { DataService } from 'src/app/shared/services/data.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-add-task-form',
    templateUrl: './add-task-form.component.html',
    styleUrls: ['./add-task-form.component.scss'],
})
export class AddTaskFormComponent implements OnInit {
    @Output() taskAdded: EventEmitter<Task> = new EventEmitter();

    enableDates = false;
    dateErrors = errors.dateInputErrors;
    dateInvalidChecks = {
        startDateCurrentDate: false,
        startDateDeadline: true,
        deadlineCurrentDate: false,
        deadlineStartDate: true,
    };
    datesValid = true;

    addTaskForm = new FormGroup({
        status: new FormControl(taskTypes.TODO_TYPE, [Validators.required]),
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        setDeadline: new FormControl(false),
        startsOn: new FormControl(''),
        deadline: new FormControl(''),
    });

    constructor(
        public dataService: DataService,
        private afs: FirestoreService,
        private util: UtilService
    ) {}

    ngOnInit(): void {
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
            await this.afs.addTaskToFirestore(newTask);
            this.taskAdded.emit(newTask);
            setTimeout(() => {
                this.dataService.showAddTaskForm = false;
            }, 1500);
        } catch (err) {
            console.error(err);
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
}
