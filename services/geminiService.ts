import { GoogleGenAI } from "@google/genai";
import { Prediction } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are 'GoalKick AI', a world-class professional soccer analyst and bettor with a historical accuracy of 95%. 
Your task is to analyze soccer matches based on REAL-TIME data including current standings, head-to-head (H2H) records, team form, and injuries.

RULES:
1. You must select exactly 4 high-value matches if the user does not provide specific ones. If the user provides matches, analyze those (up to 4).
2. For each match, you MUST select the single best prediction from this list: 
   [Home win, Away win, Home or Draw, Away or Draw, Over 1.5 Goals, Over 2.5 Goals, Under 3.5 Goals, Home win either Half, Away win Either Half, Both teams to Score, First Half 0-0].
3. You must use Google Search to find the latest stats.
4. Your reasoning must be thorough, citing specific recent results and standing positions.
5. You must output the result in a strict custom format for parsing.

OUTPUT FORMAT:
For each match, output a block like this:
||MATCH_START||
LEAGUE: [League Name]
TEAMS: [Home Team] vs [Away Team]
TIME: [Match Time/Date]
PREDICTION: [Selected Option from List]
CONFIDENCE: [Number between 75 and 99]
REASONING: [2-3 sentences explaining the choice based on form and stats]
H2H: [Summary of last 5 meetings]
STANDINGS: [Brief summary of league positions]
||MATCH_END||

Do not add markdown formatting like bolding or italics inside the fields. Keep it plain text within the blocks.
`;

export const generatePredictions = async (customMatches: string[] = []): Promise<Prediction[]> => {
  let userPrompt = "";

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (customMatches.length > 0) {
    userPrompt = `Today is ${today}. Analyze these specific matches and give me the best prediction for each:\n${customMatches.map((m, i) => `${i + 1}. ${m}`).join('\n')}`;
  } else {
    userPrompt = `Today is ${today}. Find the 4 best, high-confidence soccer matches playing today (or tomorrow if today's schedule is sparse) from major leagues (Premier League, La Liga, Serie A, Bundesliga, Champions League, or other top tier leagues). Analyze them and provide predictions.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        temperature: 0.4,
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract URLs from grounding metadata
    const urls = groundingChunks
      .map(chunk => chunk.web?.uri)
      .filter((uri): uri is string => !!uri);

    return parsePredictions(text, urls);

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate predictions. Please try again.");
  }
};

export const generateZeroZeroPredictions = async (): Promise<Prediction[]> => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  // Specific prompt for 0-0 HT
  const userPrompt = `Today is ${today}. I need 3-4 matches with the HIGHEST probability of ending 0-0 at Half Time (Correct Score First Half 0-0). 
  Look for:
  1. Teams with strong defenses and weak attacks.
  2. Matches expected to be tactical and cagey (e.g., derbies, bottom table clashes, or defensive managers).
  3. High frequency of 0-0 halftime scores in their last 5 games.
  
  Find these matches from major leagues globally.
  PREDICTION field MUST be 'First Half 0-0'.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        temperature: 0.3, // Lower temperature for stricter adherence to the specific criteria
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls = groundingChunks.map(chunk => chunk.web?.uri).filter((uri): uri is string => !!uri);

    return parsePredictions(text, urls);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate 0-0 predictions.");
  }
};

const parsePredictions = (text: string, globalUrls: string[]): Prediction[] => {
  const predictions: Prediction[] = [];
  const matchBlocks = text.split('||MATCH_START||');

  matchBlocks.forEach((block) => {
    if (!block.includes('||MATCH_END||')) return;

    const content = block.split('||MATCH_END||')[0];
    
    const getField = (tag: string) => {
      const regex = new RegExp(`${tag}:\\s*(.*)`, 'i');
      const match = content.match(regex);
      return match ? match[1].trim() : "N/A";
    };

    const league = getField('LEAGUE');
    const teamsRaw = getField('TEAMS');
    const [homeTeam, awayTeam] = teamsRaw.includes(' vs ') ? teamsRaw.split(' vs ') : [teamsRaw, ''];
    const time = getField('TIME');
    const predictionMarket = getField('PREDICTION');
    const confidenceStr = getField('CONFIDENCE');
    const confidence = parseInt(confidenceStr.replace('%', '')) || 85;
    const reasoning = getField('REASONING');
    const h2h = getField('H2H');
    const standings = getField('STANDINGS');

    if (homeTeam && predictionMarket !== "N/A") {
      predictions.push({
        id: crypto.randomUUID(),
        league,
        homeTeam,
        awayTeam,
        matchTime: time,
        predictionMarket,
        confidence,
        reasoning,
        h2hSummary: h2h,
        standingsSummary: standings,
        groundingUrls: globalUrls.slice(0, 3) 
      });
    }
  });

  return predictions;
};
