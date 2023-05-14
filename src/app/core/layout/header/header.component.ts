import { UserService } from './../../services/user.service';
import { Component, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user: User | null;

  constructor(private authService: AuthService) {
    this.user = this.authService.userValue;
    console.log('user', this.user)
  }
  logout() {
    this.authService.logout();
    console.log('user: ', this.user)
    this.user = this.authService.userValue
  }

}
