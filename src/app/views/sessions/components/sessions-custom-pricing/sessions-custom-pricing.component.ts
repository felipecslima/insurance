import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'sessions-custom-pricing',
  templateUrl: './sessions-custom-pricing.component.html',
  styleUrls: ['./sessions-custom-pricing.component.scss']
})
export class SessionsCustomPricingComponent implements OnInit {
  @Input() options: CustomPrice[];
  @Input() direction: 'row' | 'column' = 'row';
  @Output() value: EventEmitter<string> = new EventEmitter<string>();
  colors = environment.color;

  constructor() {
  }

  ngOnInit(): void {
  }

  select(option) {
    this.options = this.options.map(o => {
      o.selected = option.value === o.value;
      return o;
    });
    const selected = this.options.find(o => o.selected === true);
    this.value.emit(selected?.value);
  }

  removeAll() {
    this.options = this.options.map(o => {
      o.selected = false;
      return o;
    });
    this.value.emit(null);
  }
}

export interface CustomPrice {
  label: string;
  description: string;
  value: string;
  selected: boolean;
  price?: string;
}
