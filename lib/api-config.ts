const getFullUrl = (url: string | undefined, defaultUrl: string) => {
  if (!url) return defaultUrl;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

export const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : getFullUrl(process.env.NEXT_PUBLIC_API_URL, 'http://localhost:5000/api').replace(/\/api$/, '') + '/api';

export const SOCKET_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : getFullUrl(process.env.NEXT_PUBLIC_SOCKET_URL, 'http://localhost:5000');
