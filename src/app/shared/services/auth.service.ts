import { Injectable } from '@angular/core';
import {
    Auth,
    authState,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from '@angular/fire/auth';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private auth: Auth) {
        this.auth.languageCode = 'en';
    }

    getUserSubscription() {
        return authState(this.auth);
    }

    signInWithGoogle() {
        return signInWithPopup(this.auth, new GoogleAuthProvider());
    }

    signOut() {
        return signOut(this.auth);
    }
}
