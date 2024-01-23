import { Timestamp } from 'firebase/firestore';
export interface User {
  docId?: string;
  uid: string;
  role: string;
  email: string;
  firstName?: string;
  lastName?: string;
  sex?: string;
  phone?: string;
  birthDate?: Timestamp;
  displayName: string;
  photoURL?: string;
  favoriteEvents?: string[];
  isOrganizer: boolean;
  isManager: boolean;
  status?: string;
  terrainId?: string;
  companyId?: string;
}

export interface Score {
  docId?: string;
  eventId: string;
  userId: string;
  score: number;
}
