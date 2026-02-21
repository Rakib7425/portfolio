import apiClient from './client';

export const RESUME_DOWNLOAD_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/public/profile/resume`;

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  photoUrl?: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  order: number;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  technologies?: string[];
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDesc?: string;
  imageUrl: string;
  technologies?: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Public API endpoints
export const publicApi = {
  // Get developer profile
  getProfile: async (): Promise<Profile> => {
    const response = await apiClient.get<ApiResponse<Profile>>('/public/profile');
    return response.data.data;
  },

  // Get all skills
  getSkills: async (): Promise<Skill[]> => {
    const response = await apiClient.get<ApiResponse<Skill[]>>('/public/skills');
    return response.data.data;
  },

  // Get work experiences
  getExperiences: async (): Promise<Experience[]> => {
    const response = await apiClient.get<ApiResponse<Experience[]>>('/public/experience');
    return response.data.data;
  },

  // Get all projects
  getProjects: async (featured?: boolean): Promise<Project[]> => {
    const params = featured !== undefined ? { featured } : {};
    const response = await apiClient.get<ApiResponse<Project[]>>('/public/projects', { params });
    return response.data.data;
  },

  // Get single project
  getProject: async (id: string): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<Project>>(`/public/projects/${id}`);
    return response.data.data;
  },

  // Submit contact form
  submitContact: async (data: ContactFormData): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('/public/contact', data);
  },

  // Track page view
  trackPageView: async (page: string): Promise<void> => {
    await apiClient.post('/public/analytics/view', { page });
  },

  // Subscribe to newsletter
  subscribeNewsletter: async (email: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/public/subscribe', { email });
    return response.data;
  },
};
