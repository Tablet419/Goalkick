import { PredictionOption } from "./types";

export const PREDICTION_MARKETS: PredictionOption[] = [
  'Home win',
  'Away win',
  'Home or Draw',
  'Away or Draw',
  'Over 1.5 Goals',
  'Over 2.5 Goals',
  'Under 3.5 Goals',
  'Home win either Half',
  'Away win Either Half',
  'Both teams to Score',
  'First Half 0-0'
];

export const MAX_MATCHES = 4;

export const MOCK_LOADING_STEPS = [
  "Connecting to live sports data feeds...",
  "Analyzing Head-to-Head records...",
  "Evaluating recent team form and injuries...",
  "Simulating match outcomes 10,000 times...",
  "Finalizing high-confidence selections..."
];