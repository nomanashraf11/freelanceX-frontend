export interface Job {
  jobId: string;
  title: string;
  location: string;
  description: string;
  clientId: string;
  status: "OPEN" | "CLOSED";
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
