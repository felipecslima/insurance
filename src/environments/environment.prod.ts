import { config } from 'config';

export const environment = {
  production: true,
  apiUrl: config.apiUrl,
  color: {
    primary: '#234711',
    textPrimary: '#fff',
    secondary: 'rgba(0, 0 ,0, 56)',
  },
};
