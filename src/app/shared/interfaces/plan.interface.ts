export interface Plan {
  id?: number;
  type: 'E' | 'F' ; // E = Business  F- Person
  name: string;
  description: string;
  quantityLife: number; // quantidade de vidas que o plano pode fazer
  value: number; // float valor monetário EX: 520 cents
  expirationDay: number; // dia de vencimento
  active: boolean;
  timestamp: string;
}
