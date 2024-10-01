import { Component } from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatRipple} from "@angular/material/core";
import {MatTooltip} from "@angular/material/tooltip";
import {NgOptimizedImage} from "@angular/common";
import {FormDataService} from "../../services/form-data.service";
import {FormTabService} from "../../services/form-tab.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatRipple,
    MatTooltip,
    NgOptimizedImage,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButton
  ],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent {
  constructor(
    public formDataService: FormDataService,
    private formTabService: FormTabService
  ) {}
}
