import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStoreService {
  private ls = window.localStorage;

  constructor() {
  }

  public setItem(key, value) {
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    this.ls.setItem(key, value);
    return true;
  }

  public getItem(key) {
    const value = this.ls.getItem(key);
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  public clear() {
    this.ls.clear();
  }
}
