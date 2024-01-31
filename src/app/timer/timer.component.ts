import { Component } from '@angular/core';
import { SettingsComponent } from '../settings/settings.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

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
  timer: any = 0;
  doneSets: number = 0;
  doneCycles: number = 0;
  hours: any = '0' + 0;
  minutes: any = '0' + 0;
  seconds:  any = '0' + 0;
  running: boolean = false;
  zeroFlag: boolean = false;


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
    this.hours = this.setZero(this.hours)
    this.minutes = this.setZero(this.minutes)
    this.seconds = this.setZero(this.seconds)
  }

  setZero(x: any) {
    if (x < 10) {
      return '0' + x;
    }
    return x;
  }

  start() {

    if(this.minutes > '0' + 1 && this.seconds === '0' + 0){
      this.zeroFlag = true
    }

    if(!this.running) {
      this.running = true;
      this.timer = setInterval(() => {
        if (this.zeroFlag == true) {
          this.minutes--;
          this.minutes = this.setZero(this.minutes);
          this.seconds = 59;
          this.zeroFlag = false;
        } else {
          this.seconds--;
          this.seconds = this.setZero(this.seconds);

          if (this.seconds === '0' + 0 && this.minutes === '0' + 0 && this.hours === '0' + 0){
            this.stop();
          } else if(this.seconds === '0' + 0 ) {

            if(this.hours === '0' + 1 && this.minutes === '0' + 0 ) {
              this.hours--;
              this.hours = this.setZero(this.hours);
              this.minutes = 59
              this.seconds = 59
            } else {
              this.minutes--;
              this.minutes = this.setZero(this.minutes);
              this.seconds = 59;
            }
          };
        }

      }, 1000);
    }
  }

  stop() {
    clearInterval(this.timer)
  }

}
