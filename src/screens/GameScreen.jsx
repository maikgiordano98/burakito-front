import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';

export default function GameScreen({ gameId, onAddRound, onFinish }) {
  const [gameData, setGameData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showRounds, setShowRounds] = useState(false);

  const WINNING_SCORE = 3000;

  useEffect(() => {
    const fetchGame = async () => {
      setIsLoading(true);
      try {
        const data = await apiFetch(`/games/${gameId}`);
        setGameData(data);
      } catch (error) {
        console.error("Error al sincronizar con el servidor:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (gameId) fetchGame();
  }, [gameId]);

  if (!gameData && isLoading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Sincronizando...</p>
    </div>
  );

  if (!gameData) return null;

  const scoreA = gameData.totalPointsA || 0;
  const scoreB = gameData.totalPointsB || 0;
  const rounds = gameData.rounds || [];

  const roundsWithHistory = rounds.map((r, idx) => {
    const prevRounds = rounds.slice(0, idx);
    const partialA = prevRounds.reduce((sum, curr) => sum + curr.teamAScore, 0) + r.teamAScore;
    const partialB = prevRounds.reduce((sum, curr) => sum + curr.teamBScore, 0) + r.teamBScore;
    return { ...r, partialA, partialB };
  });

  const winner = scoreA >= WINNING_SCORE || scoreB >= WINNING_SCORE 
    ? (scoreA > scoreB ? gameData.teamA : gameData.teamB) 
    : null;

  return (
    <div className="space-y-8 py-6 animate-in fade-in duration-500">
      {winner && (
        <div className="fixed inset-0 z-[100] bg-[#020617]/95 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-[#1e293b] border-2 border-amber-500 p-10 rounded-[40px] w-full max-w-sm text-center space-y-6 animate-in zoom-in duration-300 shadow-2xl shadow-amber-500/20">
            <div className="text-7xl">🏆</div>
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">¡GANÓ {winner.toUpperCase()}!</h2>
            <div className="py-4 border-y border-slate-700 font-mono text-2xl text-amber-500">{scoreA} - {scoreB}</div>
            <button onClick={onFinish} className="w-full bg-amber-500 text-[#020617] font-black py-5 rounded-2xl uppercase tracking-widest active:scale-95 transition-transform">Nueva Partida</button>
          </div>
        </div>
      )}

      {/* Marcador Principal */}
      <div className="grid grid-cols-2 gap-px bg-slate-800 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="bg-[#1e293b] p-8 text-center">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">{gameData.teamA}</p>
          <p className="text-6xl font-mono font-black text-white">{scoreA}</p>
        </div>
        <div className="bg-[#1e293b] p-8 text-center border-l border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">{gameData.teamB}</p>
          <p className="text-6xl font-mono font-black text-amber-500">{scoreB}</p>
        </div>
      </div>

      <div className="space-y-3">
        {!winner && (
          <button 
            onClick={() => { setIsNavigating(true); setTimeout(onAddRound, 150); }}
            disabled={isLoading || isNavigating}
            className="w-full font-black py-6 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            {isNavigating ? <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div> : <span className="text-xl">+ SUMAR RONDA</span>}
          </button>
        )}

        <button onClick={() => setShowRounds(!showRounds)} className="w-full bg-[#1e293b] border border-slate-800 text-slate-400 font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest">
          {showRounds ? 'Ocultar Detalle' : 'Ver Rondas Detalladas'}
        </button>

        {showRounds && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            {[...roundsWithHistory].reverse().map((r, idx) => (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-slate-800/50 px-4 py-3 flex justify-between items-center border-b border-slate-800/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Ronda #{rounds.length - idx}</span>
                    <span className="text-[8px] font-bold text-amber-500/80 uppercase tracking-tighter">Parcial: {r.partialA} / {r.partialB}</span>
                  </div>
                  <div className="flex gap-4 font-mono font-black text-sm">
                    <span className={r.teamAScore < 0 ? 'text-red-500' : 'text-white'}>{r.teamAScore > 0 ? `+${r.teamAScore}` : r.teamAScore}</span>
                    <span className="text-slate-700">/</span>
                    <span className={r.teamBScore < 0 ? 'text-red-500' : 'text-amber-500'}>{r.teamBScore > 0 ? `+${r.teamBScore}` : r.teamBScore}</span>
                  </div>
                </div>

                <div className="p-4 grid grid-cols-2 gap-4 text-[9px] uppercase font-black tracking-tighter">
                  {/* DETALLES EQUIPO A */}
                  <div className="space-y-2 border-r border-slate-800/50 pr-3">
                    <div className="flex justify-between text-slate-500"><span>Puntos:</span> <span className="text-white">{r.teamAPoints}</span></div>
                    <div className="flex justify-between text-slate-500">
                      <span>Puras {r.teamACanastasPuras > 0 ? `(+${r.teamACanastasPuras * 200})` : ""}:</span> 
                      <span className="text-white">{r.teamACanastasPuras}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Impuras {r.teamACanastasImpuras > 0 ? `(+${r.teamACanastasImpuras * 100})` : ""}:</span> 
                      <span className="text-white">{r.teamACanastasImpuras}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800/30">
                      <span className="text-slate-500 italic">Muerto {r.teamALevantoMuerto ? "" : "(-100)"}:</span>
                      <span className={r.teamALevantoMuerto ? "text-emerald-500" : "text-red-500"}>{r.teamALevantoMuerto ? "SÍ" : "NO"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 italic">Corto {r.teamACorto ? "(+100)" : ""}:</span>
                      <span className={r.teamACorto ? "text-emerald-500" : "text-slate-700"}>{r.teamACorto ? "SÍ" : "NO"}</span>
                    </div>
                  </div>

                  {/* DETALLES EQUIPO B */}
                  <div className="space-y-2 pl-3">
                    <div className="flex justify-between text-slate-500"><span>Puntos:</span> <span className="text-amber-500">{r.teamBPoints}</span></div>
                    <div className="flex justify-between text-slate-500">
                      <span>Puras {r.teamBCanastasPuras > 0 ? `(+${r.teamBCanastasPuras * 200})` : ""}:</span> 
                      <span className="text-amber-500">{r.teamBCanastasPuras}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Impuras {r.teamBCanastasImpuras > 0 ? `(+${r.teamBCanastasImpuras * 100})` : ""}:</span> 
                      <span className="text-amber-500">{r.teamBCanastasImpuras}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800/30">
                      <span className="text-slate-400 italic">Muerto {r.teamBLevantoMuerto ? "" : "(-100)"}:</span>
                      <span className={r.teamBLevantoMuerto ? "text-emerald-500" : "text-red-500"}>{r.teamBLevantoMuerto ? "SÍ" : "NO"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 italic">Corto {r.teamBCorto ? "(+100)" : ""}:</span>
                      <span className={r.teamBCorto ? "text-emerald-500" : "text-slate-700"}>{r.teamBCorto ? "SÍ" : "NO"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => { if(window.confirm("¿Finalizar partida?")) onFinish() }} className="w-full text-slate-600 text-[10px] font-black uppercase tracking-widest py-4 hover:text-red-400 transition-colors">Finalizar Partida</button>
      </div>
    </div>
  );
}