import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar-custon',
  templateUrl: './snackbar-custon.component.html',
  styleUrls: ['./snackbar-custon.component.scss'],
})
export class SnackbarCustonComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }
}
