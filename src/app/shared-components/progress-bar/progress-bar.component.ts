import {Component, OnInit} from '@angular/core';
import {ProgressService} from "../../services/progress.service";


@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent implements OnInit {
  currentStep = 0;
  totalSteps = 0;

  constructor(private progressService: ProgressService) {
  }

  ngOnInit() {
    this.progressService.currentStep$.subscribe(step => {
      this.currentStep = step;
    });
    this.progressService.totalSteps$.subscribe(total => {
      this.totalSteps = total;
    });
  }

  getProgressPercentage() {
    return (this.currentStep / this.totalSteps) * 100;
  }
}
