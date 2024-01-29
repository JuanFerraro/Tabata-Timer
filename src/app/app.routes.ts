import { Routes } from '@angular/router';
import { TimerComponent } from './timer/timer.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
  { path: 'timer', component: TimerComponent },
  { path: 'contact', component: ContactComponent },
];
