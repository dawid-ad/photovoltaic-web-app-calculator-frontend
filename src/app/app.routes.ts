import { Routes } from '@angular/router';
import {CalculatorFormComponent} from "./components/calculator-form/calculator-form.component";
import {ResultComponent} from "./components/result/result.component";
import {PolicyPageComponent} from "./components/policy-page/policy-page.component";
import {HomePageComponent} from "./components/home-page/home-page.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'kalkulator',
    component: CalculatorFormComponent,
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'wycena',
    component: ResultComponent,
  },
  {
    path: 'polityka-prywatnosci',
    component: PolicyPageComponent
  },
];
