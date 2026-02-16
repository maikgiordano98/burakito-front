import { useState } from 'react';
import { apiFetch } from '../api/client';

export default function HomeScreen({ onGameCreated }) {
  const [names, setNames] = useState({ teamA: 'Nosotros', teamB: 'Ellos' });
  const [isCreating, setIsCreating] = useState(false);

  const createGame = async () => {
    if (isCreating) return; // Evita re-clics mientras carga
    
    setIsCreating(true);
    try {
      const data = await apiFetch('/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(names)
      });
      
      // El timeout de 30-60s ya está manejado en tu apiFetch
      onGameCreated(data.id, names.teamA, names.teamB);
    } catch (error) {
      console.error("Error al crear partida:", error);
      alert("El servidor está tardando en responder. Reintente en un momento.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="py-10 space-y-6 animate-in fade-in duration-500">
      <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center uppercase tracking-tight">Nueva Partida</h2>
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-black uppercase ml-1">Nombre Equipo A</span>
            <input 
              className="w-full bg-[#020617] border border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-white disabled:opacity-50"
              placeholder="Ej: Nosotros" 
              disabled={isCreating}
              value={names.teamA}
              onChange={e => setNames({...names, teamA: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-black uppercase ml-1">Nombre Equipo B</span>
            <input 
              className="w-full bg-[#020617] border border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-white disabled:opacity-50"
              placeholder="Ej: Ellos" 
              disabled={isCreating}
              value={names.teamB}
              onChange={e => setNames({...names, teamB: e.target.value})}
            />
          </div>
          
          <button 
            onClick={createGame}
            disabled={isCreating}
            className={`w-full font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 ${
              isCreating 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-amber-500 hover:bg-amber-400 text-[#020617] active:scale-95 shadow-amber-500/10'
            }`}
          >
            {isCreating && (
              <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
            )}
            {isCreating ? 'CREANDO PARTIDA...' : 'COMENZAR'}
          </button>
        </div>
      </div>
      
      {isCreating && (
        <p className="text-center text-[10px] text-slate-500 font-bold uppercase animate-pulse">
          Cargando...
        </p>
      )}
    </div>
  );
}