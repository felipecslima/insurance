import { Component, OnInit } from '@angular/core';
import { Person } from '../../../../shared/interfaces/person.interface';

@Component({
  selector: 'business-page',
  templateUrl: './business-page.component.html',
  styleUrls: ['./business-page.component.scss']
})
export class BusinessPageComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  test($event: Person) {
    console.log($event);
  }
}
