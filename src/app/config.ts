export const appConfig = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1',
  appName: 'Lumify PIM',
} as const;
