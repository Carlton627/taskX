import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// Components
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { TaskCardComponent } from './components/task-card/task-card.component';
import { AddTaskFormComponent } from './components/add-task-form/add-task-form.component';
import { TaskDetailPageComponent } from './pages/task-detail-page/task-detail-page.component';
import { TeamPageComponent } from './pages/team-page/team-page.component';
import { TeamCardComponent } from './components/team-card/team-card.component';
import { CreateTeamFormComponent } from './components/create-team-form/create-team-form.component';
import { NotificationCardComponent } from './components/notification-card/notification-card.component';
import { TaskCategorySelectorComponent } from './components/task-category-selector/task-category-selector.component';

@NgModule({
    declarations: [
        AppComponent,
        LandingPageComponent,
        HomePageComponent,
        NavbarComponent,
        FooterComponent,
        TaskCardComponent,
        AddTaskFormComponent,
        TaskDetailPageComponent,
        TeamPageComponent,
        TeamCardComponent,
        CreateTeamFormComponent,
        NotificationCardComponent,
        TaskCategorySelectorComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
