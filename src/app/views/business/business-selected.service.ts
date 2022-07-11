import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Business } from '../../shared/interfaces/business.interface';

@Injectable({
  providedIn: 'root'
})
export class BusinessSelectedService {

  lastBusiness: BehaviorSubject<Business> = new BehaviorSubject(undefined);

  constructor() {
  }

  set(business: Business) {
    this.lastBusiness.next(business);
  }

  get(): Observable<Business> {
    return this.lastBusiness.asObservable();
  }
}
