import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';

export default function HistoryScreen({ onBack, onResumeGame }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Función para formatear la fecha de forma linda
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
        <button onClick={onBack} className="text-amber-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">Cerrar</button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 uppercase tracking-widest animate-pulse">Consultando base de datos...</div>
      ) : games.length === 0 ? (
        <div className="text-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-3xl">
          No hay partidas registradas aún.
        </div>
      ) : (
        <div className="grid gap-4">
          {games.map((game) => (
            <div 
              key={game.id} 
              className="bg-[#1e293b]/40 border border-slate-800 rounded-3xl p-6 hover:border-amber-500/30 transition-all group relative overflow-hidden"
            >
              {/* Indicador de Fecha */}
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
                    {/* Corregido: Usamos totalPointsA y totalPointsB según tu imagen de Postman */}
                    <span className="text-white">{game.totalPointsA ?? 0}</span>
                    <span className="text-slate-700 italic">/</span>
                    <span className="text-amber-500">{game.totalPointsB ?? 0}</span>
                  </div>
                      </div>
                  </div>

                  {game.finished ? (
                      <div className="w-full py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
                          <span className="text-amber-500 text-[10px] font-black tracking-[0.3em] uppercase">
                              🏆 GANÓ {game.totalPointsA > game.totalPointsB ? game.teamA : game.teamB}
                          </span>
                      </div>
                  ) : (
                      <button
                          onClick={() => onResumeGame(game.id, game.teamA, game.teamB)}
                          className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-amber-500 group-hover:text-black group-hover:border-amber-500 transition-all"
                      >
                          RETOMAR PARTIDA
                      </button>
                  )}
              </div>
          ))}
        </div>
      )}
    </div>
  );
}