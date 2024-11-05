import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MapComponent} from "../../shared-components/map/map.component";
import {ProgressBarComponent} from "../../shared-components/progress-bar/progress-bar.component";
import {MatTab, MatTabChangeEvent, MatTabGroup, MatTabLabel, MatTabsModule} from "@angular/material/tabs";
import {MatIcon} from "@angular/material/icon";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {NgClass, NgIf, NgOptimizedImage} from "@angular/common";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDrawer, MatDrawerContainer} from "@angular/material/sidenav";
import {MatButton} from "@angular/material/button";
import {ProgressService} from "../../services/progress.service";
import {MatOptgroup, MatOption, MatRipple} from "@angular/material/core";
import {trigger, state, style, animate, transition} from '@angular/animations';
import {CalculationFormDataService} from "../../services/calculation-form-data.service";
import {FormTabService} from "../../services/form-tab.service";
import {MatSelect} from "@angular/material/select";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "../../services/notification.service";


@Component({
  selector: 'app-calculator-form',
  standalone: true,
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({height: '40px', opacity: 0})),
      state('expanded', style({height: '*', opacity: 1})),
      transition('collapsed <=> expanded', animate('0.4s ease-in-out')),
    ])
  ],
  imports: [
    MapComponent,
    ProgressBarComponent,
    MatIcon,
    FormsModule,
    MatFormField,
    MatPrefix,
    MatInputModule,
    MatSuffix,
    NgOptimizedImage,
    MatSlider,
    MatSliderThumb,
    MatExpansionModule,
    MatDrawer,
    MatDrawerContainer,
    MatButton,
    MatTabsModule,
    NgIf,
    MatRipple,
    NgClass,
    MatSelect,
    MatOption,
    MatOptgroup,
    ReactiveFormsModule,
  ],
  templateUrl: './calculator-form.component.html',
  styleUrl: './calculator-form.component.scss',
})
export class CalculatorFormComponent implements AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  fromHomePage: boolean = false;

  constructor(private progressService: ProgressService,
              public formDataService: CalculationFormDataService,
              private tabService: FormTabService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService) {
  }

  ngAfterViewInit() {
    let totalSteps = this.tabGroup._tabs.length;
    this.formDataService.resetCalculationFormData();
    this.route.queryParams.subscribe(params => {
      const customerType = params['customerType'];
      if(customerType === 'PRIVATE' || customerType === 'ENTREPRENEUR') {
        this.formDataService.getCalculationFormData().customerType = customerType;
        totalSteps--;
        this.fromHomePage = true;
      } else {
        this.fromHomePage = false;
      }
    });
    this.progressService.setTotalSteps(totalSteps);
    this.tabService.setSelectedTabIndex(0);
    this.progressService.setCurrentStep(0);
    this.tabService.getSelectedTabIndex().subscribe(index => {
      if (this.tabGroup) {
        this.tabGroup.selectedIndex = index;
      }
    });
  }

  get energyConsumptionPerYear(): number {
    return this.formDataService.getCalculationFormData().energyConsumptionPerYear;
  }

  set energyConsumptionPerYear(value: number) {
    this.formDataService.setFormData({energyConsumptionPerYear: value});
    this.updateExpectedPvPower();
  }

  get expectedPvPower(): number {
    return this.formDataService.getCalculationFormData().expectedPvPower;
  }

  set expectedPvPower(value: number) {
    this.formDataService.setFormData({expectedPvPower: value});
  }

  private updateExpectedPvPower() {
    const adjustedPower = Math.round((this.formDataService.getCalculationFormData().energyConsumptionPerYear / 1000) * 1.2);
    this.expectedPvPower = Math.max(3, Math.min(50, adjustedPower));
  }

  onRegionSelected(regionName: string) {
    this.formDataService.setFormData({region: regionName});
    this.nextStep();
  }

  nextStep() {
    let currentIndex = this.tabGroup.selectedIndex ?? 0; // Add default value to handle undefined

    if (currentIndex < this.tabGroup._tabs.length - 1) {
      currentIndex++; // Increment the current index
      this.tabGroup._tabs.toArray()[currentIndex].disabled = false; // Enable the next tab
      this.tabService.setSelectedTabIndex(currentIndex); // Update the tab index in the service

      // Ensure that the progress service step is in sync
      if (this.progressService.getCurrentStep() < currentIndex) {
        this.progressService.setCurrentStep(currentIndex);
      }
    }
  }

  goToResult(calculationType: string) {
    if(calculationType === 'energyConsumptionPerYear'){
      this.formDataService.getCalculationFormData().expectedPvPower = 0;
    }
    if(calculationType === 'expectedPvPower'){
      this.formDataService.getCalculationFormData().energyConsumptionPerYear = 0;
    }
    const totalSteps = this.tabGroup._tabs.length;
    this.progressService.setCurrentStep(totalSteps);
    this.router.navigate(['/wycena']);
  }

  showWarningMessage(message: string) {
    this.notificationService.showWarningSnackbar(message);
  }

  onTabChange(event: MatTabChangeEvent): void {
    if (event.tab.textLabel === 'Customer') {
      this.tabService.setSelectedTabIndex(0);
    }
  }
}
