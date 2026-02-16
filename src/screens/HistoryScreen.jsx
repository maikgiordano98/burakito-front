import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';

export default function HistoryScreen({ onBack, onResumeGame }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumingId, setResumingId] = useState(null); // Para saber qué partida se está retomando

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiFetch('/games');
        
        // Ordenamos por fecha de creación (más reciente arriba)
        const sortedGames = data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setGames(sortedGames);
      } catch (error) {
        console.error("Error cargando historial", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleResume = async (game) => {
    if (resumingId) return; // Evita múltiples clics
    setResumingId(game.id);
    
    // Simulamos un pequeño delay de feedback o esperamos a que el router esté listo
    setTimeout(() => {
      onResumeGame(game.id, game.teamA, game.teamB);
    }, 200);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }) + " hs";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-black text-white italic tracking-tighter">HISTORIAL</h2>
        <button 
          onClick={onBack} 
          disabled={!!resumingId}
          className="text-amber-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors disabled:opacity-30"
        >
          Cerrar
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Buscando partidas...</p>
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-3xl">
          No hay partidas registradas aún.
        </div>
      ) : (
        <div className="grid gap-4">
          {games.map((game) => (
            <div 
              key={game.id} 
              className={`bg-[#1e293b]/40 border rounded-3xl p-6 transition-all group relative overflow-hidden ${
                resumingId === game.id ? 'border-amber-500' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="absolute top-0 right-0 bg-slate-800 px-4 py-1 rounded-bl-xl text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                {formatDate(game.createdAt)}
              </div>

              <div className="flex justify-between items-center mt-2 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-slate-500 shadow-[0_0_8px_rgba(100,116,139,0.5)]"></span>
                    <p className="text-sm font-black text-white uppercase tracking-tight">{game.teamA}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
                    <p className="text-sm font-black text-white uppercase tracking-tight">{game.teamB}</p>
                  </div>
                </div>
                
                <div className="text-right bg-[#0f172a] p-3 rounded-2xl border border-slate-800">
                  <p className="text-[9px] text-slate-500 uppercase font-black mb-1 tracking-widest">Total</p>
                  <div className="flex gap-3 font-mono font-black text-2xl leading-none">
                    <span className="text-white">{game.totalPointsA ?? 0}</span>
                    <span className="text-slate-700 italic">/</span>
                    <span className="text-amber-500">{game.totalPointsB ?? 0}</span>
                  </div>
                </div>
              </div>

              {game.finished ? (
                <div className="w-full py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                  <span className="text-emerald-500 text-[10px] font-black tracking-[0.3em] uppercase">
                    🏆 Finalizada
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => handleResume(game)}
                  disabled={!!resumingId}
                  className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border ${
                    resumingId === game.id
                      ? 'bg-amber-500 text-black border-amber-500'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  } disabled:opacity-50`}
                >
                  {resumingId === game.id && (
                    <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {resumingId === game.id ? 'Abriendo...' : 'Retomar Partida'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}