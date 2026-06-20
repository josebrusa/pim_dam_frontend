export const appConfig = {
  apiUrl: import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '/api/v1' : 'http://localhost:3000/api/v1'),
  appName: 'Lumify PIM',
} as const;
