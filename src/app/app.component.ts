import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CalculatorFormComponent} from "./components/calculator-form/calculator-form.component";
import {HeaderComponent} from "./shared-components/header/header.component";
import {ProgressBarComponent} from "./shared-components/progress-bar/progress-bar.component";
import {FooterComponent} from "./shared-components/footer/footer.component";
import {NgIf, NgStyle} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {FormTabService} from "./services/form-tab.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CalculatorFormComponent, HeaderComponent, ProgressBarComponent, FooterComponent, NgStyle, MatIcon, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  implements OnInit {
  title = 'photovoltaic-web-app-calculator-frontend';
  selectedTabIndex: number = 0;

  constructor(private tabService: FormTabService) {}
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
