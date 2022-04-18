export interface Person {
  id?: number;
  firstName: string;
  lastName: string;
  birthday: string;
  document: string;
  username: string;
  timestamp?: number;
  user: User[];
  address: Address[];
  phone: Phone[];
  email: Email[];
}

export interface PersonCrud {
  id?: number;
  firstName: string;
  lastName: string;
  birthday: string;
  document: string;
  username: string;
  timestamp?: number;
  user: User;
  address: Address[];
  phone: Phone[];
  email: Email[];
}

export interface User {
  id?: number;
  personTypeId: number;
  password?: string;
  hashForgot?: boolean;
  hashTimestamp?: boolean;
  active?: boolean;
  timestamp?: string;
}

export interface Address {
  id?: number;
  zipcode: string;
  description: string;
  number: string;
  city: string;
}

export interface Phone {
  id?: number;
  number: string;
}

export interface Email {
  id?: number;
  recipient: string;
}

export interface Login {
  token: string;
}

export interface Permission {
  id: number;
  name: 'coop' | 'consultant' | 'doctor' | 'clinic' | 'subscriber';
  label: 'Cooperativa' | 'Consultor' | 'Médico' | 'Clínica' | 'Assinante';
  paramType: 'cooperativa' | 'consultor' | 'medico' | 'clinica' | 'assinante';
}
