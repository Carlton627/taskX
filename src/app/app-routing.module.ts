import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    AuthGuard,
    redirectLoggedInTo,
    redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

const redirectUnauthorizedToLandingPage = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
    {
        path: '',
        component: LandingPageComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectLoggedInToHome },
    },
    {
        path: 'home',
        component: HomePageComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLandingPage },
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
