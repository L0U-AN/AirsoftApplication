import { Timestamp } from 'firebase/firestore';

export interface Player {
  id?: string;
  uid: string;
  status: boolean;
  attendanceStatus?: 'present' | 'absent';
  created: Date | Timestamp;
  updated: Date | Timestamp;
  checkedIn: boolean;
  checkedInDate?: Date | Timestamp;
  checkOutDate?: Date | Timestamp;
}

export interface PlayerDetails {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  attendanceStatus?: 'present' | 'absent';
}

export interface Terrain {
  id?: string;
  availability: boolean;
  name: string;
  description: string;
  location: string;
  players: string[];
  availableFrom: Date | Timestamp;
  availableTo: Date | Timestamp;
  capacity: number;
  created: Date | Timestamp;
  updated: Date | Timestamp;
}

export interface Event {
  id?: string;
  terrainId: string;
  organizer: string[];
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  price: number;
  availableFrom: Date | Timestamp;
  availableTo: Date | Timestamp;
  terrains?: Terrain[];
  created: Date | Timestamp;
  updated: Date | Timestamp;
}
