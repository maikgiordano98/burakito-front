import { useState } from 'react';
import { apiFetch } from '../api/client';

const TeamCard = ({ teamName, letter, form, setForm, otherLetter }) => {
    const muertoStatus = form[`team${letter}LevantoMuerto`];
    const cortoStatus = form[`team${letter}Corto`]; // null, true o false
    const alguienCortoYa = form[`team${otherLetter}Corto`] === true;
    
    const puras = parseInt(form[`team${letter}CanastasPuras`]) || 0;
    const impuras = parseInt(form[`team${letter}CanastasImpuras`]) || 0;
    const tieneCanastas = (puras + impuras) > 0;
    
    // Puntos por canastas: Puras 200, Impuras 100
    const puntosCanastas = (puras * 200) + (impuras * 100);
    const penaMuerto = muertoStatus === false ? -100 : 0;
    const bonusCorte = cortoStatus === true ? 100 : 0;
    
    const puntosIngresados = parseInt(form[`team${letter}Points`]) || 0;
    const puntosFichasFinales = tieneCanastas ? puntosIngresados : -Math.abs(puntosIngresados);
    
    const impactoTotal = puntosCanastas + puntosFichasFinales + penaMuerto + bonusCorte;

    const handleCorto = (val) => {
        setForm(prev => ({ ...prev, [`team${letter}Corto`]: val }));
    };

    return (
        <div className={`bg-[#1e293b] rounded-3xl border transition-all duration-500 overflow-hidden ${impactoTotal < 0 ? 'border-red-500/30' : 'border-slate-800'}`}>
            <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700/50 flex justify-between items-center">
                <h3 className="text-amber-500 font-black uppercase text-xs tracking-[0.2em]">{teamName}</h3>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 uppercase font-black">Impacto Parcial</span>
                    <span className={`text-2xl font-black leading-none ${impactoTotal < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {impactoTotal > 0 ? `+${impactoTotal}` : impactoTotal}
                    </span>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* 1. CANASTAS */}
                <div className="space-y-3">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">1. ¿Tienen Canastas?</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1 text-center">
                            <span className="text-[9px] text-slate-400 font-bold uppercase text-center block">Puras (200)</span>
                            <input
                                type="text" inputMode="numeric"
                                value={form[`team${letter}CanastasPuras`]}
                                placeholder="0"
                                className={`w-full bg-[#0f172a] border rounded-xl p-3 text-center font-bold outline-none transition-all ${puras > 0 ? 'border-emerald-500 text-emerald-400' : 'border-slate-800 text-slate-500'}`}
                                onChange={e => setForm(prev => ({...prev, [`team${letter}CanastasPuras`]: e.target.value.replace(/[^0-9]/g, '')}))}
                            />
                        </div>
                        <div className="space-y-1 text-center">
                            <span className="text-[9px] text-slate-400 font-bold uppercase text-center block">Impuras (100)</span>
                            <input
                                type="text" inputMode="numeric"
                                value={form[`team${letter}CanastasImpuras`]}
                                placeholder="0"
                                className={`w-full bg-[#0f172a] border rounded-xl p-3 text-center font-bold outline-none transition-all ${impuras > 0 ? 'border-amber-500 text-amber-400' : 'border-slate-800 text-slate-500'}`}
                                onChange={e => setForm(prev => ({...prev, [`team${letter}CanastasImpuras`]: e.target.value.replace(/[^0-9]/g, '')}))}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. MUERTO */}
                <div className="space-y-3">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">2. ¿Levantaron el Muerto?</p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, [`team${letter}LevantoMuerto`]: true }))}
                            className={`flex-1 py-3 rounded-xl font-bold text-xs border transition-all ${muertoStatus === true ? 'bg-emerald-500 border-emerald-400 text-[#020617]' : 'bg-[#0f172a] border-slate-800 text-slate-500'}`}
                        > SÍ </button>
                        <button
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, [`team${letter}LevantoMuerto`]: false }))}
                            className={`flex-1 py-3 rounded-xl font-bold text-xs border transition-all ${muertoStatus === false ? 'bg-red-500 border-red-400 text-white' : 'bg-[#0f172a] border-slate-800 text-slate-500'}`}
                        > NO (-100) </button>
                    </div>
                </div>

                {/* 3. CORTE */}
                <div className="space-y-3">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">3. ¿Cortaron?</p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={alguienCortoYa}
                            onClick={() => handleCorto(true)}
                            className={`flex-1 py-3 rounded-xl font-bold text-xs border transition-all ${cortoStatus === true ? 'bg-amber-500 border-amber-400 text-[#020617]' : 'bg-[#0f172a] border-slate-800 text-slate-500 disabled:opacity-20'}`}
                        > SÍ (+100) </button>
                        <button
                            type="button"
                            onClick={() => handleCorto(false)}
                            className={`flex-1 py-3 rounded-xl font-bold text-xs border transition-all ${cortoStatus === false ? 'bg-slate-200 border-white text-[#020617]' : 'bg-[#0f172a] border-slate-800 text-slate-500'}`}
                        > NO </button>
                    </div>
                </div>

                {/* 4. PUNTOS EN FICHAS */}
                <div className="pt-4 border-t border-slate-800/50">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">4. Puntos en fichas</p>
                        {!tieneCanastas && puntosIngresados !== 0 && <span className="text-[8px] text-red-400 font-black animate-pulse">RESTA POR NO TENER CANASTA</span>}
                    </div>
                    <input
                        type="text"
                        value={form[`team${letter}Points`]}
                        placeholder="Ingresar puntos..."
                        className={`w-full bg-[#0f172a] border rounded-2xl p-4 text-center text-xl font-black outline-none transition-all ${puntosIngresados !== 0 ? (tieneCanastas ? 'border-emerald-500 text-white' : 'border-red-500 text-red-500') : 'border-slate-700 text-slate-400'}`}
                        onChange={e => setForm(prev => ({ ...prev, [`team${letter}Points`]: e.target.value.replace(/[^0-9-]/g, '') }))}
                    />
                </div>
            </div>
        </div>
    );
};

export default function RoundScreen({ gameId, teams, onSave, onCancel }) {
    const [form, setForm] = useState({
        teamAPoints: "", teamBPoints: "",
        teamACanastasPuras: "", teamBCanastasPuras: "",
        teamACanastasImpuras: "", teamBCanastasImpuras: "",
        teamALevantoMuerto: null, teamBLevantoMuerto: null,
        teamACorto: null, teamBCorto: null
    });

    const saveRound = async () => {
        try {
            const payload = {
                teamAPoints: parseInt(form.teamAPoints) || 0,
                teamBPoints: parseInt(form.teamBPoints) || 0,
                teamACanastasPuras: parseInt(form.teamACanastasPuras) || 0,
                teamBCanastasPuras: parseInt(form.teamBCanastasPuras) || 0,
                teamACanastasImpuras: parseInt(form.teamACanastasImpuras) || 0,
                teamBCanastasImpuras: parseInt(form.teamBCanastasImpuras) || 0,
                teamALevantoMuerto: form.teamALevantoMuerto === true,
                teamBLevantoMuerto: form.teamBLevantoMuerto === true,
                teamACorto: form.teamACorto === true,
                teamBCorto: form.teamBCorto === true,
            };
            await apiFetch(`/games/${gameId}/rounds`, { method: 'POST', body: JSON.stringify(payload) });
            onSave();
        } catch (error) { alert("Error al guardar"); }
    };

    return (
        <div className="max-w-md mx-auto space-y-8 pb-32">
            <div className="flex justify-between items-center px-4 pt-4">
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Cargar Ronda</h2>
                <button onClick={onCancel} className="text-slate-500 text-[10px] font-black hover:text-white">CANCELAR</button>
            </div>

            <div className="space-y-8 px-4">
                <TeamCard teamName={teams.teamA} letter="A" otherLetter="B" form={form} setForm={setForm} />
                <TeamCard teamName={teams.teamB} letter="B" otherLetter="A" form={form} setForm={setForm} />
            </div>

            <div className="fixed bottom-0 left-0 right-0 flex justify-center p-6 bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent z-50">
                <button onClick={saveRound} className="w-full max-w-[400px] bg-amber-500 text-[#020617] font-black py-5 rounded-2xl shadow-2xl transition-all active:scale-95 uppercase text-sm tracking-widest">
                    Confirmar Resultados
                </button>
            </div>
        </div>
    );
}