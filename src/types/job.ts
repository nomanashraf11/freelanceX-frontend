export interface Client {
  firstName: string;
  lastName: string;
}
export interface JobUpdate {
  title?: string;
  description?: string;
  budget?: number;
  location?: string;
  status?: "OPEN" | "CLOSED" | "IN_PROGRESS";
}
export interface Job {
  jobId: string;
  title: string;
  location: string;
  description: string;
  clientId: string;
  client: Client;
  status: "OPEN" | "CLOSED";
  budget: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobCreate {
  clientId: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  status: "OPEN" | "CLOSED";
}
