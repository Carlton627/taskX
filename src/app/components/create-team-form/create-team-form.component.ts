import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, Subject } from 'rxjs';
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
        members: new FormControl('', [Validators.required]),
    });

    membersInputTextChanged = new Subject<string>();

    constructor(public dataService: DataService) {}

    ngOnInit(): void {}

    onUserInputChange(inputText: string) {
        if (this.membersInputTextChanged.observed)
            return this.membersInputTextChanged.next(inputText);

        this.membersInputTextChanged
            .pipe(debounceTime(1000), distinctUntilChanged())
            .subscribe((inputQuery: string) => {
                this.suggestUsers(inputQuery);
            });
    }

    // INFO: This function is being debounced in onUserInputChange
    async suggestUsers(inputQuery: string) {
        if (!inputQuery) return;
        console.log(inputQuery);
    }

    async createTeam() {
        const { name, description, members } = this.createTeamForm.value;
        console.log(name, description, members);
    }

    closeForm() {
        this.dataService.showCreateTeamForm = false;
    }

    get name() {
        return this.createTeamForm.get('name');
    }

    get description() {
        return this.createTeamForm.get('description');
    }

    get members() {
        return this.createTeamForm.get('members');
    }
}
