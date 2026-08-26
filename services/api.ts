const BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.VITE_API_BASE_URL ||
  'https://rkbserver.onrender.com/api'
).replace(/\/+$/, '');

export interface CloudinaryMedia {
  url?: string;
  public_id?: string;
  alt?: string;
}

export interface HeroData {
  video_light?: CloudinaryMedia;
  video_dark?: CloudinaryMedia;
  poster?: CloudinaryMedia;
  about_image?: CloudinaryMedia;
  service_new_construction?: CloudinaryMedia;
  service_remodeling?: CloudinaryMedia;
  service_renovation?: CloudinaryMedia;
}

export interface AboutHeroData {
  portrait?: CloudinaryMedia;
  name?: string;
  role?: string;
  philosophy_quote?: string;
  philosophy_attr?: string;
}

export interface AboutLeadershipData {
  photo?: CloudinaryMedia;
  name?: string;
  role?: string;
  credentials?: string[];
  bio?: string;
}

export interface AboutData {
  hero: AboutHeroData;
  leadership: AboutLeadershipData;
}

export interface WorkPhoto {
  label?: string;
  url: string;
  public_id?: string;
  alt?: string;
}

export interface WorkItem {
  id: string;
  title: string;
  type: 'New Construction' | 'Remodeling' | 'Renovation';
  year: number;
  locality: string;
  district: string;
  description: string;
  thumbnail?: CloudinaryMedia;
  meta?: string;
  photos?: WorkPhoto[];
  order?: number;
  published?: boolean;
}

export interface WorksResponse {
  works: WorkItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

let pendingRequests = 0;
const idleListeners = new Set<() => void>();

function notifyIdleListeners() {
  if (pendingRequests === 0) {
    idleListeners.forEach((fn) => fn());
    idleListeners.clear();
  }
}

async function fetchJson<T>(endpoint: string): Promise<T> {
  pendingRequests++;
  const url = `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  try {
    const res = await fetch(url, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch from ${endpoint}: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } finally {
    pendingRequests = Math.max(0, pendingRequests - 1);
    notifyIdleListeners();
  }
}

export const siteApi = {
  /**
   * Returns a promise that resolves when all pending API requests have settled.
   */
  waitForIdle: (timeoutMs = 10000): Promise<void> => {
    if (pendingRequests === 0) return Promise.resolve();
    return new Promise((resolve) => {
      let resolved = false;
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          idleListeners.delete(listener);
          resolve();
        }
      }, timeoutMs);

      const listener = () => {
        if (!resolved && pendingRequests === 0) {
          resolved = true;
          clearTimeout(timeout);
          idleListeners.delete(listener);
          resolve();
        }
      };

      idleListeners.add(listener);
    });
  },

  getHero: async (): Promise<HeroData> => {
    try {
      const data = await fetchJson<{ hero?: HeroData } | HeroData>('/hero');
      return (data as { hero?: HeroData }).hero || (data as HeroData) || {};
    } catch (err) {
      console.warn('Could not fetch hero data from API, using defaults:', err);
      return {};
    }
  },

  getAbout: async (): Promise<AboutData | null> => {
    try {
      const data = await fetchJson<AboutData>('/about');
      return data;
    } catch (err) {
      console.warn('Could not fetch about data from API, using defaults:', err);
      return null;
    }
  },

  getWorks: async (): Promise<WorkItem[]> => {
    try {
      const data = await fetchJson<WorksResponse | WorkItem[]>('/works');
      if (Array.isArray(data)) {
        return data;
      }
      return data.works || [];
    } catch (err) {
      console.warn('Could not fetch works from API, using defaults:', err);
      return [];
    }
  },

  getWorkBySlug: async (slug: string): Promise<WorkItem | null> => {
    try {
      const data = await fetchJson<{ work?: WorkItem } | WorkItem>(`/works/${slug}`);
      return (data as { work?: WorkItem }).work || (data as WorkItem) || null;
    } catch (err) {
      console.warn(`Could not fetch work "${slug}" from API:`, err);
      return null;
    }
  },
};
