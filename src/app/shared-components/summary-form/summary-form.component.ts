import { Component } from '@angular/core';
import {FormDataService} from "../../services/form-data.service";
import {ProgressService} from "../../services/progress.service";
import {FormTabService} from "../../services/form-tab.service";

@Component({
  selector: 'app-summary-form',
  standalone: true,
  imports: [],
  templateUrl: './summary-form.component.html',
  styleUrl: './summary-form.component.scss'
})
export class SummaryFormComponent {
  constructor(
    public formDataService: FormDataService,
    private formTabService: FormTabService
  ) {}

  navigateToTab(index: number) {
    this.formTabService.setSelectedTabIndex(index);
  }

  get formData() {
    return this.formDataService.getFormData();
  }
}
