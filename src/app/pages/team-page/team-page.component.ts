import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/shared/models/Team';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
    selector: 'app-team-page',
    templateUrl: './team-page.component.html',
    styleUrls: ['./team-page.component.scss'],
})
export class TeamPageComponent implements OnInit {
    teamsList: Team[] = [
        {
            name: 'Team 1',
            description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, laborum!',
        },
        {
            name: 'Team 2',
            description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, laborum!',
        },
        {
            name: 'Team 3',
            description:
                'Lorem ipsum dolor sit amet consectetur laborum elit. Eveniet, adipisicing!',
        },
        {
            name: 'Team 4',
            description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, laborum!',
        },
        {
            name: 'Team 5',
            description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, laborum!',
        },
    ];

    teamsIterableCardsList: Array<Team[]> = [];

    constructor(public dataService: DataService) {}

    ngOnInit(): void {
        // populates teamsIterableCardsList
        this.initTeamCardsDisplay();
    }

    initTeamCardsDisplay() {
        let teamSubList: Team[] = [];
        this.teamsList.forEach((team: Team, index: number) => {
            if (index % 3 == 0 && index != 0) {
                this.teamsIterableCardsList.push(teamSubList);
                teamSubList = [];
            }
            teamSubList.push(team);
        });
        this.teamsIterableCardsList.push(teamSubList);
    }
}
