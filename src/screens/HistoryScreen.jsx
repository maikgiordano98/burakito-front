import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';

export default function HistoryScreen({ onBack, onResumeGame }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumingId, setResumingId] = useState(null);
  
  // Estados para el borrado
  const [deleteId, setDeleteId] = useState(null); // ID de la partida a borrar
  const [isDeleting, setIsDeleting] = useState(false); // Estado de carga del borrado
  const [finishId, setFinishId] = useState(null); // ID de la partida a finalizar
  const [isFinishing, setIsFinishing] = useState(false); // Estado de carga al finalizar

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiFetch('/games');
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

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      await apiFetch(`/games/${deleteId}`, { method: 'DELETE' }); //
      setGames(prevGames => prevGames.filter(g => g.id !== deleteId)); //
      setDeleteId(null);
    } catch (error) {
      console.error("Error al borrar:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFinish = async () => {
    if (!finishId) return;
    
    setIsFinishing(true);
    try {
      await apiFetch(`/games/${finishId}/finish`, { method: 'POST' });
      setGames(prevGames =>
        prevGames.map(g =>
          g.id === finishId
            ? { ...g, finished: true }
            : g
        )
      );
      setFinishId(null);
    } catch (error) {
      console.error("Error al finalizar:", error);
    } finally {
      setIsFinishing(false);
    }
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 relative">
      
      {/* MODAL DE CONFIRMACIÓN DE BORRADO */}
      {deleteId && (
        <div className="fixed inset-0 z-[110] bg-[#020617]/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-[#1e293b] border border-slate-700 p-8 rounded-[32px] w-full max-w-xs text-center space-y-6 shadow-2xl animate-in zoom-in duration-200">
            <div className="text-4xl">🗑️</div>
            <div className="space-y-2">
              <h3 className="text-white font-black uppercase text-sm tracking-widest">¿Borrar partida?</h3>
              <p className="text-slate-400 text-[10px] leading-relaxed uppercase font-bold">
                Esta acción eliminará todos los puntos y rondas de forma permanente.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="py-3 rounded-xl bg-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="py-3 rounded-xl bg-red-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-colors flex items-center justify-center"
              >
                {isDeleting ? (
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : "Borrar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA FINALIZAR PARTIDA */}
      {finishId && (
        <div className="fixed inset-0 z-[110] bg-[#020617]/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-[#1e293b] border border-emerald-600/60 p-8 rounded-[32px] w-full max-w-xs text-center space-y-6 shadow-2xl animate-in zoom-in duration-200">
            <div className="text-4xl">🏁</div>
            <div className="space-y-2">
              <h3 className="text-white font-black uppercase text-sm tracking-widest">¿Finalizar partida?</h3>
              <p className="text-slate-300 text-[10px] leading-relaxed uppercase font-bold">
                Se tomará como resultado final el marcador actual y ganará el que más puntos tenga.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setFinishId(null)}
                disabled={isFinishing}
                className="py-3 rounded-xl bg-slate-800 text-slate-300 font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={handleFinish}
                disabled={isFinishing}
                className="py-3 rounded-xl bg-emerald-500 text-[#020617] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {isFinishing ? (
                  <div className="w-3 h-3 border-2 border-emerald-900/40 border-t-emerald-900 rounded-full animate-spin"></div>
                ) : "Finalizar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Historial</h2>
        <button onClick={onBack} className="text-amber-500 font-bold text-xs uppercase tracking-widest">Cerrar</button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-[10px] font-black uppercase">Buscando...</p>
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-3xl uppercase font-bold text-[10px]">
          No hay registros
        </div>
      ) : (
        <div className="grid gap-4">
          {games.map((game) => (
            <div key={game.id} className="bg-[#1e293b]/40 border border-slate-800 rounded-3xl p-6 relative group overflow-hidden">
              
              {/* HEADER DE LA TARJETA */}
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                  {formatDate(game.createdAt)}
                </span>
                
                {/* TACHITO DE BASURA */}
                <button
                  onClick={() => setDeleteId(game.id)}
                  className="text-slate-600 hover:text-red-500 transition-colors p-1"
                  title="Eliminar registro"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <p
                      className={`uppercase flex items-center gap-1 ${
                        game.finished && game.totalPointsA > (game.totalPointsB ?? 0)
                          ? 'text-base font-black text-slate-50 tracking-wider'
                          : 'text-sm font-black text-slate-200'
                      }`}
                    >
                      <span>{game.teamA}</span>
                      {game.finished && game.totalPointsA > (game.totalPointsB ?? 0) && (
                        <span className="text-lg leading-none drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]">🏆</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <p
                      className={`uppercase flex items-center gap-1 ${
                        game.finished && game.totalPointsB > (game.totalPointsA ?? 0)
                          ? 'text-base font-black text-amber-300 tracking-wider'
                          : 'text-sm font-black text-amber-400'
                      }`}
                    >
                      <span>{game.teamB}</span>
                      {game.finished && game.totalPointsB > (game.totalPointsA ?? 0) && (
                        <span className="text-lg leading-none drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]">🏆</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right bg-[#0f172a] p-3 rounded-2xl border border-slate-800 font-mono font-black text-xl">
                  <span className="text-white">{game.totalPointsA ?? 0}</span>
                  <span className="text-slate-700 mx-2">/</span>
                  <span className="text-amber-500">{game.totalPointsB ?? 0}</span>
                </div>
              </div>

              {game.finished ? (
                <div className="w-full py-3 bg-slate-900/60 border border-slate-700/80 rounded-xl text-center">
                  <span className="text-slate-400 text-[9px] font-black tracking-widest uppercase">Partida Finalizada</span>
                </div>
              ) : (
                <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] gap-3">
                  <button
                    onClick={() => onResumeGame(game.id, game.teamA, game.teamB)}
                    className="w-full py-4 rounded-2xl text-[10px] font-black uppercase bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-all"
                  >
                    Retomar Partida
                  </button>
                  <button
                    onClick={() => setFinishId(game.id)}
                    className="w-full py-4 rounded-2xl text-[9px] font-black uppercase bg-slate-800/60 border border-slate-600 text-slate-300 hover:bg-slate-700/80 transition-all"
                  >
                    Dar por finalizada
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}