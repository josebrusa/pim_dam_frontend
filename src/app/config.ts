const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

function shouldUseConfiguredApiUrl() {
  if (!configuredApiUrl) return false;
  if (!import.meta.env.PROD) return true;
  if (typeof window === 'undefined') return true;

  const currentHostname = window.location.hostname;
  const isLocalhost = ['localhost', '127.0.0.1'].includes(currentHostname);

  if (isLocalhost) {
    return true;
  }

  try {
    const configuredUrl = new URL(configuredApiUrl, window.location.origin);

    if (!configuredUrl.host) {
      return true;
    }

    // In production we prefer the frontend same-origin /api proxy
    // unless the configured API stays on the same host.
    return configuredUrl.hostname === currentHostname;
  } catch {
    return true;
  }
}

export const appConfig = {
  apiUrl: shouldUseConfiguredApiUrl()
    ? configuredApiUrl!
    : import.meta.env.PROD
      ? '/api/v1'
      : 'http://localhost:3000/api/v1',
  appName: 'Lumify PIM',
} as const;
