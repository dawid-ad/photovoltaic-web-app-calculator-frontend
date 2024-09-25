import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FormTabService {
  private selectedTabIndex = new BehaviorSubject<number>(0);

  getSelectedTabIndex() {
    return this.selectedTabIndex.asObservable();
  }

  setSelectedTabIndex(index: number) {
    this.selectedTabIndex.next(index);
  }
}
