export interface Prediction {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  matchTime: string;
  predictionMarket: string;
  confidence: number;
  reasoning: string;
  h2hSummary: string;
  standingsSummary: string;
  groundingUrls: string[];
}

export enum PredictionState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface MatchInput {
  id: string;
  homeTeam: string;
  awayTeam: string;
}

export type PredictionOption = 
  | 'Home win'
  | 'Away win'
  | 'Home or Draw'
  | 'Away or Draw'
  | 'Over 1.5 Goals'
  | 'Over 2.5 Goals'
  | 'Under 3.5 Goals'
  | 'Home win either Half'
  | 'Away win Either Half'
  | 'Both teams to Score'
  | 'First Half 0-0';
