import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { taskTypes, errors } from 'src/app/shared/configs/constants';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
    selector: 'app-add-task-form',
    templateUrl: './add-task-form.component.html',
    styleUrls: ['./add-task-form.component.scss'],
})
export class AddTaskFormComponent implements OnInit {
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

    constructor(public dataService: DataService) {}

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

        this.addTaskForm.get('deadline')?.valueChanges.subscribe(value => {
            const selectedDate = this.getDateWithMidnightTime(
                new Date(value ? value : '')
            );

            const currentDate = this.getDateWithMidnightTime();

            if (selectedDate < currentDate) {
                this.dateInvalidChecks.deadlineCurrentDate = false;
            } else {
                this.dateInvalidChecks.deadlineCurrentDate = true;
            }

            if (getStartsOnFormField?.value) {
                if (
                    selectedDate <
                    this.getDateWithMidnightTime(
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

        this.addTaskForm.get('startsOn')?.valueChanges.subscribe(value => {
            const selectedDate = this.getDateWithMidnightTime(
                new Date(value ? value : '')
            );

            const currentDate = this.getDateWithMidnightTime();

            if (selectedDate < currentDate) {
                this.dateInvalidChecks.startDateCurrentDate = false;
            } else {
                this.dateInvalidChecks.startDateCurrentDate = true;
            }

            if (getDeadlineFormField?.value) {
                if (
                    selectedDate >
                    this.getDateWithMidnightTime(
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

    addTask() {
        const { status, name, description, setDeadline, startsOn, deadline } =
            this.addTaskForm.value;
        console.log(status, name, description, setDeadline, startsOn, deadline);
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

    getDateWithMidnightTime(date = new Date(), hours = 0) {
        return new Date(date.setHours(hours, 0, 0, 0));
    }
}
