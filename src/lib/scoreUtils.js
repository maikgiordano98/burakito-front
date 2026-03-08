/**
 * Cálculo de puntaje por ronda (réplica exacta del backend Java Round.getTeamAScore / getTeamBScore).
 * Reglas: canastas puras × 200, impuras × 100; si canastas === 0 y puntos > 0 → fichas = -puntos;
 * muerto no levantado = -100; corto = +100.
 */

export function getTeamAScore(round) {
  const canastasPuras = Number(round.teamACanastasPuras) || 0;
  const canastasImpuras = Number(round.teamACanastasImpuras) || 0;
  const points = Number(round.teamAPoints) || 0;
  const levantoMuerto = round.teamALevantoMuerto === true;
  const corto = round.teamACorto === true;

  const canastas = canastasPuras * 200 + canastasImpuras * 100;
  let fichasProcesadas = points;
  if (canastas === 0 && points > 0) fichasProcesadas = -points;
  const penalizacionMuerto = levantoMuerto ? 0 : -100;
  const bonusCorte = corto ? 100 : 0;

  return canastas + fichasProcesadas + penalizacionMuerto + bonusCorte;
}

export function getTeamBScore(round) {
  const canastasPuras = Number(round.teamBCanastasPuras) || 0;
  const canastasImpuras = Number(round.teamBCanastasImpuras) || 0;
  const points = Number(round.teamBPoints) || 0;
  const levantoMuerto = round.teamBLevantoMuerto === true;
  const corto = round.teamBCorto === true;

  const canastas = canastasPuras * 200 + canastasImpuras * 100;
  let fichasProcesadas = points;
  if (canastas === 0 && points > 0) fichasProcesadas = -points;
  const penalizacionMuerto = levantoMuerto ? 0 : -100;
  const bonusCorte = corto ? 100 : 0;

  return canastas + fichasProcesadas + penalizacionMuerto + bonusCorte;
}

const WINNING_SCORE = 3000;

export function recalculateGameTotals(game) {
  const rounds = game.rounds || [];
  const totalPointsA = rounds.reduce((sum, r) => sum + getTeamAScore(r), 0);
  const totalPointsB = rounds.reduce((sum, r) => sum + getTeamBScore(r), 0);
  const finished = totalPointsA >= WINNING_SCORE || totalPointsB >= WINNING_SCORE;
  return {
    ...game,
    totalPointsA,
    totalPointsB,
    finished,
    rounds: rounds.map((r) => ({
      ...r,
      teamAScore: getTeamAScore(r),
      teamBScore: getTeamBScore(r),
    })),
  };
}
