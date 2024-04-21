// pagination.component.ts

import { Component, OnInit, Input, Output, EventEmitter ,ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnInit {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }
}
