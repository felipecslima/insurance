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
  permissions?: PermissionUser;
  doctor?: Doctor[];
}

export interface Doctor {
  id: number;
  skill: string;
  medicalId: string;
}

export interface PermissionUser {
  business: PermissionUserDetail;
  doctor: PermissionUserDetail;
  notification: PermissionUserDetail;
  plan: PermissionUserDetail;
  safe: PermissionUserDetail;
  service: PermissionUserDetail;
  subscriberDependent: PermissionUserDetail;
  user: PermissionUserDetail;
}

interface PermissionUserDetail {
  create: boolean;
  update: boolean;
  delete: boolean;
  index: boolean;
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
  doctor?: Doctor[];
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

export interface PersonCreate {
  type: string;
  planId: number;
  safeId: number;
  discountPlan: number;
  discountSafe: number;
  person: Person;
}
