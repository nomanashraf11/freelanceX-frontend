interface Contract {
  contractId: string;
  status: string;
}

interface Escrow {
  escrowId: string;
  paymentId: string;
  status: string;
  payment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  paymentId: string;
  contractId: string;
  contract: Contract;
  escrow: Escrow;
  amount: number;
  createdAt: string;
  updatedAt: string;
}