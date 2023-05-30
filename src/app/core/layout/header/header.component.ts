import { UserService } from './../../services/user.service';
import { Component, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user!: User | null;

  constructor(private jwtService: JwtService) {

    this.user = this.jwtService.getUser()




  }
  logout() {
    this.jwtService.signOut();
    this.user = null
  }

}
