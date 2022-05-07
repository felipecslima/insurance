export interface Service {
  id?: number;
  serviceType?: ServiceType;
  serviceTypeId?: number;
  name?: string;
  description?: string;
  value: number;
  image?: string;
  active: boolean;
  timestamp?: string;
}

export interface ServiceType {
  id: number;
  name?: 'Consulta' | 'Exame' | 'Diagnóstico' | 'Procedimento';
  active?: boolean;
}
