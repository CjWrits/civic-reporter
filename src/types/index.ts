export interface Issue {
  id: string;
  title: string;
  description: string;
  photo?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'submitted' | 'in_progress' | 'completed';
  category: string;
  timestamp: number;
  createdAt: string;
  address?: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}