export enum ScenarioType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP'
}

export enum Difficulty {
  NOVICE = 'NOVICE',
  INTERMEDIATE = 'INTERMEDIATE',
  EXPERT = 'EXPERT'
}

export interface Scenario {
  id: string;
  type: ScenarioType;
  sender: string;
  senderAddress: string;
  subject?: string;
  body: string;
  attachment?: string;
  redFlags: string[];
  safeFactors: string[];
  isPhishing: boolean;
  difficulty: Difficulty;
  explanation: string; // The "why" it is safe or phishing
}

export interface UserStats {
  elo: number;
  streak: number;
  scenariosCompleted: number;
  accuracy: number; // Percentage
  badges: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  EVALUATION = 'EVALUATION',
  DASHBOARD = 'DASHBOARD'
}
