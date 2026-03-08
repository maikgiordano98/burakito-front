import { supabase } from '../lib/supabaseClient';
import { recalculateGameTotals, getTeamAScore, getTeamBScore } from '../lib/scoreUtils';

const WINNING_SCORE = 3000;

function roundRowToApp(row) {
  return {
    teamAPoints: row.team_a_points ?? 0,
    teamBPoints: row.team_b_points ?? 0,
    teamACanastasPuras: row.team_a_canastas_puras ?? 0,
    teamBCanastasPuras: row.team_b_canastas_puras ?? 0,
    teamACanastasImpuras: row.team_a_canastas_impuras ?? 0,
    teamBCanastasImpuras: row.team_b_canastas_impuras ?? 0,
    teamALevantoMuerto: Boolean(row.team_a_levanto_muerto),
    teamBLevantoMuerto: Boolean(row.team_b_levanto_muerto),
    teamACorto: Boolean(row.team_a_corto),
    teamBCorto: Boolean(row.team_b_corto),
  };
}

function roundAppToRow(payload, gameId) {
  return {
    game_id: gameId,
    team_a_points: Number(payload.teamAPoints) || 0,
    team_b_points: Number(payload.teamBPoints) || 0,
    team_a_canastas_puras: Number(payload.teamACanastasPuras) || 0,
    team_b_canastas_puras: Number(payload.teamBCanastasPuras) || 0,
    team_a_canastas_impuras: Number(payload.teamACanastasImpuras) || 0,
    team_b_canastas_impuras: Number(payload.teamBCanastasImpuras) || 0,
    team_a_levanto_muerto: Boolean(payload.teamALevantoMuerto),
    team_b_levanto_muerto: Boolean(payload.teamBLevantoMuerto),
    team_a_corto: Boolean(payload.teamACorto),
    team_b_corto: Boolean(payload.teamBCorto),
  };
}

/** Partida para la app: si está finished, usa totales de la fila y rounds vacío; si no, recalcula desde rondas. */
function gameRowToApp(row, rounds = []) {
  const finished = Boolean(row.finished);
  if (finished) {
    return {
      id: row.id,
      teamA: row.team_a ?? '',
      teamB: row.team_b ?? '',
      createdAt: row.created_at,
      totalPointsA: row.total_points_a ?? 0,
      totalPointsB: row.total_points_b ?? 0,
      finished: true,
      rounds: [],
    };
  }
  const game = {
    id: row.id,
    teamA: row.team_a ?? '',
    teamB: row.team_b ?? '',
    createdAt: row.created_at,
    totalPointsA: row.total_points_a ?? 0,
    totalPointsB: row.total_points_b ?? 0,
    finished: false,
    rounds: rounds.map(roundRowToApp),
  };
  return recalculateGameTotals(game);
}

export async function getAllGames() {
  const { data: gamesRows, error: gamesError } = await supabase
    .from('games')
    .select('*')
    .order('created_at', { ascending: false });

  if (gamesError) throw gamesError;
  if (!gamesRows?.length) return [];

  const unfinishedIds = gamesRows.filter((r) => !r.finished).map((r) => r.id);
  let roundsByGame = {};
  if (unfinishedIds.length > 0) {
    const { data: roundsRows, error: roundsError } = await supabase
      .from('rounds')
      .select('*')
      .in('game_id', unfinishedIds);
    if (roundsError) throw roundsError;
    (roundsRows || []).forEach((r) => {
      if (!roundsByGame[r.game_id]) roundsByGame[r.game_id] = [];
      roundsByGame[r.game_id].push(r);
    });
  }

  return gamesRows.map((row) => gameRowToApp(row, roundsByGame[row.id] || []));
}

export async function getGameById(id) {
  const { data: row, error: gameError } = await supabase
    .from('games')
    .select('*')
    .eq('id', id)
    .single();

  if (gameError || !row) return null;

  if (row.finished) return gameRowToApp(row, []);

  const { data: roundsRows, error: roundsError } = await supabase
    .from('rounds')
    .select('*')
    .eq('game_id', id)
    .order('id', { ascending: true });

  if (roundsError) throw roundsError;
  return gameRowToApp(row, roundsRows || []);
}

export async function createGame(teamA, teamB) {
  const { data: row, error } = await supabase
    .from('games')
    .insert({
      team_a: teamA || '',
      team_b: teamB || '',
    })
    .select()
    .single();

  if (error) throw error;
  return gameRowToApp(row, []);
}

export async function addRound(gameId, roundPayload) {
  const row = roundAppToRow(roundPayload, gameId);
  const { error: insertError } = await supabase.from('rounds').insert(row);
  if (insertError) throw insertError;

  const { data: roundsRows, error: roundsError } = await supabase
    .from('rounds')
    .select('*')
    .eq('game_id', gameId)
    .order('id', { ascending: true });
  if (roundsError) throw roundsError;

  const rounds = (roundsRows || []).map(roundRowToApp);
  const totalPointsA = rounds.reduce((s, r) => s + getTeamAScore(r), 0);
  const totalPointsB = rounds.reduce((s, r) => s + getTeamBScore(r), 0);
  const finished = totalPointsA >= WINNING_SCORE || totalPointsB >= WINNING_SCORE;

  const { error: updateError } = await supabase
    .from('games')
    .update({
      total_points_a: totalPointsA,
      total_points_b: totalPointsB,
      finished,
    })
    .eq('id', gameId);
  if (updateError) throw updateError;

  if (finished) {
    const { error: deleteError } = await supabase.from('rounds').delete().eq('game_id', gameId);
    if (deleteError) throw deleteError;
  }

  return {};
}

export async function deleteGame(gameId) {
  const { error } = await supabase.from('games').delete().eq('id', gameId);
  if (error) throw error;
  return {};
}
