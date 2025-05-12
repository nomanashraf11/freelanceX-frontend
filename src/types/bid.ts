interface Freelancer {
  firstName: string;
  lastName: string;
}

interface Contract {
  contractId: string;
  bidId: string;
  jobId: string;
  status: "ACTIVE" | "COMPLETED";
}

interface Job {
  jobId: string;
  title: string;
  budget: number;
  clientId: string;
  status: "OPEN" | "CLOSED";
}

export interface Bid {
  bidId: string;
  jobId: string;
  freelancerId: string;
  amount: number;
  proposal: string;
  job: Job;
  freelancer: Freelancer;
  contract: Contract;
  createdAt: string;
  updatedAt: string;
}

export interface BidCreate {
  jobId: string;
  freelancerId: string;
  amount: number;
  proposal: string;
}
