import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  /*
   * Audio elements for different sounds
   */
  private audioOne: HTMLAudioElement;
  private audioTwo: HTMLAudioElement;
  private audioThree: HTMLAudioElement;
  private audioExercise: HTMLAudioElement;
  private audioRest: HTMLAudioElement;
  private audioBuzzer: HTMLAudioElement;

  /*
   * Initializing audio elements with corresponding sound files
   */
  constructor() {
    this.audioOne = new Audio();
    this.audioOne.src = './assets/sounds/robot-saying-1.mp3';
    this.audioTwo = new Audio();
    this.audioTwo.src = './assets/sounds/robot-saying-2.mp3';
    this.audioThree = new Audio();
    this.audioThree.src = './assets/sounds/robot-saying-3.mp3';
    this.audioExercise = new Audio();
    this.audioExercise.src = './assets/sounds/exercise.ogg';
    this.audioRest = new Audio();
    this.audioRest.src = './assets/sounds/rest.ogg';
    this.audioBuzzer = new Audio();
    this.audioBuzzer.src = './assets/sounds/buzzer.mp3';
  }

  /*
   * Function to play different alert sounds based on a counter
   */
  reproduceAlertSound(x: number): void {
    if (x == 1) {
      this.audioOne.play();
    } else if (x == 2) {
      this.audioTwo.play();
    } else {
      this.audioThree.play();
    }
  }

  /*
   * Function to play exercise or rest sound based on a boolean status
   */
  reproduceStatusSound(x: boolean): void {
    if (x == true){
      this.audioExercise.play();
    } else {
      this.audioRest.play();
    }
  }

  /*
   * Function to play finished buzzer sound
   */
  reproduceFinished(): void {
    this.audioBuzzer.play();
  }

  /*
   * Helper function to add leading zero for single-digit numbers
   */
  setZero(x: any) {
    if (x < 10) {
      return '0' + x;
    }
    return x;
  }


  /*
   * Function to calculate total workout time in hours, minutes, and seconds
   */
  calculateTotalWorkoutTime(
    exerciseIntervalMin: number,
    exerciseIntervalSec: number,
    restIntervalMin: number,
    restIntervalSec: number,
    numberOfSets: number,
    numberOfCycles: number,
    warmupIntervalMin: number,
    warmupIntervalSec: number,
    cooldownIntervalMin: number,
    cooldownIntervalSec: number,
  ): { hours: string, minutes: string, seconds: string, timer: number } {

    let timer = 60 * (exerciseIntervalMin + restIntervalMin);
    timer += (exerciseIntervalSec + restIntervalSec);
    timer *= numberOfSets;
    timer *= numberOfCycles;
    timer += 60 * (warmupIntervalMin + cooldownIntervalMin);
    timer += warmupIntervalSec + cooldownIntervalSec;

    const hours = Math.floor(timer / 3600);
    const minutes = Math.floor((timer % 3600) / 60);
    const seconds = timer % 60;

    return { hours: this.setZero(hours), minutes: this.setZero(minutes), seconds: this.setZero(seconds), timer };
  }

  /*
   * Function to check if the workout time is valid (greater than 0)
   */
  validWorkoutTime(x: number): boolean {
    if(x > 0) {
      return true;
    }
    return false;
  }

}
