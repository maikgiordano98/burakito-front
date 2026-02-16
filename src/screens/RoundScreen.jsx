import { useState } from 'react';
import { apiFetch } from '../api/client';

const TeamCard = ({ teamName, letter, form, setForm, otherLetter, isSaving }) => {
    const muertoStatus = form[`team${letter}LevantoMuerto`];
    const cortoStatus = form[`team${letter}Corto`];
    const alguienCortoYa = form[`team${otherLetter}Corto`] === true;
    
    const puras = parseInt(form[`team${letter}CanastasPuras`]) || 0;
    const impuras = parseInt(form[`team${letter}CanastasImpuras`]) || 0;
    const tieneCanastas = (puras + impuras) > 0;
    
    const puntosCanastas = (puras * 200) + (impuras * 100);
    const penaMuerto = muertoStatus === false ? -100 : 0;
    const bonusCorte = cortoStatus === true ? 100 : 0;
    
    const puntosIngresados = parseInt(form[`team${letter}Points`]) || 0;
    let puntosFichasFinales = puntosIngresados;

    // Lógica: Si no hay canastas y el puntaje es positivo, se resta
    if (!tieneCanastas && puntosIngresados > 0) {
        puntosFichasFinales = -puntosIngresados;
    }
    
    const impactoTotal = puntosCanastas + puntosFichasFinales + penaMuerto + bonusCorte;

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
                <div className="space-y-3">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">1. ¿Tienen Canastas?</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase block text-center">Puras (200)</span>
                            <input
                                type="text" inputMode="numeric" disabled={isSaving}
                                value={form[`team${letter}CanastasPuras`]}
                                placeholder="0"
                                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl p-3 text-center font-bold outline-none text-white"
                                onChange={e => setForm(prev => ({...prev, [`team${letter}CanastasPuras`]: e.target.value.replace(/[^0-9]/g, '')}))}
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase block text-center">Impuras (100)</span>
                            <input
                                type="text" inputMode="numeric" disabled={isSaving}
                                value={form[`team${letter}CanastasImpuras`]}
                                placeholder="0"
                                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl p-3 text-center font-bold outline-none text-white"
                                onChange={e => setForm(prev => ({...prev, [`team${letter}CanastasImpuras`]: e.target.value.replace(/[^0-9]/g, '')}))}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">2. ¿Levantaron el Muerto?</p>
                    <div className="flex gap-2">
                        <button
                            type="button" disabled={isSaving}
                            onClick={() => setForm(prev => ({ ...prev, [`team${letter}LevantoMuerto`]: true }))}
                            className={`flex-1 py-3 rounded-xl font-bold text-xs border transition-all ${muertoStatus === true ? 'bg-emerald-500 border-emerald-400 text-[#020617]' : 'bg-[#0f172a] border-slate-800 text-slate-500'}`}
                        > SÍ </button>
                        <button
                            type="button" disabled={isSaving}
                            onClick={() => setForm(prev => ({ ...prev, [`team${letter}LevantoMuerto`]: false }))}
                            className={`flex-1 py-3 rounded-xl font-bold text-xs border transition-all ${muertoStatus === false ? 'bg-red-500 border-red-400 text-white' : 'bg-[#0f172a] border-slate-800 text-slate-500'}`}
                        > NO (-100) </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">3. ¿Cortaron?</p>
                    <div className="flex gap-2">
                        <button
                            type="button" disabled={alguienCortoYa || isSaving}
                            onClick={() => setForm(prev => ({ ...prev, [`team${letter}Corto`]: true }))}
                            className={`flex-1 py-3 rounded-xl font-bold text-xs border transition-all ${cortoStatus === true ? 'bg-amber-500 border-amber-400 text-[#020617]' : 'bg-[#0f172a] border-slate-800 text-slate-500 disabled:opacity-20'}`}
                        > SÍ (+100) </button>
                        <button
                            type="button" disabled={isSaving}
                            onClick={() => setForm(prev => ({ ...prev, [`team${letter}Corto`]: false }))}
                            className={`flex-1 py-3 rounded-xl font-bold text-xs border transition-all ${cortoStatus === false ? 'bg-slate-200 border-white text-[#020617]' : 'bg-[#0f172a] border-slate-800 text-slate-500'}`}
                        > NO </button>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-800/50">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">4. Puntos en fichas</p>
                        {!tieneCanastas && puntosIngresados > 0 && <span className="text-[8px] text-red-400 font-black animate-pulse uppercase">Resta por falta de canasta</span>}
                    </div>
                    <input
                        type="text" disabled={isSaving}
                        value={form[`team${letter}Points`]}
                        placeholder="Ingresar fichas..."
                        className={`w-full bg-[#0f172a] border rounded-2xl p-4 text-center text-xl font-black outline-none transition-all ${puntosIngresados !== 0 ? (tieneCanastas || puntosIngresados < 0 ? 'border-emerald-500 text-white' : 'border-red-500 text-red-500') : 'border-slate-700 text-slate-400'}`}
                        onChange={e => {
                            const val = e.target.value;
                            if (val === "" || val === "-" || /^-?\d*$/.test(val)) {
                                setForm(prev => ({ ...prev, [`team${letter}Points`]: val }));
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default function RoundScreen({ gameId, teams, onSave, onCancel }) {
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState({
        teamAPoints: "", teamBPoints: "",
        teamACanastasPuras: "", teamBCanastasPuras: "",
        teamACanastasImpuras: "", teamBCanastasImpuras: "",
        teamALevantoMuerto: null, teamBLevantoMuerto: null,
        teamACorto: null, teamBCorto: null
    });

    const saveRound = async () => {
        if (isSaving) return;
        setIsSaving(true);
        
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

            await apiFetch(`/games/${gameId}/rounds`, { 
                method: 'POST', 
                body: JSON.stringify(payload) 
            });
            
            onSave();
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error al conectar con el servidor. Reintente en unos segundos.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-8 pb-32 animate-in fade-in duration-500">
            <div className="flex justify-between items-center px-4 pt-4">
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Cargar Ronda</h2>
                <button onClick={onCancel} disabled={isSaving} className="text-slate-500 text-[10px] font-black hover:text-white disabled:opacity-30">CANCELAR</button>
            </div>

            <div className="space-y-8 px-4">
                <TeamCard teamName={teams.teamA} letter="A" otherLetter="B" form={form} setForm={setForm} isSaving={isSaving} />
                <TeamCard teamName={teams.teamB} letter="B" otherLetter="A" form={form} setForm={setForm} isSaving={isSaving} />
            </div>

            <div className="fixed bottom-0 left-0 right-0 flex justify-center p-6 bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent z-50">
                <button 
                    onClick={saveRound} 
                    disabled={isSaving}
                    className={`w-full max-w-[400px] font-black py-5 rounded-2xl shadow-2xl transition-all active:scale-95 uppercase text-sm tracking-widest flex items-center justify-center gap-3 ${
                        isSaving ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-amber-500 text-[#020617]'
                    }`}
                >
                    {isSaving && <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>}
                    {isSaving ? 'Guardando...' : 'Confirmar Resultados'}
                </button>
            </div>
        </div>
    );
}