import { Component } from '@angular/core';
import { SettingsComponent } from '../settings/settings.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TimerService } from './services/timer.service';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [SettingsComponent, ReactiveFormsModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
export class TimerComponent {

  constructor(private timerService: TimerService) {}

  /* Settings Form Variables */
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

  /* Variables */
  workoutTime: any;
  warmUpTime: number = 0;
  coolDownTime: number = 0;
  exerciseTime: number = 0;
  restTime: number = 0;
  totalExerciseTime: number = 0;
  totalRestTime: number = 0;

  doneSets: number = 0;
  doneCycles: number = 0;
  timer: any = 0;
  auxTimer: any = 0;
  hours: any = '0' + 0;
  minutes: any = '0' + 0;
  seconds:  any = '0' + 0;
  running: boolean = false;
  zeroFlag: boolean = false;
  status: string = 'TIMER'


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
    this.workoutTime = this.timerService.calculateTotalWorkoutTime(
      this.exerciseIntervalMin,
      this.exerciseIntervalSec,
      this.restIntervalMin,
      this.restIntervalSec,
      this.numberOfSets,
      this.numberOfCycles,
      this.warmupIntervalMin,
      this.warmupIntervalSec,
      this.cooldownIntervalMin,
      this.cooldownIntervalSec,
    );
    this.hours = this.workoutTime.hours;
    this.minutes = this.workoutTime.minutes;
    this.seconds = this.workoutTime.seconds;
    this.timer = this.workoutTime.timer;
  }

  caculateTimes() {
    this.warmUpTime = this.warmupIntervalSec +(this.warmupIntervalMin * 60);
    this.coolDownTime = this.cooldownIntervalSec + (this.cooldownIntervalMin * 60);
    this.exerciseTime = this.exerciseIntervalSec + (this.exerciseIntervalMin * 60);
    this.restTime = this.restIntervalSec + (this.restIntervalMin * 60);
    this.totalExerciseTime = this.exerciseTime * this.numberOfCycles * this.numberOfSets
    this.totalRestTime = this.restTime * this.numberOfCycles * this.numberOfSets
  }

  /* **********************************************************
   * ************ FUNCTIONS TO HANDLED THE TIMER **************
   * **********************************************************
   */

  /*
   * Starts the timer.
   */
  start(): void {
    this.status = 'EXERCISE';

    this.exactZeros();

    if (!this.running) {
      this.running = true;
      this.timer = setInterval(() => this.updateTimer(), 1000);
    }
  }

  /**
   * Updates the timer logic based on the current time values.
   */
  updateTimer(): void {
    if (this.zeroFlag) {
      this.decrementMinute();
      this.seconds = 59;
      this.zeroFlag = false;
    } else {
      this.decrementSecond();

      if (this.isTimeUp()) {
        this.stop();
      } else if (this.seconds === '0' + 0) {
        this.handleZeroSeconds();
      }
    }
  }

  /**
   * Decrements the seconds and formats them with leading zeros.
   */
  decrementSecond(): void {
    this.seconds--;
    this.seconds = this.timerService.setZero(this.seconds);
  }

  /**
   * Decrements the minutes and formats them with leading zeros.
   */
  decrementMinute(): void {
    this.minutes--;
    this.minutes = this.timerService.setZero(this.minutes);
  }

  /**
   * Decrements the hours and formats them with leading zeros.
   */
  decrementHour(): void {
    this.hours--;
    this.hours = this.timerService.setZero(this.hours);
  }

  /**
   * Handles the logic when seconds reach zero.
   */
  handleZeroSeconds(): void {
    if (this.hours === '0' + 1 && this.minutes === '0' + 0) {
      this.decrementHour();
      this.minutes = 59;
      this.seconds = 59;
    } else {
      this.decrementMinute();
      this.seconds = 59;
    }
  }

  /*
   * Handles the logic when it's starting with a exact minute.
   */
  exactZeros(): void {
    if (this.minutes > '0' + 1 && this.seconds === '0' + 0) {
      this.zeroFlag = true;
    }
  }

  /**
   * Checks if the timer has reached zero for all time components.
   * @returns {boolean} - True if the timer is up, otherwise false.
   */
  isTimeUp(): boolean {
    return this.seconds === '0' + 0 && this.minutes === '0' + 0 && this.hours === '0' + 0;
  }

  /*
   * Stops the timer when the stop button is clicked or when
   * the times has reached zero.
   */
  stop() {
    this.running = false;
    this.status = 'STOPPED'
    clearInterval(this.timer)
  }

}
