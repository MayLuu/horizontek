import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchVal: string = '';
  @Output() searchEvent = new EventEmitter<string>();
  getSearch() {
    this.searchEvent.emit(this.searchVal)
  }
}
