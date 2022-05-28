export interface Business {
  id?: number;
  name: string;
  fantasyName: string;
  document: string;
  description: string;
  image: string;
  active: string;
  businessUser: BusinessUser[];
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

export interface BusinessUser {
  id: number;
  personTypeId?: number;
  hashForget?: boolean;
  hashTimestamp?: string;
  active?: boolean;
  timestamp?: string;
  person?: {
    id: number;
    name: string;
    username: string;
  };
}
