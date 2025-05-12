interface User {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Job {
  jobId: string;
  clientId: string;
  title: string;
  budget: number;
  status: string;
}

export interface Rating {
  ratingId: string;
  jobId: string;
  userId: string;
  user: User;
  job: Job;
  score: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReview {
  jobId: string;
  userId: string;
  score: string;
  comment: string;
}
