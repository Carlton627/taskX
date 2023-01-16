import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { NavMenuItem } from 'src/app/shared/models/Menus';
import { User } from 'src/app/shared/models/User';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
    user: User | undefined;
    userSubscription: Subscription | undefined;

    constructor(
        private auth: AuthService,
        private afs: FirestoreService,
        public dataService: DataService,
        private router: Router,
        private location: Location
    ) {}

    appOptionsMenu: NavMenuItem[] = [
        { name: 'Your Tasks', isActive: false, route: '/home' },
        { name: 'Teams', isActive: false, route: '/teams' },
    ];

    activeNavMenuItem = '';
    addTaskMode = true;

    ngOnInit(): void {
        this.userSubscription = this.auth
            .getUserSubscription()
            .subscribe((user: any) => {
                this.user = this.dataService.getUserData(user);
            });

        const path = this.location.path() ? this.location.path() : '/home';
        const [currentMenuItem] = this.appOptionsMenu.filter(
            (appOption: NavMenuItem) => {
                return appOption.route === path;
            }
        );
        this.checkAppMode(path);
        this.menuItemSelectEvent(currentMenuItem);
    }

    ngOnDestroy(): void {
        this.userSubscription?.unsubscribe();
    }

    // Edit this function to add more app modes
    private checkAppMode(path: string) {
        this.addTaskMode = path === '/teams' ? false : true;
    }

    // TODO: refactor this function to follow generics and place it in util service
    menuItemSelectEvent(menuOption: NavMenuItem, navigate = false) {
        // Guard Clause: if menu option isActive is true then do nothing
        if (menuOption.isActive) return;

        // Check all options for isActive property and only turn the selected one to true and previously active one to false
        this.appOptionsMenu.forEach((appOption: NavMenuItem) => {
            if (appOption.isActive) appOption.isActive = false;
            if (!appOption.isActive && appOption.name === menuOption.name)
                appOption.isActive = true;
        });

        // set the nav menu name
        this.activeNavMenuItem = menuOption.name;

        // checking whether New Task button or Create Team button needs to be displayed
        this.checkAppMode(menuOption.route);

        // if navigate param is true then navigate
        if (navigate) this.router.navigateByUrl(menuOption.route);
    }

    async checkExistingUsers(credential: any) {
        const userDocSnap = await this.afs.getUserById(credential?.user?.uid);
        return userDocSnap.exists();
    }

    async googleSignIn() {
        try {
            const credential = await this.auth.signInWithGoogle();
            if (await this.checkExistingUsers(credential)) {
                this.router.navigateByUrl('/home');
            } else {
                await this.afs.addUserToFirestore(
                    credential?.user?.uid,
                    this.dataService.getUserData(credential.user)
                );
                this.router.navigateByUrl('/home');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async signOut() {
        try {
            await this.auth.signOut();
            this.router.navigateByUrl('/');
        } catch (error) {
            console.log(error);
        }
    }
}
