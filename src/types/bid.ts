interface Freelancer {
  firstName: string;
  lastName: string;
}

interface Contract {
  contractId: string;
  bidId: string;
  jobId: string;
}

export interface Bid {
  bidId: string;
  jobId: string;
  freelancerId: string;
  amount: number;
  proposal: string;
  freelancer: Freelancer;
  contract: Contract;
  createdAt: Date;
  updatedAt: Date;
}

export interface BidCreate {
  jobId: string;
  freelancerId: string;
  amount: number;
  proposal: string;
}
