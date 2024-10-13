import { Component } from '@angular/core';
import {environment} from "../../../environments/enivonment";

@Component({
  selector: 'app-policy',
  standalone: true,
  imports: [],
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.scss'
})
export class PolicyComponent {
  companyName = environment.companyName;
  companyAddress = environment.companyAddress;
  emailContact = environment.emailContact;

}
