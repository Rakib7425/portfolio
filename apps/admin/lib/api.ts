const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_access_token');
};

export const setAccessToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_access_token', token);
  }
};

export const clearAccessToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_access_token');
  }
};

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data: T; message?: string }> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.message || json.error || `Request failed: ${res.status}`);
  }

  return json;
}

export interface PolicyPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const adminApi = {
  async getPolicyPages(): Promise<PolicyPage[]> {
    const res = await request<PolicyPage[]>('/admin/policy-pages');
    return res.data ?? [];
  },

  async getPolicyPage(slug: string): Promise<PolicyPage> {
    const res = await request<PolicyPage>(`/admin/policy-pages/${slug}`);
    return res.data;
  },

  async updatePolicyPage(
    slug: string,
    body: { title: string; content: string }
  ): Promise<PolicyPage> {
    const res = await request<PolicyPage>(`/admin/policy-pages/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return res.data;
  },
};
