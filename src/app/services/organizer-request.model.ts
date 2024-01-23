export interface OrganizerRequest {
  docId?: string;
  firstName: string;
  lastName: string;
  uid: string;
  title: string;
  email: string;
  terrainId: string;
  companyNumber?: string;
  companyName?: string;
  terrainName: string;
  terrainAddress: string;
  terrainPhone: string;
  terrainEmail: string;
  terrainWebsite?: string;
  terrainDescription: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  adminId?: string;
}
