import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { TableEntityService } from '../../services/states/table-entity.service';
import { AutoUnsubscribe, CombineSubscriptions } from '../../decorators/auto-unsubscribe.decorator';
import { Unsubscribable } from 'rxjs';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
@AutoUnsubscribe()
export class TableListComponent implements OnInit, OnDestroy, OnChanges {
  @CombineSubscriptions()
  subscribe: Unsubscribable;
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;

  data: any;
  @Input() title = 'Listagem';
  @Input() hasFilter: boolean;
  @Input() loading: boolean;
  @Input() columns: TableInfinityListColumn[] = [];
  @Output() loadNewData = new EventEmitter();
  @Output() cbButton = new EventEmitter();
  @Output() cbFilter = new EventEmitter();

  sorts = [
    {
      prop: 'TOTALSPENT',
      dir: 'desc',
    },
  ];

  columnModeSelected: ColumnMode;

  @ViewChild('ngxDataTable') datatable: ElementRef;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('ngxDataTable', { static: false })
  ngxDataTable: DatatableComponent;

  rowHeight = 50;

  headerHeight = 50;

  enableScrollTable = true;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.table.recalculate();
  }

  constructor(
    private tableEntityService: TableEntityService,
    private router: Router) {
    this.columnModeSelected = ColumnMode.force;
    this.subscribe = this.tableEntityService.entities$.subscribe(response => {
      this.data = response;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    const { loading } = changes;
    if (loading) {
      const { currentValue } = loading;
      if (this.progressBar) {
        this.progressBar.mode = currentValue ? 'indeterminate' : 'determinate';
      }
    }
  }

  public onScroll(event): void {
    const { offsetY } = event;
    if (!offsetY) {
      return;
    }
    const viewHeight =
      this.datatable.nativeElement.getBoundingClientRect().height -
      this.headerHeight;

    if (
      !this.loading &&
      offsetY + viewHeight >=
      this.data.length * this.rowHeight - this.rowHeight
    ) {
      this.loadNewData.emit(true);
    }
  }

  public sortData(event): void {
    if (event.sorts.length) {
      const [sort] = event.sorts;
      const invertedSort = sort.dir; // sort.dir === 'asc' ? 'desc' : 'asc';
      this.router.navigate([], {
        queryParams: { orderField: sort.prop, orderType: invertedSort },
        queryParamsHandling: 'merge',
      });
    }
  }

}

export interface TableInfinityListColumn {
  id: string;
  urlBase?: string;
  url?: string;
  columnName: string;
  displayText?: string;
  type: 'button' | 'text';
  buttonLabel?: string;
  resizeable?: boolean;
  minWidth?: number;
  maxWidth?: number;
  draggable?: boolean;
  sortable?: boolean;
}
