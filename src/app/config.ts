const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const isBrowserLocalhost = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
const pointsToLocalhost = configuredApiUrl
  ? configuredApiUrl.includes('localhost') || configuredApiUrl.includes('127.0.0.1')
  : false;

export const appConfig = {
  apiUrl:
    configuredApiUrl && (!import.meta.env.PROD || !pointsToLocalhost || isBrowserLocalhost)
      ? configuredApiUrl
      : import.meta.env.PROD
        ? '/api/v1'
        : 'http://localhost:3000/api/v1',
  appName: 'Lumify PIM',
} as const;
