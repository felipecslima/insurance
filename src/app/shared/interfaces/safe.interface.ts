// ISSO FOI IDEIA DO BACKEND PELO AMOR DE DEUS!!!! ERA PRA SER INSURANCE
export interface Safe {
  id?: number;
  name: string;
  description: string;
  value: number; // float valor monetário EX: 520 cents
  active: boolean;
  timestamp: string;
}
