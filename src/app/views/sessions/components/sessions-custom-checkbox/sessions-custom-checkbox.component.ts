import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'sessions-custom-checkbox',
  templateUrl: './sessions-custom-checkbox.component.html',
  styleUrls: ['./sessions-custom-checkbox.component.scss']
})
export class SessionsCustomCheckboxComponent implements OnInit, OnChanges {
  @Input() options: CustomCheckbox[];
  @Input() direction: 'row' | 'column' = 'row';
  @Input() single = true;
  @Output() value: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  select(option) {
    if (this.single) {
      this.options = this.options.map(o => {
        o.selected = false;
        if (option.value === o.value) {
          o.selected = !option.selected;
        }
        return o;
      });
      const selected = this.options.find(o => o.selected === true);
      this.value.emit(selected?.value);
    }
  }
}

interface CustomCheckbox {
  label: string;
  value: string;
  selected: boolean;
}
