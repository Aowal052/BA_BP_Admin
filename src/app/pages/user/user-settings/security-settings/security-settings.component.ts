import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/@shared/models/user';

@Component({
  selector: 'da-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['../user-settings.component.scss'],
})
export class SecuritySettingsComponent implements OnInit {
  securityItems = [
    {
      title: 'Profile',
      description: 'Name :',
      results: 'Admin'
    },
    {
      title: 'Mobile',
      description: 'user mobile :',
      results: '188***1234'
    },
    {
      title: 'Email',
      description: 'admin mail :',
      results: 'devui***admin.com'
    }
  ]

  user!: User;
  haveLoggedIn = false;
  constructor() {}

  ngOnInit(): void {
    if (localStorage.getItem('userinfo')) {
      this.user = JSON.parse(localStorage.getItem('userinfo')!);
      this.haveLoggedIn = true;
    }
  }
}
