import { Component } from '@angular/core';
import { SettingsComponent } from '../settings/settings.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { time } from 'console';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [SettingsComponent, ReactiveFormsModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
export class TimerComponent {

  warmupIntervalMin: number = 0;
  warmupIntervalSec: number = 0;
  exerciseIntervalMin: number = 0;
  exerciseIntervalSec: number = 0;
  restIntervalMin: number = 0;
  restIntervalSec: number = 0;
  numberOfSets: number = 0;
  numberOfCycles: number = 0;
  cooldownIntervalMin: number = 0;
  cooldownIntervalSec: number = 0;
  timer: number = 0;
  doneSets: number = 0;
  doneCycles: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds:  number = 0;
  clock: string = '00:00:00';

  /* Recieve the Settings Form */
  recieveForm(form: FormGroup) {
    console.log('Output works!\nSets: ',form.value.numberOfSets)
    this.warmupIntervalMin = form.value.warmupIntervalMin;
    this.warmupIntervalSec = form.value.warmupIntervalSec;
    this.exerciseIntervalMin = form.value.exerciseIntervalMin;
    this.exerciseIntervalSec = form.value.exerciseIntervalSec;
    this.restIntervalMin = form.value.restIntervalMin;
    this.restIntervalSec = form.value.restIntervalSec;
    this.numberOfSets = form.value.numberOfSets;
    this.numberOfCycles = form.value.numberOfCycles;
    this.cooldownIntervalMin = form.value.cooldownIntervalMin;
    this.cooldownIntervalSec = form.value.cooldownIntervalSec;
    this.calculateTotalWorkoutTime();
  }

  calculateTotalWorkoutTime() {
    this.timer = 60 * (this.exerciseIntervalMin + this.restIntervalMin);
    this.timer += (this.exerciseIntervalSec + this.restIntervalSec);
    this.timer *= this.numberOfSets;
    this.timer *= this.numberOfCycles;
    this.timer += 60 * (this.warmupIntervalMin + this.cooldownIntervalMin);
    this.timer += this.warmupIntervalSec + this.cooldownIntervalSec;
    console.log('Seconds: ', this.timer)

    this.hours = Math.floor(this.timer / 3600);
    this.minutes = Math.floor((this.timer % 3600) / 60);
    this.seconds = this.timer % 60;
    this.setClock();
  }

  setClock() {
    this.clock = `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;
  }

}
