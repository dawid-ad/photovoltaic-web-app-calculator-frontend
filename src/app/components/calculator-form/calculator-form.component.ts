import {AfterViewInit, Component, signal, ViewChild} from '@angular/core';
import {MapComponent} from "../../shared-components/map/map.component";
import {ProgressBarComponent} from "../../shared-components/progress-bar/progress-bar.component";
import {MatTab, MatTabGroup, MatTabLabel, MatTabsModule} from "@angular/material/tabs";
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {NgClass, NgIf, NgOptimizedImage} from "@angular/common";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDrawer, MatDrawerContainer} from "@angular/material/sidenav";
import {MatButton} from "@angular/material/button";
import {ProgressService} from "../../services/progress.service";
import {MatRipple} from "@angular/material/core";
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-calculator-form',
  standalone: true,
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '40px', opacity: 0 })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('collapsed <=> expanded', animate('0.4s ease-in-out')),
    ])
  ],
  imports: [
    MapComponent,
    ProgressBarComponent,
    MatTabGroup,
    MatTab,
    MatIcon,
    MatTabLabel,
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
  ],
  templateUrl: './calculator-form.component.html',
  styleUrl: './calculator-form.component.scss',
})
export class CalculatorFormComponent implements AfterViewInit{
  selectedTabIndex: number = 0;
  selectedButton: number | null = null;
  formData: any = {
    region: '',
    customerType: '',
    roofType: '',
    installationType: '',
    energyConsumptionPerYear: null,
    installationPower: null
  };

  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  constructor(private progressService: ProgressService) {}

  ngAfterViewInit() {
    const totalSteps = this.tabGroup._tabs.length;
    this.progressService.setTotalSteps(totalSteps);
  }

  get energyConsumptionPerYear(): number {
    return this.formData.energyConsumptionPerYear;
  }

  set energyConsumptionPerYear(value: number) {
    this.formData.energyConsumptionPerYear = value;
    this.updateInstallationPower();
  }

  get installationPower(): number {
    return this.formData.installationPower;
  }

  set installationPower(value: number) {
    this.formData.installationPower = value;
  }

  private updateInstallationPower() {
    const adjustedPower = Math.round((this.formData.energyConsumptionPerYear / 1000) / 0.9);
    this.installationPower = Math.max(3, Math.min(50, adjustedPower));
  }

  onRegionSelected(regionName: string) {
    this.formData.region = regionName;
    this.nextStep();
  }

  nextStep() {
    if (this.selectedTabIndex < this.tabGroup._tabs.length - 1) {
      this.tabGroup._tabs.toArray()[this.selectedTabIndex + 1].disabled = false;
      this.selectedTabIndex += 1;
      if(this.progressService.getCurrentStep() < this.selectedTabIndex){
        this.progressService.setCurrentStep(this.selectedTabIndex);
      }
    }
  }

  previousStep() {
    if (this.selectedTabIndex > 0) {
      this.selectedTabIndex -= 1;
      if(this.progressService.getCurrentStep() < this.selectedTabIndex){
        this.progressService.setCurrentStep(this.selectedTabIndex);
      }
    }
  }

  submitForm() {
    console.log('Form Data:', this.formData);
    this.nextStep();
  }

  selectButton(buttonId: number) {
    this.selectedButton = buttonId;
  }

  showMessage() {
    //
  }
}
