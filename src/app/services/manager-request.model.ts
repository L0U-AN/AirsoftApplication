export interface ManagerRequest {
    docId?: string;
    firstName: string;
    lastName: string;
    uid: string;
    title: string;
    email: string;
    companyId: string;
    companyNumber: string;
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyEmail: string;
    companyWebsite?: string;
    companyDescription: string;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
    adminId?: string;
  }
