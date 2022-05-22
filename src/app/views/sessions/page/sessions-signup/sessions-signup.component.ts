import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup2',
  templateUrl: './sessions-signup.component.html',
  styleUrls: ['./sessions-signup.component.scss']
})
export class SessionsSignupComponent implements OnInit {
  firstFormGroup: any;
  selectSignupType = [
    {
      label: 'Pessoal',
      value: 'F',
      selected: false,
    },
    {
      label: 'Empresarial',
      value: 'E',
      selected: false,
    }
  ];

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {

  }

  onSubmit() {
  }

}
