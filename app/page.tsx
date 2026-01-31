"use client";
import { useState, useEffect, useRef } from "react";

// --- TIPE DATA ---
type Tab = "SCALE" | "RIGHT_ISSUE" | "RI_TERP" | "GAME";
type Mode = "SCALE_IN" | "SCALE_OUT";
type Method = "NORMAL" | "MARTINGALE" | "FIBONACCI";
type GameMode = "MATH" | "STORY"; 
type Difficulty = "PEMULA" | "MENENGAH" | "PRO";
type GameState = "LOGIN" | "SETUP" | "PLAY" | "GAMEOVER" | "WIN";
type Feedback = "NONE" | "CORRECT" | "WRONG";

export default function SuperStockApp() {
  const [activeTab, setActiveTab] = useState<Tab>("SCALE");

  // --- DOKUMENTASI PANDUAN ---
  const renderGuide = () => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-sm space-y-3 mb-24">
      <h3 className="font-bold text-slate-700 uppercase border-b pb-2">📖 Panduan Singkat</h3>
      <details className="group"><summary className="font-bold text-emerald-700 cursor-pointer list-none flex justify-between"><span>1. Scale In/Out</span><span className="group-open:rotate-180 transition-transform">▼</span></summary><p className="text-slate-600 mt-2 text-xs leading-relaxed">Strategi cicil beli (piramida) dan cicil jual. Bisa atur level otomatis atau manual.</p></details>
      <details className="group"><summary className="font-bold text-indigo-700 cursor-pointer list-none flex justify-between"><span>2. RI Strategi (Jual Induk)</span><span className="group-open:rotate-180 transition-transform">▼</span></summary><p className="text-slate-600 mt-2 text-xs leading-relaxed">Hitung berapa lot induk yang harus dijual untuk menebus right (Tail Swallowing).</p></details>
      <details className="group"><summary className="font-bold text-orange-600 cursor-pointer list-none flex justify-between"><span>3. RI TERP (Analisa Harga)</span><span className="group-open:rotate-180 transition-transform">▼</span></summary><p className="text-slate-600 mt-2 text-xs leading-relaxed">Hitung Harga Wajar Teoritis (Ex-Date) menggunakan satuan Juta Lembar.</p></details>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-20">
      {/* --- MENU TAB ATAS --- */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab("SCALE")} className={`flex-1 py-4 px-2 text-xs md:text-sm font-bold uppercase tracking-wider border-b-4 transition-colors shrink-0 ${activeTab === "SCALE" ? "border-emerald-600 text-emerald-700 bg-emerald-50" : "border-transparent text-slate-400"}`}>💰 Scale</button>
          <button onClick={() => setActiveTab("RIGHT_ISSUE")} className={`flex-1 py-4 px-2 text-xs md:text-sm font-bold uppercase tracking-wider border-b-4 transition-colors shrink-0 ${activeTab === "RIGHT_ISSUE" ? "border-indigo-600 text-indigo-700 bg-indigo-50" : "border-transparent text-slate-400"}`}>📉 RI Strategi</button>
          <button onClick={() => setActiveTab("RI_TERP")} className={`flex-1 py-4 px-2 text-xs md:text-sm font-bold uppercase tracking-wider border-b-4 transition-colors shrink-0 ${activeTab === "RI_TERP" ? "border-orange-500 text-orange-600 bg-orange-50" : "border-transparent text-slate-400"}`}>📊 RI TERP</button>
          <button onClick={() => setActiveTab("GAME")} className={`flex-1 py-4 px-2 text-xs md:text-sm font-bold uppercase tracking-wider border-b-4 transition-colors shrink-0 ${activeTab === "GAME" ? "border-blue-500 text-blue-600 bg-blue-50" : "border-transparent text-slate-400"}`}>🎮 Game</button>
        </div>
      </div>

      {/* --- AREA KONTEN --- */}
      <div className="p-3 md:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {activeTab === "SCALE" && <ScaleCalculator />}
          {activeTab === "RIGHT_ISSUE" && <RightIssueStrategy />}
          {activeTab === "RI_TERP" && <RiTerpCalculator />}
          {activeTab === "GAME" && <MathGame />}
          
          {activeTab !== "GAME" && renderGuide()}
        </div>
      </div>

      {/* --- STICKY CONTACT BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] flex shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <a href="https://t.me/+zrEOLwygGCBhZTQ1" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#0088cc] text-white p-3 flex items-center justify-center gap-2 hover:bg-[#0077b5] transition-colors border-r border-white/20">
          <div className="flex flex-col leading-none text-left w-full items-center"><span className="text-[9px] opacity-80 uppercase font-bold">Gabung</span><span className="font-bold text-sm">Grup RLA</span></div>
        </a>
        <a href="https://wa.me/6281299053961" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white p-3 flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors">
          <div className="flex flex-col leading-none text-left w-full items-center"><span className="text-[9px] opacity-80 uppercase font-bold">Chat Admin</span><span className="font-bold text-sm">WhatsApp</span></div>
        </a>
      </div>
    </div>
  );
}

// ==========================================
// 1. KOMPONEN KALKULATOR SCALE IN/OUT (NEW: AUTO/MANUAL LEVEL)
// ==========================================
function ScaleCalculator() {
  const [mode, setMode] = useState<Mode>("SCALE_IN");
  const [emiten, setEmiten] = useState("ABCD");
  const [totalInput, setTotalInput] = useState(50000000); 
  const [startPrice, setStartPrice] = useState(605);
  const [targetPrice, setTargetPrice] = useState(505);
  const [method, setMethod] = useState<Method>("MARTINGALE");
  const [multiplier, setMultiplier] = useState(2.0);
  
  // -- New State untuk Manual Level --
  const [isAutoLevel, setIsAutoLevel] = useState(true);
  const [manualSteps, setManualSteps] = useState(5);

  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [autoSteps, setAutoSteps] = useState(0);
  const [spreadPct, setSpreadPct] = useState(0);

  const formatIDR = (num: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
  const formatNum = (num: number) => new Intl.NumberFormat("id-ID").format(num);
  const handleInputAmount = (e: React.ChangeEvent<HTMLInputElement>) => { const cleanValue = e.target.value.replace(/\D/g, ""); setTotalInput(Number(cleanValue)); };
  
  useEffect(() => { 
    if (mode === "SCALE_IN") { 
        if (emiten === "DCBA") { setEmiten("ABCD"); setTotalInput(50000000); } 
    } else { 
        if (emiten === "ABCD") { setEmiten("DCBA"); setTotalInput(1000); } 
    } 
  }, [mode]);

  const roundToTick = (price: number) => { 
      let tick = 1; 
      if (price < 200) tick = 1; 
      else if (price >= 200 && price < 500) tick = 2; 
      else if (price >= 500 && price < 2000) tick = 5; 
      else if (price >= 2000 && price < 5000) tick = 10; 
      else tick = 25; 
      return Math.round(price / tick) * tick; 
  };

  const isInvalidTicker = emiten === "ABCD" || emiten === "DCBA";

  const calculateStrategy = () => { 
    if (isInvalidTicker) { setResults([]); return; } 
    
    const spread = Math.abs(startPrice - targetPrice) / startPrice; 
    setSpreadPct(spread * 100); 
    
    // --- LOGIKA LEVEL OTOMATIS ---
    let calculatedAutoSteps = 3; 
    if (spread < 0.10) calculatedAutoSteps = 3; 
    else if (spread < 0.25) calculatedAutoSteps = 5; 
    else if (spread < 0.50) calculatedAutoSteps = 8; 
    else calculatedAutoSteps = 13; 
    setAutoSteps(calculatedAutoSteps); // Simpan info auto steps

    // --- TENTUKAN STEPS YANG DIPAKAI (AUTO VS MANUAL) ---
    let steps = isAutoLevel ? calculatedAutoSteps : manualSteps;
    if (steps < 2) steps = 2; // Minimal 2 level

    let weights: number[] = []; 
    if (method === "NORMAL") weights = Array(steps).fill(1); 
    else if (method === "MARTINGALE") for (let i = 0; i < steps; i++) weights.push(Math.pow(multiplier, i)); 
    else if (method === "FIBONACCI") { 
        let a = 1, b = 1; 
        for (let i = 0; i < steps; i++) { weights.push(a); const temp = a + b; a = b; b = temp; } 
    } 
    
    if (mode === "SCALE_OUT") weights.sort((a, b) => b - a); 
    
    const totalWeight = weights.reduce((a, b) => a + b, 0); 
    let tempResults = []; 
    let priceStep = (targetPrice - startPrice) / (steps - 1); 
    
    let accumLot = 0; 
    let accumValue = 0; 
    let totalExecValue = 0; 
    let totalExecLot = 0; 

    for (let i = 0; i < steps; i++) { 
        let rawPrice = startPrice + (i * priceStep); 
        let executedPrice = roundToTick(rawPrice); 
        let weightPct = weights[i] / totalWeight; 
        let currentLot = 0; 
        let currentValue = 0; 
        
        if (mode === "SCALE_IN") { 
            let allocationRp = totalInput * weightPct; 
            currentLot = Math.floor(allocationRp / (executedPrice * 100)); 
            currentValue = currentLot * 100 * executedPrice; 
        } else { 
            let allocationLot = totalInput * weightPct; 
            currentLot = Math.round(allocationLot); 
            currentValue = currentLot * 100 * executedPrice; 
        } 
        
        accumLot += currentLot; 
        accumValue += currentValue; 
        totalExecValue += currentValue; 
        totalExecLot += currentLot; 
        let avgPrice = accumValue / (accumLot * 100); 
        
        tempResults.push({ 
            level: i + 1, 
            price: executedPrice, 
            weightPct: (weightPct * 100).toFixed(1), 
            lot: currentLot, 
            value: currentValue, 
            avgPrice: Math.round(avgPrice || 0) 
        }); 
    } 
    setResults(tempResults); 
    setSummary({ totalMoney: totalExecValue, totalLot: totalExecLot, finalAvg: accumValue / (accumLot * 100) || 0 }); 
  };

  useEffect(() => { calculateStrategy(); }, [mode, totalInput, startPrice, targetPrice, method, multiplier, emiten, isAutoLevel, manualSteps]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      <div className={`p-4 ${mode === 'SCALE_IN' ? 'bg-emerald-700' : 'bg-red-700'} text-white relative`}>
        <h2 className="text-lg font-bold">Kalkulator Strategi Pro - {emiten}</h2>
        <p className="opacity-90 text-xs">Mode: {mode === 'SCALE_IN' ? 'Scale In (Beli)' : 'Scale Out (Jual)'}</p>
        <div className="absolute top-4 right-4 font-mono font-bold text-white/60 text-xs">@illusix</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        <div className="p-4 bg-slate-50 border-r border-slate-200 space-y-3">
          <div className="flex bg-slate-200 rounded-lg p-1">
            <button onClick={() => setMode("SCALE_IN")} className={`flex-1 py-2 text-xs font-bold rounded-md ${mode === "SCALE_IN" ? "bg-white shadow text-emerald-700" : "text-slate-500"}`}>Scale In (Buy)</button>
            <button onClick={() => setMode("SCALE_OUT")} className={`flex-1 py-2 text-xs font-bold rounded-md ${mode === "SCALE_OUT" ? "bg-white shadow text-red-700" : "text-slate-500"}`}>Scale Out (Sell)</button>
          </div>
          
          {isInvalidTicker && (<div className="bg-red-100 border border-red-200 text-red-700 px-3 py-2 rounded text-[10px] font-bold animate-pulse">⚠️ Silakan ganti nama saham "{emiten}" dengan kode saham yang benar (Contoh: BBCA, ASII) untuk melihat hasil.</div>)}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div><label className="text-[10px] font-bold text-slate-500 uppercase">Emiten</label><input type="text" value={emiten} onChange={(e) => setEmiten(e.target.value.toUpperCase())} className={`w-full p-2 border rounded font-bold uppercase transition-all ${isInvalidTicker ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'}`} /></div>
            <div><label className="text-[10px] font-bold text-slate-500 uppercase">{mode === 'SCALE_IN' ? 'Total Modal' : 'Total Lot'}</label><input type="text" value={formatNum(totalInput)} onChange={handleInputAmount} className="w-full p-2 border rounded font-bold text-slate-800" /></div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-[10px] font-bold text-slate-500 uppercase">Harga Awal</label><input type="number" value={startPrice} onChange={(e) => setStartPrice(Number(e.target.value))} className="w-full p-2 border rounded" /></div>
            <div><label className="text-[10px] font-bold text-slate-500 uppercase">Harga Target</label><input type="number" value={targetPrice} onChange={(e) => setTargetPrice(Number(e.target.value))} className="w-full p-2 border rounded" /></div>
          </div>

          {/* --- PILIHAN LEVEL AUTO / MANUAL --- */}
          <div className="bg-white p-2 rounded border border-slate-300">
             <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setIsAutoLevel(true)} className={`flex-1 text-[10px] font-bold py-1.5 rounded ${isAutoLevel ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>Auto Level</button>
                <button onClick={() => setIsAutoLevel(false)} className={`flex-1 text-[10px] font-bold py-1.5 rounded ${!isAutoLevel ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>Manual</button>
             </div>
             
             {!isAutoLevel ? (
                 <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Jml Level</label>
                    <input type="number" value={manualSteps} onChange={(e) => setManualSteps(Math.max(2, Number(e.target.value)))} className="w-20 p-1 border rounded text-center font-bold text-blue-700" />
                 </div>
             ) : (
                 <div className="text-[10px] text-center text-slate-400 italic">Level dihitung otomatis dari spread ({autoSteps} Lvl)</div>
             )}
          </div>

          <div><label className="text-[10px] font-bold text-slate-500 uppercase">Metode</label><select value={method} onChange={(e) => setMethod(e.target.value as Method)} className="w-full p-2 border rounded bg-white text-sm"><option value="NORMAL">Normal</option><option value="MARTINGALE">Martingale</option><option value="FIBONACCI">Fibonacci</option></select></div>
          
          <div className="flex gap-2 items-end">
            {method === "MARTINGALE" && (<div className="w-24 shrink-0"><label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Faktor (x)</label><input type="number" step="0.1" value={multiplier} onChange={(e) => setMultiplier(Number(e.target.value))} className="w-full p-2 border rounded text-center font-bold" /></div>)}
            <div className="flex-1 bg-blue-50 border border-blue-100 rounded p-2 h-[38px] flex flex-col justify-center text-[10px] text-blue-800 leading-tight"><div className="flex justify-between items-center"><span>Spread: <strong>{spreadPct.toFixed(1)}%</strong></span></div></div>
          </div>
        </div>
        
        <div className="lg:col-span-2 p-4 bg-white relative">
          {isInvalidTicker ? (
             <div className="h-full w-full flex flex-col items-center justify-center text-slate-300 space-y-2 py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <p className="text-sm font-bold text-slate-400 text-center">Masukkan kode emiten yang benar<br/>untuk melihat hasil kalkulasi.</p>
             </div>
          ) : (
            <>
                <div className="flex flex-col gap-2 mb-4">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center"><p className="text-[10px] text-slate-500 uppercase font-bold">Estimasi Uang</p><p className="text-lg font-bold text-slate-800">{formatIDR(summary.totalMoney)}</p></div>
                    <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200"><p className="text-[10px] text-slate-500 uppercase font-bold">Total Lot</p><p className="text-lg font-bold text-blue-600">{formatNum(summary.totalLot)} <span className="text-[10px] text-slate-400">Lot</span></p></div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-right"><p className="text-[10px] text-slate-500 uppercase font-bold">Avg. Price</p><p className="text-lg font-bold text-emerald-600">{formatIDR(summary.finalAvg)}</p></div>
                    </div>
                </div>
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-xs md:text-sm text-right">
                    <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]"><tr><th className="p-2 text-center">Lvl</th><th className="p-2 text-emerald-700">Harga</th><th className="p-2 hidden md:table-cell">Bobot</th><th className="p-2">Lot</th><th className="p-2">Value (Rp)</th><th className="p-2 text-blue-700">Avg Run</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">{results.map((r, i) => (<tr key={i} className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-slate-400">{r.level}</td><td className="p-2 font-mono font-bold text-emerald-700">{formatNum(r.price)}</td><td className="p-2 text-slate-500 hidden md:table-cell">{r.weightPct}%</td><td className="p-2 font-bold">{formatNum(r.lot)}</td><td className="p-2 text-slate-600">{formatIDR(r.value)}</td><td className="p-2 font-bold text-blue-600">{formatNum(r.avgPrice)}</td></tr>))}</tbody>
                    </table>
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. KOMPONEN RIGHT ISSUE STRATEGI (FITUR LAMA - TAIL SWALLOWING)
// ==========================================
function RightIssueStrategy() {
  const [emiten, setEmiten] = useState("INET");
  const [lotAwal, setLotAwal] = useState(2598);
  const [hargaPasar, setHargaPasar] = useState(400);
  const [hargaTebus, setHargaTebus] = useState(250);
  const [ratioOld, setRatioOld] = useState(3);
  const [ratioNew, setRatioNew] = useState(4);
  const [hasWaran, setHasWaran] = useState(false); 
  const [waranOld, setWaranOld] = useState(1);
  const [waranNew, setWaranNew] = useState(1);
  const [result, setResult] = useState<any>(null);
  
  const formatIDR = (num: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
  const formatNum = (num: number) => new Intl.NumberFormat("id-ID").format(num);
  const handleInput = (setter: any) => (e: React.ChangeEvent<HTMLInputElement>) => { const val = e.target.value.replace(/\D/g, ""); setter(Number(val)); };

  useEffect(() => { 
    if (lotAwal === 0 || hargaPasar === 0 || hargaTebus === 0 || ratioOld === 0 || ratioNew === 0) return; 
    
    // --- RUMUS LAMA (STRATEGI) ---
    const R = ratioOld / ratioNew; 
    const isWorthy = hargaPasar > hargaTebus; 
    const recommendation = isWorthy ? "GAS TEBUS! (Diskon)" : "JANGAN TEBUS! (Mahal)"; 
    const pembagi = hargaTebus + (R * hargaPasar); 
    const lotJual = lotAwal > 0 ? Math.round((hargaTebus / pembagi) * lotAwal) : 0; 
    const danaMasuk = lotJual * 100 * hargaPasar; 
    const sisaLotLama = lotAwal - lotJual; 
    const hakTebus = Math.floor((sisaLotLama / ratioOld) * ratioNew); 
    const danaTebus = hakTebus * 100 * hargaTebus; 
    const selisihCash = danaMasuk - danaTebus; 
    const totalLotBaru = sisaLotLama + hakTebus; 
    const growth = lotAwal > 0 ? ((totalLotBaru - lotAwal) / lotAwal) * 100 : 0; 
    
    let totalWaran = 0; 
    if (hasWaran) totalWaran = Math.floor((hakTebus * waranNew) / waranOld); 
    
    const valSisaLama = sisaLotLama * 100 * hargaPasar; 
    const valBaru = danaTebus; 
    const avgPrice = totalLotBaru > 0 ? Math.round((valSisaLama + valBaru) / (totalLotBaru * 100)) : 0; 

    setResult({ 
      recommendation, isWorthy, lotJual, danaMasuk, hakTebus, danaTebus, 
      selisihCash, totalLotBaru, growth, totalWaran, avgPrice 
    }); 
  }, [emiten, lotAwal, hargaPasar, hargaTebus, ratioOld, ratioNew, hasWaran, waranOld, waranNew]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-indigo-700 p-4 text-white relative">
        <h2 className="text-lg font-bold">Strategi Right Issue - {emiten}</h2>
        <p className="opacity-80 text-xs">Metode Tail Swallowing (Jual Induk untuk Tebus)</p>
        <div className="absolute top-4 right-4 font-mono font-bold text-white/50 text-xs">@illusix</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="p-4 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Emiten</label><input type="text" value={emiten} onChange={(e) => setEmiten(e.target.value.toUpperCase())} className="w-full p-2 border rounded font-bold uppercase bg-white" /></div>
            <div className="col-span-2"><label className="text-[10px] font-bold text-slate-500 uppercase">Lot Awal (N)</label><input type="text" value={formatNum(lotAwal)} onChange={handleInput(setLotAwal)} className="w-full p-2 border rounded font-bold" /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-[10px] font-bold text-slate-500 uppercase">Harga Pasar</label><input type="text" value={formatNum(hargaPasar)} onChange={handleInput(setHargaPasar)} className="w-full p-2 border rounded font-bold text-emerald-700" /></div>
            <div><label className="text-[10px] font-bold text-slate-500 uppercase">Harga Tebus</label><input type="text" value={formatNum(hargaTebus)} onChange={handleInput(setHargaTebus)} className="w-full p-2 border rounded font-bold text-orange-600" /></div>
          </div>
          <div className="bg-white p-2 border rounded"><div className="flex items-center gap-3"><div className="flex-1"><label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Rasio Lama</label><input type="number" value={ratioOld} onChange={(e) => setRatioOld(Number(e.target.value))} className="w-full p-2 border rounded text-center font-bold bg-slate-50" /></div><span className="font-bold text-slate-400 text-lg mt-4">:</span><div className="flex-1"><label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Rasio Baru</label><input type="number" value={ratioNew} onChange={(e) => setRatioNew(Number(e.target.value))} className="w-full p-2 border rounded text-center font-bold bg-slate-50" /></div></div></div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200"><div className="flex items-center justify-between mb-2"><label className="text-xs font-bold text-slate-600">Ada Waran?</label><input type="checkbox" checked={hasWaran} onChange={(e) => setHasWaran(e.target.checked)} className="w-5 h-5 accent-indigo-600" /></div>{hasWaran && (<div className="flex items-center gap-2 text-xs"><span className="text-slate-500">Tiap</span><input type="number" value={waranOld} onChange={(e) => setWaranOld(Number(e.target.value))} className="w-12 p-1 border rounded text-center bg-white" /><span className="text-slate-500">Dpt</span><input type="number" value={waranNew} onChange={(e) => setWaranNew(Number(e.target.value))} className="w-12 p-1 border rounded text-center bg-white" /><span className="text-slate-500">Waran</span></div>)}</div>
        </div>
        <div className="p-4 bg-white">
          {result && (
            <div className="space-y-3">
              <div className={`p-3 rounded-lg text-center text-white shadow-md ${result.isWorthy ? 'bg-emerald-600' : 'bg-red-600'}`}><p className="text-[10px] opacity-80 font-bold uppercase">Rekomendasi</p><h2 className="text-lg font-bold tracking-tight">{result.recommendation}</h2></div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center bg-red-50 p-2 rounded border border-red-100"><div><span className="text-[10px] font-bold text-red-400 block uppercase">1. Jual Induk</span><span className="font-bold text-red-700 text-lg">{formatNum(result.lotJual)} Lot</span></div><div className="text-right"><span className="text-[10px] text-slate-400 block">Dapat Tunai</span><span className="font-bold text-slate-600 text-xs">{formatIDR(result.danaMasuk)}</span></div></div>
                <div className="flex justify-between items-center bg-emerald-50 p-2 rounded border border-emerald-100"><div><span className="text-[10px] font-bold text-emerald-400 block uppercase">2. Tebus Right</span><span className="font-bold text-emerald-700 text-lg">{formatNum(result.hakTebus)} Lot</span></div><div className="text-right"><span className="text-[10px] text-slate-400 block">Bayar Tebus</span><span className="font-bold text-slate-600 text-xs">{formatIDR(result.danaTebus)}</span></div></div>
                <div className="text-center text-xs text-slate-500 pt-1">Sisa Uang Tunai: <span className="font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">{formatIDR(result.selisihCash)}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-3 rounded-lg border shadow-sm"><p className="text-[10px] text-slate-500 font-bold uppercase">Total Lot Akhir</p><p className="text-lg font-bold text-indigo-700">{formatNum(result.totalLotBaru)}</p><span className="inline-block px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-bold">+{result.growth.toFixed(1)}% Growth</span></div>
                <div className="bg-white p-3 rounded-lg border shadow-sm text-right"><p className="text-[10px] text-slate-500 font-bold uppercase">Harga Rata-rata</p><p className="text-lg font-bold text-emerald-600">{formatIDR(result.avgPrice)}</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. KOMPONEN RI TERP (TAB BARU - UX UPDATED DENGAN INDIKATOR JUTA)
// ==========================================
function RiTerpCalculator() {
  const [emiten, setEmiten] = useState("INET");
  const [hargaPasar, setHargaPasar] = useState(400); // Cum Date Price
  const [hargaTebus, setHargaTebus] = useState(250); // Exercise Price
  const [ratioOld, setRatioOld] = useState(500); // Default 500 (Juta)
  const [ratioNew, setRatioNew] = useState(100); // Default 100 (Juta)
  const [result, setResult] = useState<any>(null);
  const [showFormula, setShowFormula] = useState(false);

  const formatIDR = (num: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
  const formatNum = (num: number) => new Intl.NumberFormat("id-ID").format(num);
  const formatCompact = (num: number) => new Intl.NumberFormat("id-ID", { notation: "compact", compactDisplay: "short" }).format(num);
  
  const handleInput = (setter: any) => (e: React.ChangeEvent<HTMLInputElement>) => { const val = e.target.value.replace(/\D/g, ""); setter(Number(val)); };

  useEffect(() => { 
    if (hargaPasar === 0 || hargaTebus === 0 || ratioOld === 0 || ratioNew === 0) return; 
    
    // --- HITUNG TERP ---
    const totalValOld = hargaPasar * ratioOld;
    const totalValNew = hargaTebus * ratioNew;
    const totalShares = ratioOld + ratioNew;
    const terp = (totalValOld + totalValNew) / totalShares;
    const dilution = ((terp - hargaPasar) / hargaPasar) * 100;

    setResult({ terp, dilution, totalValOld, totalValNew, totalShares }); 
  }, [emiten, hargaPasar, hargaTebus, ratioOld, ratioNew]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-orange-600 p-4 text-white relative">
        <h2 className="text-lg font-bold">Kalkulator TERP - {emiten}</h2>
        <p className="opacity-80 text-xs">Analisa Harga Wajar Ex-Date</p>
        <div className="absolute top-4 right-4 font-mono font-bold text-white/50 text-xs">@illusix</div>
      </div>
      
      <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div><label className="text-[10px] font-bold text-slate-500 uppercase">Emiten</label><input type="text" value={emiten} onChange={(e) => setEmiten(e.target.value.toUpperCase())} className="w-full p-2 border rounded font-bold uppercase bg-white" /></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[10px] font-bold text-slate-500 uppercase">Harga Pasar (Cum)</label><input type="text" value={formatNum(hargaPasar)} onChange={handleInput(setHargaPasar)} className="w-full p-2 border rounded font-bold text-emerald-700" /></div>
            <div><label className="text-[10px] font-bold text-slate-500 uppercase">Harga Tebus</label><input type="text" value={formatNum(hargaTebus)} onChange={handleInput(setHargaTebus)} className="w-full p-2 border rounded font-bold text-orange-600" /></div>
          </div>

          <div className="bg-white p-3 border rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Jml Saham Lama (Juta)</label>
                    <input type="text" value={formatNum(ratioOld)} onChange={handleInput(setRatioOld)} className="w-full p-2 border rounded text-center font-bold bg-slate-50" placeholder="500" />
                    {/* INDIKATOR NILAI SEBENARNYA */}
                    <p className="text-[10px] text-slate-400 mt-1 font-mono text-center">= {formatNum(ratioOld * 1000000)} Lbr</p>
                </div>
                <span className="font-bold text-slate-400 text-lg mt-4">+</span>
                <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Jml Saham Baru (Juta)</label>
                    <input type="text" value={formatNum(ratioNew)} onChange={handleInput(setRatioNew)} className="w-full p-2 border rounded text-center font-bold bg-slate-50" placeholder="100" />
                    {/* INDIKATOR NILAI SEBENARNYA */}
                    <p className="text-[10px] text-slate-400 mt-1 font-mono text-center">= {formatNum(ratioNew * 1000000)} Lbr</p>
                </div>
            </div>
            <p className="text-[9px] text-slate-400 mt-3 italic text-center border-t pt-2 border-slate-100">*Masukkan angka dalam satuan JUTA (Contoh: 500 = 500.000.000)</p>
          </div>
      </div>
        
      <div className="p-6 bg-white">
          {result && (
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 shadow-sm relative overflow-hidden text-center">
                 <p className="text-[10px] font-bold text-orange-700 uppercase tracking-widest mb-1">Harga Teoritis (TERP)</p>
                 <h2 className="text-4xl font-black text-slate-800 tracking-tight">{formatIDR(result.terp)}</h2>
                 <div className="mt-2 inline-block px-3 py-1 bg-white rounded-full border border-orange-100 shadow-sm">
                    <span className="text-xs font-bold text-red-500">{result.dilution.toFixed(2)}%</span> <span className="text-[10px] text-slate-400">Potensi Dilusi</span>
                 </div>
              </div>

              <div className="text-center">
                 <button onClick={() => setShowFormula(!showFormula)} className="text-xs font-bold text-slate-400 underline hover:text-orange-600 transition-colors">
                    {showFormula ? "Sembunyikan Rumus" : "Lihat Cara Hitung"}
                 </button>
              </div>

              {showFormula && (
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-[10px] font-mono text-slate-600 space-y-2 animate-fade-in">
                    <div className="flex justify-between"><span>Valuasi Lama:</span> <span className="font-bold">{formatNum(ratioOld)} (Jt) x {hargaPasar} = {formatCompact(result.totalValOld)}</span></div>
                    <div className="flex justify-between border-b border-dashed border-slate-300 pb-1"><span>Valuasi Baru:</span> <span className="font-bold">{formatNum(ratioNew)} (Jt) x {hargaTebus} = {formatCompact(result.totalValNew)}</span></div>
                    <div className="flex justify-between pt-1 text-slate-800"><span>Total Nilai:</span> <span className="font-bold">{formatCompact(result.totalValOld + result.totalValNew)} (Jt)</span></div>
                    <div className="flex justify-between text-slate-800"><span>Total Saham:</span> <span className="font-bold">{formatNum(result.totalShares)} (Jt) Lbr</span></div>
                    <div className="text-right text-orange-600 font-bold pt-2 border-t border-slate-300 mt-1">Hasil = {formatIDR(result.terp)}</div>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}

// ==========================================
// 4. GAME LOGIKA & MEMORI
// ==========================================
function MathGame() {
  const [gameState, setGameState] = useState<GameState>("LOGIN");
  const [password, setPassword] = useState("");
  const [config, setConfig] = useState({ totalSoal: 10, totalTime: 300, difficulty: "MENENGAH" as Difficulty, mode: "STORY" as GameMode });
  const [currentQ, setCurrentQ] = useState({ q: [] as string[], a: 0, formula: "" });
  const [inputAns, setInputAns] = useState("");
  const [score, setScore] = useState(0); 
  const [questionCount, setQuestionCount] = useState(0); 
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSkipping, setIsSkipping] = useState(false); 
  const [feedback, setFeedback] = useState<Feedback>("NONE");
  const timerRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "bapak123") setGameState("SETUP");
    else alert("Password salah Pak! Coba lagi.");
  };

  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const getRanges = (diff: Difficulty) => {
    if (diff === "PEMULA") return { min: 1, max: 20, storySteps: 3 };
    if (diff === "MENENGAH") return { min: 10, max: 100, storySteps: 4 };
    return { min: 50, max: 500, storySteps: 6 };
  };

  const generateStory = () => {
    const { storySteps } = getRanges(config.difficulty);
    const scenarios = [
      { type: "LIFT", places: ["Lantai 1", "Lantai 2", "Lantai 3", "Lantai 5", "Lantai 8", "Lantai Dasar"], verbs: { enter: "naik", leave: "turun" }, subjects: ["Kakek", "Nenek", "Ibu Hamil", "Bocil", "Kurir Paket", "Satpam", "Karyawan"] },
      { type: "ANGKOT", places: ["Pasar", "Terminal", "Sekolah", "Simpang Lima", "Lampu Merah", "Gang Mangga"], verbs: { enter: "naik", leave: "turun" }, subjects: ["Pelajar", "Emak-emak", "Pak Haji", "Pengamen", "Pedagang Sayur"] },
      { type: "KANDANG", places: ["Kandang Ayam", "Halaman Belakang", "Kebun", "Tepi Sungai"], verbs: { enter: "masuk", leave: "kabur" }, subjects: ["Ayam", "Bebek", "Entok", "Kambing", "Kelinci"] },
      { type: "WARUNG", places: ["Warung Bu Ijah", "Toko Sembako", "Gudang"], verbs: { enter: "beli", leave: "habis/pecah" }, subjects: ["Galon", "Tabung Gas", "Karung Beras", "Kardus Mie", "Telur"] }
    ];
    const scene = scenarios[rand(0, scenarios.length - 1)];
    const mainSubject = scene.subjects[rand(0, scene.subjects.length - 1)];
    let count = rand(2, 10);
    let formulaStr = `${count}`; 
    let log = [`Awalnya di ${scene.places[0]} ada ${count} ${mainSubject}.`];
    for (let i = 0; i < storySteps; i++) {
        const place = scene.places[rand(1, scene.places.length - 1)];
        const isAdd = Math.random() > 0.5; 
        if (isAdd) {
            const num = rand(1, 5); count += num; formulaStr += ` + ${num}`; 
            log.push(`Di ${place}, ${scene.verbs.enter} ${num} ${mainSubject}.`);
        } else {
            const num = rand(1, count > 1 ? count - 1 : 1);
            if (count > 0 && num > 0) { count -= num; formulaStr += ` - ${num}`; log.push(`Di ${place}, ${scene.verbs.leave} ${num} ${mainSubject}.`); } 
            else { const numAdd = rand(1, 3); count += numAdd; formulaStr += ` + ${numAdd}`; log.push(`Di ${place}, ${scene.verbs.enter} ${numAdd} ${mainSubject}.`); }
        }
    }
    return { q: log, a: count, formula: formulaStr };
  };

  const generateMath = () => {
    const modes = ["ADD", "SUB", "MUL", "DIV"];
    const m = modes[Math.floor(Math.random() * modes.length)];
    const { min, max } = getRanges(config.difficulty);
    let n1 = 0, n2 = 0, qText = "", a = 0, f = "";
    if (m === "ADD") { n1 = rand(min, max); n2 = rand(min, max); qText = `${n1} + ${n2} = ?`; a = n1 + n2; f = `${n1} + ${n2}`; }
    else if (m === "SUB") { n1 = rand(min, max); n2 = rand(min, n1); qText = `${n1} - ${n2} = ?`; a = n1 - n2; f = `${n1} - ${n2}`; }
    else if (m === "MUL") { n1 = rand(min, 12); n2 = rand(2, 10); qText = `${n1} × ${n2} = ?`; a = n1 * n2; f = `${n1} x ${n2}`; }
    else if (m === "DIV") { n2 = rand(2, 10); a = rand(min, max); n1 = n2 * a; qText = `${n1} : ${n2} = ?`; a = a; f = `${n1} : ${n2}`; }
    return { q: [qText], a, formula: f };
  };

  const generateQuestion = () => {
    let quest; if (config.mode === "STORY") quest = generateStory(); else quest = generateMath();
    setCurrentQ(quest); setInputAns(""); setFeedback("NONE"); setIsSkipping(false);
    setTimeout(() => { if(inputRef.current) inputRef.current.focus(); }, 100);
  };

  const startGame = () => { setScore(0); setQuestionCount(1); setTimeLeft(config.totalTime); setGameState("PLAY"); generateQuestion(); };

  useEffect(() => {
    if (gameState === "PLAY" && !isSkipping && feedback !== "CORRECT") {
      timerRef.current = setInterval(() => { setTimeLeft((prev) => { if (prev <= 0.1) { clearInterval(timerRef.current); setGameState("GAMEOVER"); return 0; } return prev - 0.1; }); }, 100);
    } return () => clearInterval(timerRef.current);
  }, [gameState, isSkipping, feedback]);

  const checkAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSkipping || feedback === "CORRECT") return;
    const val = e.target.value; setInputAns(val);
    const numVal = parseInt(val); const correctVal = currentQ.a;
    if (numVal === correctVal) {
      setFeedback("CORRECT"); 
      setTimeout(() => { if (questionCount >= config.totalSoal) { setScore(s => s + 1); setGameState("WIN"); } else { setScore(s => s + 1); setQuestionCount(c => c + 1); generateQuestion(); } }, 1000);
    } else {
      if (val.length >= correctVal.toString().length) { if (numVal !== correctVal) { setFeedback("WRONG"); setTimeout(() => { setFeedback("NONE"); setInputAns(""); }, 500); } } else { setFeedback("NONE"); }
    }
  };

  const handleGiveUp = () => { setIsSkipping(true); setInputAns(currentQ.a.toString()); setTimeout(() => { if (questionCount >= config.totalSoal) { setGameState("WIN"); } else { setQuestionCount(c => c + 1); generateQuestion(); } }, 2000); };

  if (gameState === "LOGIN") return (<div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-auto mt-10 text-center"><h2 className="text-2xl font-bold text-orange-600 mb-2">🔒 Area Terbatas</h2><p className="text-sm text-slate-500 mb-4">Masukkan password khusus Bapak.</p><form onSubmit={handleLogin} className="space-y-4"><input type="password" placeholder="Password..." className="w-full p-3 border rounded-lg text-center text-lg font-bold" value={password} onChange={e => setPassword(e.target.value)} /><button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600">BUKA GAME</button></form></div>);
  if (gameState === "SETUP") return (<div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto mt-4"><h2 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">⚙️ Setting Game</h2><div className="space-y-4"><div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pilih Mode</label><div className="flex gap-2"><button onClick={() => setConfig({...config, mode: "STORY"})} className={`flex-1 p-3 rounded-lg text-sm font-bold border-2 transition-all ${config.mode === "STORY" ? "border-orange-500 bg-orange-50 text-orange-600" : "border-slate-100 bg-white text-slate-400"}`}>📖 Cerita (Logika)</button><button onClick={() => setConfig({...config, mode: "MATH"})} className={`flex-1 p-3 rounded-lg text-sm font-bold border-2 transition-all ${config.mode === "MATH" ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-100 bg-white text-slate-400"}`}>🧮 Hitungan (Cepat)</button></div></div><div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tingkat Kesulitan</label><div className="grid grid-cols-3 gap-2">{(["PEMULA", "MENENGAH", "PRO"] as Difficulty[]).map((d) => (<button key={d} onClick={() => setConfig({...config, difficulty: d})} className={`p-2 rounded text-[10px] font-bold transition-all ${config.difficulty === d ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500"}`}>{d}</button>))}</div></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jumlah Soal</label><input type="number" value={config.totalSoal} onChange={e => setConfig({...config, totalSoal: Number(e.target.value)})} className="w-full p-2 border rounded font-bold text-center" /></div><div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Waktu (Detik)</label><input type="number" value={config.totalTime} onChange={e => setConfig({...config, totalTime: Number(e.target.value)})} className="w-full p-2 border rounded font-bold text-center" /></div></div><button onClick={startGame} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:bg-emerald-700 transition-all mt-4">MULAI MAIN!</button></div></div>);
  if (gameState === "WIN" || gameState === "GAMEOVER") { const percentage = (score / config.totalSoal) * 100; const isGreat = percentage >= 80; return (<div className={`rounded-xl shadow-lg p-8 max-w-sm mx-auto mt-10 text-center border-4 ${isGreat ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}><div className="text-6xl mb-4">{isGreat ? "🧠" : "😅"}</div><h2 className="text-2xl font-bold text-slate-800 mb-1">{gameState === "GAMEOVER" ? "WAKTU HABIS!" : "SELESAI!"}</h2><div className="bg-white p-4 rounded-xl shadow-sm my-6"><p className="text-xs text-slate-400 uppercase font-bold">Skor Akhir</p><div className="text-4xl font-black text-slate-800">{score} <span className="text-lg text-slate-400 font-normal">/ {config.totalSoal}</span></div><div className={`mt-2 font-bold ${isGreat ? "text-emerald-600" : "text-orange-500"}`}>({percentage.toFixed(0)}% Benar)</div></div>{isGreat ? <div className="bg-emerald-100 text-emerald-800 p-3 rounded-lg text-sm font-bold mb-6 animate-bounce">"Hebat Pak! Otak masih sangat encer!" 🌟</div> : <p className="text-slate-500 text-sm mb-6">Lumayan Pak. Latihan lagi biar makin tajam!</p>}<button onClick={() => setGameState("SETUP")} className="w-full bg-slate-700 text-white py-3 rounded-lg font-bold">MAIN LAGI</button></div>); }

  const percentage = (timeLeft / config.totalTime) * 100; let barColor = "bg-emerald-500"; if (percentage < 50) barColor = "bg-yellow-400"; if (percentage < 20) barColor = "bg-red-500";

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-md mx-auto border border-slate-200 relative">
      <div className="h-4 w-full bg-slate-100"><div className={`h-full transition-all duration-100 ease-linear ${barColor}`} style={{ width: `${percentage}%` }}/></div>
      <div className="p-4 flex justify-between items-center border-b bg-slate-50"><span className="font-bold text-slate-700 text-xs uppercase">Soal <span className="text-base text-slate-900">{questionCount}</span> / {config.totalSoal}</span><div className="flex gap-4 items-center"><span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs border border-emerald-100">✅ {score} Benar</span><span className="font-mono font-bold text-slate-500 text-sm">⏱ {timeLeft.toFixed(0)}s</span></div></div>
      <div className="p-6 text-center space-y-6 relative">
        <div className="py-2">{config.mode === "STORY" ? (<div className="bg-blue-50 p-4 rounded-lg text-left space-y-3 text-sm text-slate-700 font-medium border border-blue-100"><div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Skenario:</div>{currentQ.q.map((line, idx) => (<div key={idx} className="flex gap-2 items-start"><span className="text-blue-300 font-bold select-none">•</span><span className="leading-snug">{line}</span></div>))}<div className="pt-3 font-bold text-blue-800 border-t border-blue-200 mt-2 text-center">Pertanyaan: Berapa jumlah akhir?</div></div>) : (<div className="text-5xl font-extrabold text-slate-800 tracking-wider pt-4">{currentQ.q[0]}</div>)}</div>
        <div className="relative"><input ref={inputRef} type="number" value={inputAns} onChange={checkAnswer} placeholder="..." autoFocus disabled={isSkipping || feedback === "CORRECT"} className={`w-32 mx-auto block p-2 text-center text-4xl font-bold border-b-4 outline-none bg-transparent transition-colors ${isSkipping ? "border-blue-500 text-blue-600 animate-pulse" : feedback === "WRONG" ? "border-red-500 text-red-600" : feedback === "CORRECT" ? "border-emerald-500 text-emerald-600" : "border-slate-300 focus:border-orange-500 text-slate-800"}`}/>{feedback === "WRONG" && (<div className="absolute left-0 right-0 -bottom-16 animate-bounce"><span className="text-red-500 text-6xl">❌</span></div>)}{feedback === "CORRECT" && (<div className="absolute left-0 right-0 -bottom-16 animate-bounce"><span className="text-emerald-500 text-6xl">✅</span></div>)}{isSkipping && (<div className="absolute left-0 right-0 -bottom-12 flex flex-col items-center animate-bounce"><span className="text-blue-600 font-bold text-[10px] uppercase tracking-wide">Rumus & Jawaban:</span><span className="text-blue-800 font-mono text-sm font-bold bg-blue-100 px-3 py-1 rounded shadow-sm border border-blue-200 whitespace-nowrap">{currentQ.formula} = {currentQ.a}</span></div>)}</div>
        <div className="pt-6"><button onClick={handleGiveUp} disabled={isSkipping || feedback === "CORRECT"} className="text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 px-4 py-2 rounded-full transition-colors border border-transparent hover:border-red-100">{isSkipping ? "Lanjut..." : "🏳️ Lewati / Menyerah"}</button></div>
      </div>
    </div>
  );
}