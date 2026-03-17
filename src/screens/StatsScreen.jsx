import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';

export default function StatsScreen({ onBack }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTeam, setExpandedTeam] = useState(null); // Para el acordeón

  useEffect(() => {
    const load = async () => {
      try {
        const games = await apiFetch('/games');

        const teams = new Map();

        games
          .filter((g) => g.finished)
          .forEach((game) => {
            const scoreA = game.totalPointsA ?? 0;
            const scoreB = game.totalPointsB ?? 0;
            const aName = game.teamA || 'Equipo A';
            const bName = game.teamB || 'Equipo B';

            if (!teams.has(aName)) {
              teams.set(aName, { name: aName, played: 0, wins: 0, losses: 0, opponents: {} });
            }
            if (!teams.has(bName)) {
              teams.set(bName, { name: bName, played: 0, wins: 0, losses: 0, opponents: {} });
            }

            const a = teams.get(aName);
            const b = teams.get(bName);

            a.played += 1;
            b.played += 1;

            if (!a.opponents[bName]) a.opponents[bName] = { name: bName, played: 0, wins: 0, losses: 0 };
            if (!b.opponents[aName]) b.opponents[aName] = { name: aName, played: 0, wins: 0, losses: 0 };

            a.opponents[bName].played += 1;
            b.opponents[aName].played += 1;

            if (scoreA > scoreB) {
              a.wins += 1; b.losses += 1;
              a.opponents[bName].wins += 1;
              b.opponents[aName].losses += 1;
            } else if (scoreB > scoreA) {
              b.wins += 1; a.losses += 1;
              b.opponents[aName].wins += 1;
              a.opponents[bName].losses += 1;
            }
          });

        const list = Array.from(teams.values())
          .map((t) => {
            const winRate = t.played ? Math.round((t.wins / t.played) * 100) : 0;
            // Ordenamos rivales por más victorias nuestras sobre ellos
            const allRivals = Object.values(t.opponents).sort(
              (r1, r2) => r2.wins - r1.wins || r2.played - r1.played,
            );
            return { ...t, winRate, allRivals, bestRival: allRivals[0] || null };
          })
          .sort((a, b) => b.wins - a.wins || b.winRate - a.winRate);

        setStats(list);
      } catch (e) {
        console.error('Error cargando estadísticas', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleExpand = (teamName) => {
    setExpandedTeam(expandedTeam === teamName ? null : teamName);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Estadísticas</h2>
        <button onClick={onBack} className="text-amber-500 font-bold text-xs uppercase tracking-widest">
          Cerrar
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-[10px] font-black uppercase">Calculando...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {stats.map((team, idx) => (
            <div key={team.name} className="bg-[#1e293b]/80 border border-slate-800 rounded-[32px] overflow-hidden">
              {/* Header de la Tarjeta */}
              <div className="p-5 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">#{idx + 1}</span>
                    <span className="text-lg font-black text-white uppercase tracking-tight">{team.name}</span>
                  </div>
                  <div className="text-right text-[10px] font-bold uppercase">
                    <span className="text-amber-400">{team.winRate}% Win</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/50 text-center">
                  <div className="flex flex-col"><span className="text-slate-500 text-[8px] uppercase">Jugados</span><span className="text-white font-mono font-bold text-sm">{team.played}</span></div>
                  <div className="flex flex-col"><span className="text-emerald-500 text-[8px] uppercase">Ganados</span><span className="text-emerald-400 font-mono font-bold text-sm">{team.wins}</span></div>
                  <div className="flex flex-col"><span className="text-red-500 text-[8px] uppercase">Perdidos</span><span className="text-red-400 font-mono font-bold text-sm">{team.losses}</span></div>
                </div>

                {/* Rival Destacado (Botón Expansible) */}
                <button 
                  onClick={() => toggleExpand(team.name)}
                  className="w-full mt-1 rounded-2xl bg-[#020617]/60 border border-slate-800 px-4 py-3 flex items-center justify-between active:scale-[0.98] transition-all"
                >
                  <div className="text-[10px] text-slate-400 uppercase font-black tracking-tight text-left">
                    {expandedTeam === team.name ? 'Ocultar Historial' : 'Ver todos los rivales'}
                  </div>
                  <div className="text-amber-500 text-xs">
                    {expandedTeam === team.name ? '▲' : '▼'}
                  </div>
                </button>
              </div>

              {/* Contenido Expansible: Todos los Rivales */}
              {expandedTeam === team.name && (
                <div className="bg-[#0f172a] border-t border-slate-800 p-4 space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-[8px] text-slate-500 uppercase font-black mb-3 px-1 tracking-widest">Historial vs Oponentes</p>
                  {team.allRivals.map((rival) => (
                    <div key={rival.name} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                      <span className="text-[11px] font-black text-slate-100 uppercase tracking-tight">{rival.name}</span>
                      <div className="text-[10px] font-mono flex gap-3">
                        <span className="text-slate-500">PJ: {rival.played}</span>
                        <span className="text-emerald-400 font-bold">G: {rival.wins}</span>
                        <span className="text-red-400">P: {rival.losses}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}