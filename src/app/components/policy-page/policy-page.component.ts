import { Component } from '@angular/core';
import {PolicyComponent} from "../../shared-components/policy/policy.component";

@Component({
  selector: 'app-policy-page',
  standalone: true,
  imports: [
    PolicyComponent
  ],
  templateUrl: './policy-page.component.html',
  styleUrl: './policy-page.component.scss'
})
export class PolicyPageComponent {
}
