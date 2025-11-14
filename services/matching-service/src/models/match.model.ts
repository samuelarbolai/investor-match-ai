export interface Match {
  id: string;
  contactId: string;
  matchedContactId: string;
  score: number;
  createdAt: Date;
}

export interface MatchRequest {
  contactId: string;
  limit?: number;
}
