import { Timestamp } from 'firebase-admin/firestore';
import { IntroStage } from './introduction.model';

export interface ExperienceNode {
  id: string;
  contact_id: string;
  company_id: string;
  company_name: string;
  role: string;
  seniority: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string | null;
  location_city: string | null;
  location_country: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}
