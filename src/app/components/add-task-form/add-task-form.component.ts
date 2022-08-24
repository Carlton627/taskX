import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
    selector: 'app-add-task-form',
    templateUrl: './add-task-form.component.html',
    styleUrls: ['./add-task-form.component.scss'],
})
export class AddTaskFormComponent implements OnInit {
    addTaskForm = new FormGroup({
        status: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        setDeadline: new FormControl(''),
        startsOn: new FormControl(''),
        deadline: new FormControl(''),
    });

    constructor(public dataService: DataService) {}

    ngOnInit(): void {}
}
