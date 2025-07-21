import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {CalculatorFormComponent} from "./components/calculator-form/calculator-form.component";
import {HeaderComponent} from "./shared-components/header/header.component";
import {ProgressBarComponent} from "./shared-components/progress-bar/progress-bar.component";
import {FooterComponent} from "./shared-components/footer/footer.component";
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {FormTabService} from "./services/form-tab.service";
import {ToastModule} from "primeng/toast";
import {CookieBannerComponent} from "./shared-components/cookie-banner/cookie-banner.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CalculatorFormComponent,
    HeaderComponent,
    ProgressBarComponent,
    FooterComponent,
    NgStyle,
    MatIcon,
    NgIf,
    NgClass,
    ToastModule,
    CookieBannerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'photovoltaic-web-app-calculator-frontend';
  selectedTabIndex: number = 0;
  showProgress: boolean = false;
  showNavigation: boolean = false;
  isHomePage: boolean = false;
  utmTerm: string | null = null;

  constructor(private tabService: FormTabService,
              private router: Router,
              private route: ActivatedRoute) {
    this.router.events.subscribe(event => {
      this.showProgress = this.router.url.includes('/kalkulator') || this.router.url.includes('/wycena');
      this.showNavigation = this.router.url.includes('/kalkulator');
      this.isHomePage = this.router.url.startsWith('/home');
    });
  }

  ngOnInit() {
    this.tabService.getSelectedTabIndex().subscribe(index => {
      this.selectedTabIndex = index;
    });
    this.handleUtmTermFromGoogle();
    this.getOrCreateUserId();
  }

  previousStep() {
    if (this.selectedTabIndex > 0) {
      this.selectedTabIndex -= 1;
      this.tabService.setSelectedTabIndex(this.selectedTabIndex);
    }
  }

  handleUtmTermFromGoogle(){
    this.route.queryParamMap.subscribe(params => {
      this.utmTerm = params.get('utm_term');
      if (this.utmTerm) {
        localStorage.setItem("utm_term",this.utmTerm)
        this.router.navigate([], {
          queryParams: { utm_term: null },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      }
    });
  }

  getOrCreateUserId(): string {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem('user_id', userId);
    }
    return userId;
  }
}
