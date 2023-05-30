import { HttpClient } from "@angular/common/http";
import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { HostListener } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  mobHeight: any;
  mobWidth: any;
  constructor(private router: Router, private http: HttpClient) {
    this.mobHeight = (window.screen.height) + "px";
    this.mobWidth = (window.screen.width) + "px";
    console.log('size', this.mobHeight);
    console.log(this.mobWidth)

    if (this.mobWidth <= 420) {
      this.router.navigate(['error'])
    }
  }

}
