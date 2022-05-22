import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'sessions-custom-checkbox',
  templateUrl: './sessions-custom-checkbox.component.html',
  styleUrls: ['./sessions-custom-checkbox.component.scss']
})
export class SessionsCustomCheckboxComponent implements OnInit, OnChanges {
  @Input() options: CustomCheckbox[];
  @Input() direction: 'row' | 'column' = 'row';
  @Output() value: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  select(option) {
    this.value.emit(option.value);
  }
}

interface CustomCheckbox {
  label: string;
  value: string;
  selected: boolean;
}
