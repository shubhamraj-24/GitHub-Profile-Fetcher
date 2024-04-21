import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './Search.component.html'
 // styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Output() search = new EventEmitter<string>();
  username: string='';

  onSearch(): void {
    this.search.emit(this.username);
  }
}
