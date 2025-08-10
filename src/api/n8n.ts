export interface N8nApiJobApplication {
  jobTitle: string;
  company: string;
  dateApplied: string; // e.g. "2025-08-07"
  dateAdded: string;   // e.g. "2025-08-07"
}

export interface N8nApiResponse {
  applications: N8nApiJobApplication[];
  count: number;
  timestamp: string;
}

const BASE_URL = import.meta.env.VITE_N8N_BASE_URL || 'https://primary-production-4915a.up.railway.app';
const SCAN_URL =
  (import.meta.env.VITE_N8N_SCAN_URL as string | undefined)
    || `${BASE_URL}/webhook/scan`;
const APPLICATIONS_URL =
  (import.meta.env.VITE_N8N_APPS_URL as string | undefined)
    || `${BASE_URL}/webhook/applications`;
const WEBHOOK_SECRET = import.meta.env.VITE_WEBHOOK_SECRET as string;

function buildHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (WEBHOOK_SECRET) {
    headers['x-webhook-secret'] = WEBHOOK_SECRET;
  }
  return headers;
}

export async function triggerScan(body?: Record<string, unknown>): Promise<{ count?: number } | undefined> {
  const response = await fetch(SCAN_URL, {
    method: 'POST',
    headers: buildHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) return undefined;
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

export async function fetchApplications(): Promise<N8nApiResponse | undefined> {
  const response = await fetch(APPLICATIONS_URL, {
    method: 'GET',
    headers: buildHeaders(),
  });
  if (!response.ok) return undefined;
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}


