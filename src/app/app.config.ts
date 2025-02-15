import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CatsComponent } from './cats/cats.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      [
        { path: '', component: HomeComponent }, // Default route (Home)
        { path: 'cats', component: CatsComponent },
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent },
      ],
      withComponentInputBinding()
    ),
  ],
};
