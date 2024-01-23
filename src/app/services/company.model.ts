import { Timestamp } from 'firebase/firestore';
export interface Company {
  docId?: string;
  companyId: string;
  name: string;
  companyNumber: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  status: string;
  createdDate: Timestamp | Date;
  createdBy: string;
  updatedDate: Timestamp | Date;
}
