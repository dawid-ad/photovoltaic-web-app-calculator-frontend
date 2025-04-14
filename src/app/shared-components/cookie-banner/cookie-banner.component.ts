import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatRipple} from "@angular/material/core";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [
    NgIf,
    MatIcon,
    MatRipple,
    RouterLink
  ],
  templateUrl: './cookie-banner.component.html',
  styleUrl: './cookie-banner.component.scss'
})
export class CookieBannerComponent implements OnInit{
  isVisible = true;

  ngOnInit(): void {
    this.isVisible = localStorage.getItem('cookiesAccepted') !== 'true';
  }

  acceptCookies(): void {
    localStorage.setItem('cookiesAccepted', 'true');
    this.isVisible = false;
  }

}
