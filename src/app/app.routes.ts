import { Routes } from '@angular/router';
import {CalculatorFormComponent} from "./components/calculator-form/calculator-form.component";
import {ResultComponent} from "./components/result/result.component";
import {ThreeDModelComponent} from "./shared-components/three-d-model/three-d-model.component";
import {PolicyComponent} from "./components/policy/policy.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'kalkulator',
    pathMatch: 'full'
  },
  {
    path: 'kalkulator',
    component: CalculatorFormComponent
  },
  {
    path: 'wycena',
    component: ResultComponent
  },
  {
    path: 'model',
    component: ThreeDModelComponent
  },
  {
    path: 'polityka-prywatnosci',
    component: PolicyComponent
  },
];
