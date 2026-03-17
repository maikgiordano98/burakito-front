import { recalculateGameTotals } from '../lib/scoreUtils';

const STORAGE_KEY = 'burakito_games';

function readGames() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeGames(games) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

export function getAllGames() {
  const games = readGames();
  return games
    .map(recalculateGameTotals)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getGameById(id) {
  const games = readGames();
  const game = games.find((g) => g.id === id);
  if (!game) return null;
  return recalculateGameTotals(game);
}

export function createGame(teamA, teamB) {
  const games = readGames();
  const game = {
    id: crypto.randomUUID(),
    teamA,
    teamB,
    createdAt: new Date().toISOString(),
    totalPointsA: 0,
    totalPointsB: 0,
    finished: false,
    rounds: [],
  };
  games.push(game);
  writeGames(games);
  return recalculateGameTotals(game);
}

export function addRound(gameId, roundPayload) {
  const games = readGames();
  const index = games.findIndex((g) => g.id === gameId);
  if (index === -1) return null;
  const round = {
    teamAPoints: roundPayload.teamAPoints ?? 0,
    teamBPoints: roundPayload.teamBPoints ?? 0,
    teamACanastasPuras: roundPayload.teamACanastasPuras ?? 0,
    teamBCanastasPuras: roundPayload.teamBCanastasPuras ?? 0,
    teamACanastasImpuras: roundPayload.teamACanastasImpuras ?? 0,
    teamBCanastasImpuras: roundPayload.teamBCanastasImpuras ?? 0,
    teamALevantoMuerto: Boolean(roundPayload.teamALevantoMuerto),
    teamBLevantoMuerto: Boolean(roundPayload.teamBLevantoMuerto),
    teamACorto: Boolean(roundPayload.teamACorto),
    teamBCorto: Boolean(roundPayload.teamBCorto),
  };
  games[index].rounds = games[index].rounds || [];
  games[index].rounds.push(round);
  writeGames(games);
  return {};
}

export function deleteGame(gameId) {
  const games = readGames().filter((g) => g.id !== gameId);
  writeGames(games);
  return {};
}

export function finishGame(gameId) {
  const games = readGames();
  const index = games.findIndex((g) => g.id === gameId);
  if (index === -1) return {};
  const recalculated = recalculateGameTotals(games[index]);
  games[index] = {
    ...recalculated,
    finished: true,
    rounds: [],
  };
  writeGames(games);
  return {};
}
