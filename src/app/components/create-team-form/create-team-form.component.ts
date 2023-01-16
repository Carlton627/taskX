import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
    selector: 'app-create-team-form',
    templateUrl: './create-team-form.component.html',
    styleUrls: ['./create-team-form.component.scss'],
})
export class CreateTeamFormComponent implements OnInit {
    createTeamForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl(''),
        members: new FormControl(''),
    });

    constructor(public dataService: DataService) {}

    ngOnInit(): void {}

    async createTeam() {}

    closeForm() {
        this.dataService.showCreateTeamForm = false;
    }

    get name() {
        return this.createTeamForm.get('name');
    }

    get description() {
        return this.createTeamForm.get('description');
    }
}
