import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
        private router: Router
    ) {}

    ngOnInit(): void {
        this.userSubscription = this.auth
            .getUserSubscription()
            .subscribe((user: any) => {
                this.user = this.dataService.getUserData(user);
            });
    }

    ngOnDestroy(): void {
        this.userSubscription?.unsubscribe();
    }

    async checkExistingUsers(credential: any) {
        const userDocSnap = await this.afs.getDocumentById(
            'users',
            credential?.user?.uid
        );
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
