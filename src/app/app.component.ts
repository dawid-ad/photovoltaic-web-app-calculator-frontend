import {Component, HostListener, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {CalculatorFormComponent} from "./components/calculator-form/calculator-form.component";
import {HeaderComponent} from "./shared-components/header/header.component";
import {ProgressBarComponent} from "./shared-components/progress-bar/progress-bar.component";
import {FooterComponent} from "./shared-components/footer/footer.component";
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {FormTabService} from "./services/form-tab.service";
import {ToastModule} from "primeng/toast";

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
    ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'photovoltaic-web-app-calculator-frontend';
  selectedTabIndex: number = 0;
  showProgress: boolean = false;
  showNavigation: boolean = false;
  isHomePage: boolean = false;

  constructor(private tabService: FormTabService, private router: Router) {
    this.router.events.subscribe(event => {
      this.showProgress = this.router.url.includes('/kalkulator') || this.router.url.includes('/wycena');
      this.showNavigation = this.router.url.includes('/kalkulator');
      this.isHomePage = this.router.url === '/home';
    });
  }

  ngOnInit() {
    this.tabService.getSelectedTabIndex().subscribe(index => {
      this.selectedTabIndex = index;
    });
  }

  previousStep() {
    if (this.selectedTabIndex > 0) {
      this.selectedTabIndex -= 1;
      this.tabService.setSelectedTabIndex(this.selectedTabIndex);
    }
  }
}
