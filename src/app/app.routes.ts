import { Routes } from '@angular/router';
import {CalculatorFormComponent} from "./components/calculator-form/calculator-form.component";
import {ResultComponent} from "./components/result/result.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'form',
    pathMatch: 'full'
  },
  {
    path: 'form',
    component: CalculatorFormComponent
  },
  {
    path: 'result',
    component: ResultComponent
  },
];
