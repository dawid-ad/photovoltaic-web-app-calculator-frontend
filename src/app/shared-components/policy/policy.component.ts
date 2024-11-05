import {Component, Input} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {environment} from "../../../environments/environment";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-policy',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatDialogContent,
    MatDialogTitle,
    NgIf
  ],
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.scss'
})
export class PolicyComponent {
  companyName = environment.companyName;
  companyAddress = environment.companyAddress;
  emailContact = environment.emailContact;
  @Input() buttonVisible: boolean = true;
}
