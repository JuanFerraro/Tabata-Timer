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

  /* Variables */                     /* Descriptions: */
  workoutTime: any;                   /* ->Keep the total workout time, (Hours, Minutes, Secons and Timer[All in seconds]) */
  warmUpTime: number = 0;             /* ->Total warmup time in seconds*/
  auxWarmUpTime: number = 0;          /* ->wamrUpTime's auxiliary*/
  coolDownTime: number = 0;           /* ->Total cooldown time in seconds */
  auxCoolDownTime: number = 0;        /* ->coolDownTime's auxiliary */
  exerciseTime: number = 0;           /* ->Exercise Interval in seconds */
  auxExerciseTime: number = 0;        /* ->ExerciseTime's auxiliary  */
  restTime: number = 0;               /* ->Rest interval in seconds */
  auxRestTime: number = 0;            /* ->restTime's auxiliary */
  totalExerciseTime: number = 0;      /* ->Total exercise time in seconds */
  totalRestTime: number = 0;          /* ->Total rest time in seconds */
  flagInterval: any = true;           /* ->Manage rest and exercise intervals and status */
  flagStart: boolean = false;         /* ->Validate the correct starting of the timer */
  statusColor = '';                   /* ->String to use as a CSS class in the timer and status */

  doneSets: number = 0;               /* ->Number of Sets done */
  doneCycles: number = 0;             /* ->Number of Cycles done */
  timer: any = 0;                     /* ->Total time in seconds */
  hours: any = '0' + 0;               /* ->Shows the hours on screen */
  minutes: any = '0' + 0;             /* ->Shows the minutes on screen */
  seconds:  any = '0' + 0;            /* ->Shows the seconds on screen */
  running: boolean = false;
  zeroFlag: boolean = false;          /* ->Validate if the timer starts at #:00 */
  status: string = 'TIMER'            /* Shows status on screen */

  /*
   * Recieve Settings Form and use the timer Service to calculate
   * the total workout time.
   */
  recieveForm(form: FormGroup) {
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
    this.caculateTimes();
    this.exactZeros();
  }

  /*
   * Reset all the variables used in the timer.
   */
  resetAll(x: boolean) {
    if (x) {
      clearInterval(this.timer);
      this.workoutTime;
      this.warmUpTime = 0;
      this.coolDownTime = 0;
      this.exerciseTime = 0;
      this.auxExerciseTime = 0;
      this.restTime = 0;
      this.auxRestTime = 0;
      this.totalExerciseTime = 0;
      this.totalRestTime = 0;
      this.flagInterval = true;
      this.flagStart = false;
      this.statusColor = '';

      this.doneSets = 0;
      this.doneCycles = 0;
      this.timer = 0;
      this.hours = '0' + 0;
      this.minutes = '0' + 0;
      this.seconds = '0' + 0;
      this.running = false;
      this.zeroFlag = false;
      this.status = 'TIMER'
    }
  }

  /*
   * Calculates the times in seconds to each interval.
   */
  caculateTimes() {
    this.warmUpTime = this.warmupIntervalSec +(this.warmupIntervalMin * 60);
    this.auxWarmUpTime = this.warmUpTime;
    this.coolDownTime = this.cooldownIntervalSec + (this.cooldownIntervalMin * 60);
    this.auxCoolDownTime = this.coolDownTime;
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
    this.status = 'STOPPED';
    this.statusColor = 'red';
    clearInterval(this.timer);
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
      this.statusColor = 'blue';
      if (this.warmUpTime == this.auxWarmUpTime) {
        this.timerService.reproduceWarmCoolSound(true);
      }
      this.warmUpTime--;
      this.alertSounds(this.warmUpTime);
      this.statusSounds(this.warmUpTime, true)
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
    this.statusColor = 'gray';
    if(this.coolDownTime == this.auxCoolDownTime){
      this.timerService.reproduceWarmCoolSound(false);
    }
    this.coolDownTime--;
    if (this.coolDownTime == 0) {
      this.status = 'FINISHED';
      this.flagStart = false;
      this.timerService.reproduceFinished();
    }
  }

  /**
   * Handles the logic for the exercise interval, decrementing the total exercise time,
   * and triggering the end of the exercise interval when the auxiliary exercise time is zero.
   */
  exerciseInterval(): void {
    this.status = 'EXERCISE';
    this.statusColor = 'green';
    this.totalExerciseTime--;
    this.auxExerciseTime--;
    this.alertSounds(this.auxExerciseTime)
    if (this.auxExerciseTime == 0) {
      this.endExerciseInterval();
      this.timerService.reproduceStatusSound(false);
    }
  }

  /**
   * Ends the exercise interval by updating the flagInterval and resetting the auxiliary exercise time.
   */
  endExerciseInterval(): void {
    this.flagInterval = false;
    this.auxExerciseTime = this.exerciseTime;
  }

  /**
   * Handles the logic for the rest interval, decrementing the total rest time,
   * and triggering the end of the rest interval when the auxiliary rest time is zero.
   */
  restInterval(): void {
    this.status = 'REST';
    this.statusColor = 'red';
    this.totalRestTime--;
    this.auxRestTime--;
    this.alertSounds(this.auxRestTime);
    if (this.auxRestTime == 0) {
      this.endRestInterval();
      this.allExerciseDone();
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
      this.timerService.reproduceFinished();
      if (this.coolDownTime == 0) {
        this.status = 'FINISHED';
        this.flagStart = false;
      }
    }
  }

  allExerciseDone(): void {
    if (this.totalExerciseTime != 0){
      this.timerService.reproduceStatusSound(true)
    }
  }

  /*
   * Uses the timer Service to reproduce alert sounds
   */
  alertSounds(x: number): void {
    if (x <= 3 && x > 0) {
      this.timerService.reproduceAlertSound(x);
    }
  }

  /*
   * Uses the timer Service to reproduce alert sounds
   */
  statusSounds(x: number, y: boolean): void {
    if (x == 0) {
      this.timerService.reproduceStatusSound(y);
    }
  }

}
