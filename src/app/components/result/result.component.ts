import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule, MatFabButton} from "@angular/material/button";
import {MatOptionModule, MatRippleModule} from "@angular/material/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {CalculationFormDataService} from "../../services/calculation-form-data.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MapComponent} from "../../shared-components/map/map.component";
import {animate, style, transition, trigger} from "@angular/animations";
import {ApiService} from "../../services/api.service";
import {ContactForm} from "../../model/ContactForm";
import {Router, RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule,} from "@angular/material/expansion";
import {MatSliderModule} from "@angular/material/slider";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {environment} from "../../../environments/environment";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {WarrantyData} from "../../model/WarrantyData";
import {EnergyStorage} from "../../model/EnergyStorage";
import {CalculationResult} from "../../model/CalculationResult";
import {CalculationFormData} from "../../model/CalculationFormData";
import {ContactFormResponse} from "../../model/ContactFormResponse";
import {MatTableModule} from "@angular/material/table";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateX(50px)'}),
        animate('1500ms ease-out', style({opacity: 1, transform: 'translateX(0)'}))
      ])
    ])
  ],
  imports: [
    MatIconModule,
    MatRippleModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MapComponent,
    MatTableModule,
    FormsModule,
    MatExpansionModule,
    MatSliderModule,
    MatCheckboxModule,
    RouterModule,
    MatOptionModule,
    MatSelectModule,
    MatRadioModule,
    MatFabButton,
    ReactiveFormsModule,
    NgIf,
    NgClass,
    NgForOf,
    MatSlideToggle,
    MatProgressSpinner,
    NgStyle
  ],
  selector: 'app-result',
  standalone: true,
  styleUrl: './result.component.scss',
  templateUrl: './result.component.html'
})
export class ResultComponent implements OnInit {
  companyName = environment.companyName;
  private apiService = inject(ApiService);

  calculationFormData = new CalculationFormData();
  contactForm = new ContactForm();
  contactFormResponse = new ContactFormResponse();

  specificationFullCardData: any = null;
  warrantyFullCardData: any = null;
  energyStorageModels: any = null;

  powerOptimizersSlider: boolean = false;
  energyStorageSlider: boolean = false;

  projoyCheckbox: boolean = false;

  calculationDate: any = null;
  proposedPvPowerText: string = "";
  estimatedOneYearProduction: number = 0;
  investmentReturnInYears: number = 0;
  inverterModel: string = '-';
  mountType: string = ''
  priceText: string = "";
  priceWithoutGrantText: string = "";
  moduleModel: string = '-';
  modulePower: number = 0;
  panelsQuantity: number = 0;
  vatType: string = "";
  vatTax: number = 0;
  pricePerKw: number = 0;
  energyPricePerKwh: number = 0;
  projoyIncluded: boolean = false;
  grantPossible: boolean = false;
  energyStorageAvailable: boolean = false;

  resultsReady: boolean = true;
  isLoading: boolean = false;

  @ViewChild('specification') specification!: ElementRef;

  constructor(
    public formDataService: CalculationFormDataService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.initDataFromCalculatorForm();
    this.initApiData();
  }

  private initApiData() {
    this.apiService.getWarrantyData().subscribe((warrantyData: WarrantyData) => {
      this.initWarranty(warrantyData);
    });
    this.apiService.getEnergyStorageModels().subscribe((energyStorageModels: EnergyStorage[]) => {
      this.initEnergyStorageModels(energyStorageModels);
    });
    this.calculate();
  }

  private initDataFromCalculatorForm() {
    this.calculationFormData = this.formDataService.getCalculationFormData();
  }

  public calculate(){
    this.isLoading = true;
    this.apiService.getCalculationResult(this.calculationFormData).subscribe({
      next: (calculationResult: CalculationResult) => {
        if (calculationResult) {
          this.initResults(calculationResult);
          this.initSpecification();
        }
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  public calculateOnChange(){
    this.calculationFormData.projoy = this.projoyCheckbox;
    if(!this.powerOptimizersSlider){
      this.calculationFormData.powerOptimizersType = ""
    }
    if(!this.energyStorageSlider){
      this.calculationFormData.energyStorageModelId = 0;
      this.calculationFormData.grant = false;
    }
    this.calculate();
  }

  private initEnergyStorageModels(energyStorageModels: EnergyStorage[]) {
    this.energyStorageModels = energyStorageModels;
  }

  private initWarranty(warrantyData: WarrantyData) {
    this.warrantyFullCardData = [{
      group: [
        {title: "Panele fotowoltaiczne wydajność:", value: warrantyData.panelEfficiency, important: true},
      ]
    }, {
      group: [
        {title: "Panele fotowoltaiczne produkt:", value: warrantyData.panelProduct, important: false}
      ]
    }, {
      group: [
        {title: "Falownik:", value: warrantyData.inverter, important: false},
      ]
    }, {
      group: [
        {title: "Konstrukcja montażowa:", value: warrantyData.construction, important: false}
      ]
    }, {
      group: [
        {title: "Montaż:", value: warrantyData.mounting, important: false},
      ]
    }];
  }

  private initSpecification() {
    this.specificationFullCardData = [{
      group: [
        {
          title: "Szacowana wartość wyprodukowanej energii w 1 roku:",
          value: `${Math.round(this.estimatedOneYearProduction).toLocaleString('pl-PL')} zł`,
          important: true
        },
        {title: "(przy średniej cenie 0,90 zł / 1 kWh)", value: null, important: false}
      ]
    }, {
      group: [
        {
          title: "Moduły fotowoltaiczne:",
          value: `${this.moduleModel} ${this.modulePower}W`,
          important: false
        },
        {title: "Ilość:", value: `${this.panelsQuantity} szt.`, important: false}
      ]
    }, {
      group: [
        {title: "Falownik:", value: this.inverterModel, important: false}
      ]
    }, {
      group: [
        {title: "Montaż:", value: this.mountType, important: false},
      ]
    }];
  }

  private initResults(calculationResult: CalculationResult) {
    this.calculationDate = calculationResult.calculationDate;
    this.proposedPvPowerText = calculationResult.proposedPvPower + " kWp";
    this.estimatedOneYearProduction = calculationResult.estimatedOneYearProduction;
    this.investmentReturnInYears = calculationResult.investmentReturnInYears;
    this.inverterModel = calculationResult.inverterModel;
    this.mountType = calculationResult.mountTypeForView;
    this.priceText = `${Math.round(calculationResult.price).toLocaleString('pl-PL')} zł`;
    this.priceWithoutGrantText = `${Math.round(calculationResult.priceWithoutGrant).toLocaleString('pl-PL')} zł`;
    this.moduleModel = calculationResult.moduleModel;
    this.modulePower = calculationResult.modulePower;
    this.panelsQuantity = calculationResult.panelsQuantity;
    this.vatTax = calculationResult.vatTax;
    this.vatType = `${this.vatTax === 1 ? 'netto' : 'brutto'}`;
    this.pricePerKw = calculationResult.pricePerKw
    this.energyPricePerKwh = calculationResult.energyPricePerKwh;
    this.projoyIncluded = calculationResult.projoyIncluded;
    this.grantPossible = calculationResult.grantPossible;
    this.energyStorageAvailable = calculationResult.energyStorageAvailable;
    this.setProjoyCheckbox();
  }

  goToFormPage() {
    this.router.navigate(['/form']);
  }

  private setProjoyCheckbox(){
    this.projoyCheckbox = this.projoyIncluded || this.calculationFormData.projoy;
  }

  scrollDown(targetElement: HTMLElement) {
    const remOffset = 6;
    const offset = remOffset * parseFloat(getComputedStyle(document.documentElement).fontSize);
    const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  keepToggleOn(event: any): void {
    event.source.checked = true;
  }
}
