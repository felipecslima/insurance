import { User } from './person.interface';

export interface Business {
  id?: number;
  name: string;
  fantasyName: string;
  document: string;
  description: string;
  image: string;
  active: string;
  businessUser: User[];
  businessAddress: BusinessAddress[];
  businessPhone: BusinessPhone[];
  businessEmail: BusinessEmail[];
}

export interface BusinessAddress {
  id?: number;
  zipcode: string;
  description: string;
  city: string;
  number: string;
}

export interface BusinessPhone {
  id?: number;
  number: string;
}

export interface BusinessEmail {
  id?: number;
  recipient: string;
}
