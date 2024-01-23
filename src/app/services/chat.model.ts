import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
export interface Chat {
    createdAt: Date | Timestamp;
    id: string;
    from: string;
    msg: string;
    fromName: string;
    myMsg: boolean;
    toName?: string;
    users: string[];
  }
