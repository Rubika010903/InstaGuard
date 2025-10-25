export interface User {
  id: number;
  name: string;
  avatar: string;
}

export interface Post {
  id: string;
  userId: number;
  imageUrl: string;
  caption: string;
  timestamp: number;
  isTampered?: boolean;
  originalPostId?: string;
  analysis?: ForgeryAnalysis | null;
}

export interface Notification {
  id: string;
  message: string;
  postId: string; // ID of the tampered post
  read: boolean;
}

export interface ForgeryAnalysis {
  vaccinator: string;
  detector: string;
  recovery: string;
  assurance: string;
}

export type ScenarioStage = 
  | 'awaiting_alice_post' 
  | 'awaiting_bob_tamper' 
  | 'awaiting_alice_notification_check' 
  | 'complete';
