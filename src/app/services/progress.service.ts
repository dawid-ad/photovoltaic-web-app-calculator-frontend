import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private currentStepSubject = new BehaviorSubject<number>(0);
  private totalStepsSubject = new BehaviorSubject<number>(5);

  currentStep$ = this.currentStepSubject.asObservable();
  totalSteps$ = this.totalStepsSubject.asObservable();

  setCurrentStep(step: number) {
    this.currentStepSubject.next(step);
  }

  setTotalSteps(steps: number) {
    this.totalStepsSubject.next(steps);
  }

  getCurrentStep(){
    return this.currentStepSubject.value;
  }
}
