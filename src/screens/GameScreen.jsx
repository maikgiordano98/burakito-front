import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';

export default function GameScreen({ gameId, teams, onAddRound, onFinish }) {
  const [score, setScore] = useState({ teamATotal: 0, teamBTotal: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const fetchScore = async () => {
      setIsLoading(true);
      try {
        const data = await apiFetch(`/games/${gameId}/score`);
        setScore(data);
      } catch (error) {
        console.error("Error al obtener puntaje:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchScore();
  }, [gameId]);

  const handleAddRound = () => {
    setIsNavigating(true);
    // Un pequeño delay para que se vea el feedback visual antes de cambiar de pantalla
    setTimeout(() => {
        onAddRound();
    }, 150);
  };

  return (
    <div className="space-y-8 py-6 animate-in fade-in duration-500">
      {/* Tablero de Puntajes */}
      <div className="grid grid-cols-2 gap-px bg-slate-800 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
        {isLoading && (
          <div className="absolute inset-0 bg-[#1e293b]/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <div className="bg-[#1e293b] p-8 text-center">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-2">{teams.teamA}</p>
          <p className={`text-6xl font-mono font-black transition-all ${isLoading ? 'blur-sm opacity-50' : 'text-white'}`}>
            {score.teamATotal}
          </p>
        </div>
        
        <div className="bg-[#1e293b] p-8 text-center border-l border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-2">{teams.teamB}</p>
          <p className={`text-6xl font-mono font-black transition-all ${isLoading ? 'blur-sm opacity-50' : 'text-amber-500'}`}>
            {score.teamBTotal}
          </p>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="space-y-3">
        <button 
          onClick={handleAddRound}
          disabled={isLoading || isNavigating}
          className={`w-full font-black py-6 rounded-2xl transition-all flex items-center justify-center gap-3 border ${
            isNavigating || isLoading
            ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-white/5 border-white/10 hover:bg-white/10 text-white active:scale-[0.98]'
          }`}
        >
          {isNavigating ? (
            <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span className="text-xl">+</span>
          )}
          <span className="tracking-widest uppercase text-sm">
            {isNavigating ? 'Cargando...' : 'Sumar Ronda'}
          </span>
        </button>

        <button 
          onClick={onFinish}
          disabled={isLoading || isNavigating}
          className="w-full text-slate-500 text-[10px] font-black uppercase tracking-widest py-4 hover:text-red-400 transition-colors disabled:opacity-30"
        >
          Finalizar Partida
        </button>
      </div>

      {isLoading && (
        <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-tighter animate-pulse">
          Cargando...
        </p>
      )}
    </div>
  );
}