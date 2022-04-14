export interface Person {
  id?: number;
  name: string;
  birthday: string;
  document: string;
  username: string;
  timestamp: number;
  user: User;
  address: Address;
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
  number: string;
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

export interface Permission {
  id: number;
  name: 'coop' | 'consultant' | 'doctor' | 'clinic' | 'subscriber';
  label: 'Cooperativa' | 'Consultor' | 'Médico' | 'Clínica' | 'Assinante';
  paramType: 'cooperativa' | 'consultor' | 'medico' | 'clinica' | 'assinante';
}
