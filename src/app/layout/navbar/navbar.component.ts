import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { globalConstants } from 'src/app/shared/configs/constants';
import { NavMenuItem } from 'src/app/shared/models/Menus';
import { Notification } from 'src/app/shared/models/Notification';
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

    user: User | undefined;
    userSubscription!: Subscription;
    activeNavMenuItem = '';
    addTaskMode = true;
    isSignInCompleteAfterClick = true;
    notificationCount = 0; // TODO: replace with correct count
    notificationHintText: string = '';
    toggleNotificationTray = false;

    notifications: Notification[] = [
        {
            id: '1',
            invokedBy: 'Switzel Fernandes',
            invokedFor: 'Carlton Rodrigues',
            createdAt: new Date(),
            isActionable: true,
            type: globalConstants.NotificationTypes.TEAM_INVITE,
            team: 'Whackers',
        },
        {
            id: '2',
            invokedBy: 'system',
            invokedFor: 'Carlton Rodrigues',
            createdAt: new Date(),
            isActionable: false,
            type: globalConstants.NotificationTypes.INFO,
        },
    ];

    ngOnInit(): void {
        // INFO: Gets currently signed in user
        this.userSubscription = this.auth
            .getUserSubscription()
            .subscribe((user: any) => {
                this.user = this.dataService.getUserData(user);
            });

        // INFO: Get current route path
        const path = this.location.path() ? this.location.path() : '/home';
        const [currentMenuItem] = this.appOptionsMenu.filter(
            (appOption: NavMenuItem) => {
                return appOption.route === path;
            }
        );

        // TODO: Load notifications in notifications array and then call other methods

        this.setNotificationCount();
        this.setNotificationHintText();
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

    private setNotificationCount() {
        this.notificationCount = this.notifications.length;
    }

    private setNotificationHintText() {
        if (!this.notificationCount) {
            this.notificationHintText = 'No new notifications';
            return;
        }
        this.notificationHintText = `You have ${
            this.notificationCount > 1
                ? this.notificationCount + ' new notifications'
                : 'a new notification'
        } `;
    }

    deleteNotification(id: string) {
        const notfIndex = this.notifications.findIndex(
            (notf: Notification) => notf.id === id
        );
        this.notifications.splice(notfIndex, 1);
    }

    // TODO: refactor this function to follow generics and place it in util service, if required
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
            this.isSignInCompleteAfterClick = false;
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
        } finally {
            this.isSignInCompleteAfterClick = true;
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
