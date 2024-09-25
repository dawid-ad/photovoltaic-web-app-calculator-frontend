import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CalculatorFormComponent} from "./components/calculator-form/calculator-form.component";
import {HeaderComponent} from "./shared-components/header/header.component";
import {ProgressBarComponent} from "./shared-components/progress-bar/progress-bar.component";
import {FooterComponent} from "./shared-components/footer/footer.component";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CalculatorFormComponent, HeaderComponent, ProgressBarComponent, FooterComponent, NgStyle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'photovoltaic-web-app-calculator-frontend';
}
