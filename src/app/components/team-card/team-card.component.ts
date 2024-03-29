import { Component, Input, OnInit } from '@angular/core';
import { Team } from 'src/app/shared/models/Team';

@Component({
    selector: 'app-team-card',
    templateUrl: './team-card.component.html',
    styleUrls: ['./team-card.component.scss'],
})
export class TeamCardComponent implements OnInit {
    @Input() team!: Team;

    constructor() {}

    ngOnInit(): void {}

    // implement navigation to team-detail-page based on id and slug fields
    navigateTo(team: Team) {}
}
