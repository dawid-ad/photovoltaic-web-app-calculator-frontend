import {Component, HostListener, inject, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatFabButton, MatIconButton} from "@angular/material/button";
import {MatOption, MatRipple} from "@angular/material/core";
import {MatTooltip} from "@angular/material/tooltip";
import {NgClass, NgForOf, NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import {FormDataService} from "../../services/form-data.service";
import {FormTabService} from "../../services/form-tab.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {ThreeDModelComponent} from "../../shared-components/three-d-model/three-d-model.component";
import {MapComponent} from "../../shared-components/map/map.component";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {animate, style, transition, trigger} from "@angular/animations";
import {ApiService} from "../../services/api.service";
import {ContactForm} from "../../model/ContactForm";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from "@angular/material/expansion";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {MatCheckbox} from "@angular/material/checkbox";
import {environment} from "../../../environments/enivonment";
import {MatSelect} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatRipple,
    MatTooltip,
    NgOptimizedImage,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButton,
    ThreeDModelComponent,
    MapComponent,
    MatTab,
    MatTabGroup,
    MatTabLabel,
    NgIf,
    NgForOf,
    NgClass,
    NgStyle,
    FormsModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatSlider,
    MatSliderThumb,
    MatCheckbox,
    RouterLink,
    MatOption,
    MatSelect,
    MatRadioModule,
    MatFabButton,
  ],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateX(50px)'}),
        animate('1500ms ease-out', style({opacity: 1, transform: 'translateX(0)'}))
      ])
    ])
  ]
})
export class ResultComponent implements OnInit {
  companyName = environment.companyName;
  cardData: any = null;
  private apiService = inject(ApiService);
  private contactForm = new ContactForm();
  isMobile = false;
  specData: any = null;
  warrantyData: any = null;

  constructor(
    public formDataService: FormDataService,
    private formTabService: FormTabService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
  }

  ngOnInit() {
    this.initSpecData();
    this.initWarrantyData();
    this.apiService.getCalculationResult(this.formDataService.getFormData()).subscribe((responseObj: ContactForm) => {
      this.contactForm = responseObj;
      console.log(responseObj);
      this.initCardData();
    })
    this.checkWindowSize();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkWindowSize();
  }

  checkWindowSize(): void {
    this.isMobile = window.innerWidth <= 900;
  }

  initCardData() {
    this.cardData = [
      {title: `${this.contactForm.proposedPvPower} kWh`, subtitle: 'Proponowana moc instalacji', footer: ''},
      {
        title: `${this.contactForm.modulePower}W`,
        subtitle: `Moduły ${this.contactForm.moduleModel} ${this.contactForm.panelsQuantity} szt.`,
        footer: ''
      },
      {title: this.contactForm.mountType, subtitle: 'Montaż', footer: ''},
      {title: '---', subtitle: 'Średnie Nasłonecznienie w Twoim Regionie', footer: '(źródło)'},
      {
        title: `${Math.round(this.contactForm.priceFrom).toLocaleString('pl-PL')} zł`,
        subtitle: `Cena ${this.contactForm.vatTax === 1 ? 'netto' : 'brutto'}`,
        footer: ''
      },
      {
        title: '---',
        subtitle: 'Prognozowana produkcja energii w pierwszym roku',
        footer: 'przy średniej cenie 0.90 zł / 1 kWh (źródło)'
      }
    ];
  }

  private initSpecData() {
    this.specData = [{
      group: [
        {title: "Szacowana wartość wyprodukowanej energii w 1 roku:", value: "40 000 zl", important: true},
        {title: "(przy średniej cenie 0,90 zł / 1 kWh)", value: null, important: false}
      ]
    },{
      group: [
        {title: "Moduły fotowoltaiczne:", value: "Encore 505W", important: false},
        {title: "Ilość:", value: "95 szt.", important: false}
      ]
    },{
      group: [
        {title: "Falownik:", value: "Solplanet", important: false}
      ]
    },{
      group: [
        {title: "Montaż:", value: "System montażowy dla dachów skośnych", important: false},
      ]
    }];
  }

  private initWarrantyData() {
    this.warrantyData = [{
      group: [
        {title: "Panele fotowoltaiczne wydajność:", value: "30 lat", important: true},
      ]
    },{
      group: [
        {title: "Panele fotowoltaiczne produkt:", value: "15 lat", important: false}
      ]
    },{
      group: [
        {title: "Falownik:", value: "10 lat, 15 lat lub 20 lat", important: false},
      ]
    },{
      group: [
        {title: "Konstrukcja montażowa:", value: "10 lub 15 lat", important: false}
      ]
    },{
      group: [
        {title: "Montaż:", value: "3-5 lat", important: false},
      ]
    }];
  }

  getMountType() {
    let roofType = this.formDataService.getFormData().roofType;
    if (roofType) {
      return roofType;
    } else {
      return this.formDataService.getFormData().installationType;
    }
  }

  getNumberOfPanels() {
    return this.contactForm.panelsQuantity;
  }

  goToFormPage() {
    this.router.navigate(['/form']);
  }


}
