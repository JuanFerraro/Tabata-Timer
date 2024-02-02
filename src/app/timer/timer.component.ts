import { Component } from '@angular/core';
import { SettingsComponent } from '../settings/settings.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TimerService } from './services/timer.service';
import { stat } from 'fs';

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
  auxExerciseTime: number = 0;
  restTime: number = 0;
  auxRestTime: number = 0;
  totalExerciseTime: number = 0;
  totalRestTime: number = 0;
  flagInterval: any = true;
  flagStart: boolean = false;

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

  /*
   * Recieve Settings Form and use the timer Service to calculate
   * the total workout time.
   */
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
    this.flagStart = this.timerService.validWorkoutTime(this.workoutTime.timer);
  }


  /*
   * Calculates the times in seconds to each interval.
   */
  caculateTimes() {
    this.warmUpTime = this.warmupIntervalSec +(this.warmupIntervalMin * 60);
    this.coolDownTime = this.cooldownIntervalSec + (this.cooldownIntervalMin * 60);
    this.exerciseTime = this.exerciseIntervalSec + (this.exerciseIntervalMin * 60);
    this.auxExerciseTime = this.exerciseTime;
    this.restTime = this.restIntervalSec + (this.restIntervalMin * 60);
    this.auxRestTime = this.restTime
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

    this.caculateTimes();
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
    this.warmupInterval();
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

  /* **********************************************************
   * *********** FUNCTIONS TO HANDLED THE STATUS **************
   * **********************************************************
   */

  /**
   * Handles the logic for the warm-up interval, decrementing the warm-up time,
   * and transitioning to the appropriate next interval (exercise, rest, cooldown).
   */
  warmupInterval(): void {
    if (this.warmUpTime > 0) {
      this.status = 'WARMUP';
      this.warmUpTime--;
    } else if (this.flagInterval == true) {
      this.exerciseInterval();
    } else if (this.flagInterval == false) {
      this.restInterval();
    } else if (this.coolDownTime > 0) {
      this.cooldownInterval();
    }
  }

  /**
   * Handles the logic for the cooldown interval, decrementing the cooldown time,
   * and updating the status to 'FINISHED' when cooldown is complete.
   */
  cooldownInterval(): void {
    this.status = 'COOLDOWN';
    this.coolDownTime--;
    if (this.coolDownTime == 0) {
      this.status = 'FINISHED';
      this.flagStart = false;
    }
  }

  /**
   * Handles the logic for the exercise interval, decrementing the total exercise time,
   * and triggering the end of the exercise interval when the auxiliary exercise time is zero.
   */
  exerciseInterval(): void {
    this.status = 'EXERCISE';
    this.totalExerciseTime--;
    this.auxExerciseTime--;
    if (this.auxExerciseTime == 0) {
      this.endExerciseInterval();
    }
  }

  /**
   * Ends the exercise interval by updating the flagInterval and resetting the auxiliary exercise time.
   */
  endExerciseInterval(): void {
    this.flagInterval = false;
    this.auxExerciseTime = this.exerciseTime;
    /* this.restInterval(); */
  }

  /**
   * Handles the logic for the rest interval, decrementing the total rest time,
   * and triggering the end of the rest interval when the auxiliary rest time is zero.
   */
  restInterval(): void {
    this.status = 'REST';
    this.totalRestTime--;
    this.auxRestTime--;
    if (this.auxRestTime == 0) {
      this.endRestInterval();
    }
  }

  /**
   * Ends the rest interval by updating the flagInterval, resetting the auxiliary rest time,
   * incrementing the number of done sets, and checking if all sets are done.
   */
  endRestInterval(): void {
    this.flagInterval = true;
    this.auxRestTime = this.restTime;
    this.doneSets++;
    this.allSetsDone();
  }

  /**
   * Checks if all sets are done and triggers the logic accordingly,
   * incrementing the number of done cycles when all sets are completed.
   */
  allSetsDone(): void {
    if (this.doneSets == this.numberOfSets) {
      this.doneSets = 0;
      this.doneCycles++;
      this.allCyclesDone();
    }
  }

  /**
   * Checks if all cycles are done and updates the status to 'FINISHED'
   * when both sets and cycles are completed, or resets sets for the next cycle.
   */
  allCyclesDone(): void {
    if (this.doneCycles == this.numberOfCycles) {
      this.doneSets = this.numberOfSets;
      this.flagInterval = null;
    }
    if (this.coolDownTime == 0) {
      this.status = 'FINISHED';
      this.flagStart = false;
    }
  }

}
