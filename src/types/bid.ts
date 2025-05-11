export interface Bid {
  bidId: string;
  jobId: string;
  freelancerId: string;
  amount: number;
  proposal: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BidCreate {
  jobId: string;
  freelancerId: string;
  amount: number;
  proposal: string;
}
