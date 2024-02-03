import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private audioOne: HTMLAudioElement;
  private audioTwo: HTMLAudioElement;
  private audioThree: HTMLAudioElement;
  private audioExercise: HTMLAudioElement;
  private audioRest: HTMLAudioElement;
  private audioBuzzer: HTMLAudioElement;

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

  reproduceAlertSound(x: number): void {
    if (x == 1) {
      this.audioOne.play();
    } else if (x == 2) {
      this.audioTwo.play();
    } else {
      this.audioThree.play();
    }
  }

  reproduceStatusSound(x: boolean): void {
    if (x == true){
      this.audioExercise.play();
    } else {
      this.audioRest.play();
    }
  }

  reproduceFinished(): void {
    this.audioBuzzer.play();
  }

  setZero(x: any) {
    if (x < 10) {
      return '0' + x;
    }
    return x;
  }

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

  validWorkoutTime(x: number): boolean {
    if(x > 0) {
      return true;
    }
    return false;
  }

}
