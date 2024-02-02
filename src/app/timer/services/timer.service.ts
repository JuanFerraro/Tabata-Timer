import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor() { }


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
