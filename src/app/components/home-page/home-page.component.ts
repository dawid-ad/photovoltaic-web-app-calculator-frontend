import {Component, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NgClass, NgOptimizedImage} from "@angular/common";
import {MatRipple} from "@angular/material/core";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    MatIcon,
    NgOptimizedImage,
    MatRipple,
    NgClass
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  constructor(
    private router: Router) {}

  ngOnInit() {
  }

  goToCalculator(customerType: string) {
    this.router.navigate(['/kalkulator'], { queryParams: { customerType: customerType } });
  }
}
