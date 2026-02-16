import { useState } from 'react';
import { apiFetch } from '../api/client';

export default function HomeScreen({ onGameCreated }) {
  const [names, setNames] = useState({ teamA: 'Nosotros', teamB: 'Ellos' });

  const createGame = async () => {
    const data = await apiFetch('/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(names)
    });
    onGameCreated(data.id, names.teamA, names.teamB);
  };

  return (
    <div className="py-10 space-y-6">
      <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Nueva Partida</h2>
        <div className="space-y-4">
          <input 
            className="w-full bg-[#020617] border border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            placeholder="Equipo A" 
            value={names.teamA}
            onChange={e => setNames({...names, teamA: e.target.value})}
          />
          <input 
            className="w-full bg-[#020617] border border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            placeholder="Equipo B" 
            value={names.teamB}
            onChange={e => setNames({...names, teamB: e.target.value})}
          />
          <button 
            onClick={createGame}
            className="w-full bg-amber-500 hover:bg-amber-400 text-[#020617] font-black py-4 rounded-xl shadow-lg shadow-amber-500/10 transition-transform active:scale-95"
          >
            COMENZAR
          </button>
        </div>
      </div>
    </div>
  );
}