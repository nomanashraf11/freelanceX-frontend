export interface ContractCreate {
  bidId: string;
  jobId: string;
  terms: string;
}

export interface Contract {
  contractId: string;
  bidId: string;
  jobId: string;
  bid: {
    bidId: string;
    freelancerId: string;
    amount: number;
  };
  job: {
    jobId: string;
    title: string;
    budget: number;
    clientId: string;
    status: "OPEN" | "CLOSED";
  };
  terms: string;
  status: "ACTIVE" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}
