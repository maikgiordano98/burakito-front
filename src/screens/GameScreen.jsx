import { useEffect, useState } from 'react';

export default function GameScreen({ gameId, teams, onAddRound, onFinish }) {
  const [score, setScore] = useState({ teamATotal: 0, teamBTotal: 0 });

  useEffect(() => {
    const fetchScore = async () => {
      const res = await fetch(`http://localhost:8080/games/${gameId}/score`);
      const data = await res.json();
      setScore(data);
    };
    fetchScore();
  }, [gameId]);

  return (
    <div className="space-y-8 py-6">
      <div className="grid grid-cols-2 gap-px bg-slate-800 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="bg-[#1e293b] p-8 text-center">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-2">{teams.teamA}</p>
          <p className="text-6xl font-mono font-black text-white">{score.teamATotal}</p>
        </div>
        <div className="bg-[#1e293b] p-8 text-center border-l border-slate-800">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-2">{teams.teamB}</p>
          <p className="text-6xl font-mono font-black text-amber-500">{score.teamBTotal}</p>
        </div>
      </div>

      <div className="space-y-3">
        <button 
          onClick={onAddRound}
          className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-5 rounded-2xl transition-all"
        >
          + SUMAR RONDA
        </button>
        <button 
          onClick={onFinish}
          className="w-full text-slate-500 text-sm font-medium py-2"
        >
          Finalizar Partida
        </button>
      </div>
    </div>
  );
}