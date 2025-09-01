import { Component } from '@angular/core';

import { Auth } from '@core/services/auth';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  constructor(private auth: Auth) {}

  logout() {
    this.auth.logout();
  }
}
