export interface Person {
  name: string;
  birthday: string;
  document: string;
  username: string;
  timestamp: number;
  user: User;
  addres: Address;
  phone: Phone;
  email: Email;
}

export interface User {
  personTypeId: string;
  password: string;
  hashForgot: boolean;
  hashTimestamp: boolean;
  active: boolean;
  timestamp: string;
}

export interface Address {
  zipcode: string;
  description: string;
  city: string;
}

export interface Phone {
  number: string;
}

export interface Email {
  recipient: string;
}

export interface Login {
  accessToken: string;
}
