"use client";
import { useState, useEffect } from "react";

// --- TIPE DATA ---
type Mode = "SCALE_IN" | "SCALE_OUT";
type Method = "NORMAL" | "MARTINGALE" | "FIBONACCI";

export default function ProfessionalStockCalculator() {
  // --- INPUT STATE ---
  const [mode, setMode] = useState<Mode>("SCALE_IN");
  const [emiten, setEmiten] = useState("TPMA");
  const [totalInput, setTotalInput] = useState(100000000); 
  const [startPrice, setStartPrice] = useState(605);
  const [targetPrice, setTargetPrice] = useState(505);
  const [method, setMethod] = useState<Method>("MARTINGALE");
  const [multiplier, setMultiplier] = useState(2.0);

  // --- OUTPUT STATE ---
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [autoSteps, setAutoSteps] = useState(0);
  const [spreadPct, setSpreadPct] = useState(0);

  // --- FORMATTER ---
  const formatIDR = (num: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
  const formatNum = (num: number) => new Intl.NumberFormat("id-ID").format(num);

  const handleInputAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.replace(/\D/g, "");
    setTotalInput(Number(cleanValue));
  };

  // --- LOGIKA TICK SIZE BEI ---
  const roundToTick = (price: number) => {
    let tick = 1;
    if (price < 200) tick = 1;
    else if (price >= 200 && price < 500) tick = 2;
    else if (price >= 500 && price < 2000) tick = 5;
    else if (price >= 2000 && price < 5000) tick = 10;
    else tick = 25;
    return Math.round(price / tick) * tick;
  };

  // --- LOGIKA UTAMA ---
  const calculateStrategy = () => {
    const spread = Math.abs(startPrice - targetPrice) / startPrice;
    setSpreadPct(spread * 100);

    let steps = 3;
    if (spread < 0.10) steps = 3;       
    else if (spread < 0.25) steps = 5;  
    else if (spread < 0.50) steps = 8;  
    else steps = 13;                    
    
    setAutoSteps(steps);

    let weights: number[] = [];
    if (method === "NORMAL") {
      weights = Array(steps).fill(1);
    } else if (method === "MARTINGALE") {
      for (let i = 0; i < steps; i++) weights.push(Math.pow(multiplier, i));
    } else if (method === "FIBONACCI") {
      let a = 1, b = 1;
      for (let i = 0; i < steps; i++) {
        weights.push(a);
        const temp = a + b;
        a = b;
        b = temp;
      }
    }

    if (mode === "SCALE_OUT") {
       weights.sort((a, b) => b - a); 
    }

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
        accumLot: accumLot,
        avgPrice: Math.round(avgPrice || 0)
      });
    }

    setResults(tempResults);
    setSummary({
      totalMoney: totalExecValue,
      totalLot: totalExecLot,
      finalAvg: accumValue / (accumLot * 100) || 0
    });
  };

  useEffect(() => {
    calculateStrategy();
  }, [mode, totalInput, startPrice, targetPrice, method, multiplier]);

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* HEADER */}
        <div className={`p-5 ${mode === 'SCALE_IN' ? 'bg-emerald-700' : 'bg-red-700'} text-white relative`}>
          <h1 className="text-xl md:text-2xl font-bold">Kalkulator Strategi Pro - {emiten}</h1>
          <p className="opacity-90 text-xs md:text-sm">Mode: {mode === 'SCALE_IN' ? 'Scale In (Akumulasi Beli)' : 'Scale Out (Distribusi Jual)'}</p>
          <div className="absolute top-5 right-5 font-mono font-bold text-white/60 tracking-wider text-xs">@illusix</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          
          {/* KOLOM KIRI: INPUT PARAMETER */}
          <div className="p-5 bg-slate-50 border-r border-slate-200 space-y-4">
            
            {/* Tombol Mode */}
            <div className="flex bg-slate-200 rounded-lg p-1">
              <button 
                onClick={() => setMode("SCALE_IN")}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${mode === "SCALE_IN" ? "bg-white shadow text-emerald-700" : "text-slate-500"}`}
              >
                Scale In (Buy)
              </button>
              <button 
                onClick={() => setMode("SCALE_OUT")}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${mode === "SCALE_OUT" ? "bg-white shadow text-red-700" : "text-slate-500"}`}
              >
                Scale Out (Sell)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Kode Emiten</label>
                <input type="text" value={emiten} onChange={(e) => setEmiten(e.target.value.toUpperCase())} className="w-full p-2 border rounded font-bold uppercase" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">{mode === 'SCALE_IN' ? 'Total Modal (Rp)' : 'Total Lot Awal'}</label>
                <input 
                  type="text" 
                  value={formatNum(totalInput)} 
                  onChange={handleInputAmount}
                  className="w-full p-2 border rounded font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Harga Awal</label>
                <input type="number" value={startPrice} onChange={(e) => setStartPrice(Number(e.target.value))} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Harga Target</label>
                <input type="number" value={targetPrice} onChange={(e) => setTargetPrice(Number(e.target.value))} className="w-full p-2 border rounded" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Metode Alokasi</label>
              <select value={method} onChange={(e) => setMethod(e.target.value as Method)} className="w-full p-2 border rounded mt-1 bg-white text-sm">
                <option value="NORMAL">Normal (Flat)</option>
                <option value="MARTINGALE">Martingale (Multiplier)</option>
                <option value="FIBONACCI">Fibonacci</option>
              </select>
            </div>

            {/* FAKTOR PENGALI (Dikecilkan sesuai request) */}
            {method === "MARTINGALE" && (
              <div className="bg-white p-2 rounded border border-slate-200 inline-block">
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Faktor Pengali (x)</label>
                <input type="number" step="0.1" value={multiplier} onChange={(e) => setMultiplier(Number(e.target.value))} className="w-20 p-1 border rounded text-center font-bold" />
              </div>
            )}

            <div className="bg-blue-50 p-3 rounded text-xs text-blue-800 border border-blue-100">
              <p>Spread: <strong>{spreadPct.toFixed(2)}%</strong> → Saran: <strong>{autoSteps} Level</strong></p>
            </div>
          </div>

          {/* KOLOM KANAN: HASIL */}
          <div className="lg:col-span-2 p-5 bg-white">
            
            {/* CARD SUMMARY (Dibuat Stack di HP, Grid di Desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Estimasi Uang</p>
                <p className="text-lg font-bold text-slate-800">{formatIDR(summary.totalMoney)}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Total Lot</p>
                <p className="text-lg font-bold text-blue-600">{formatNum(summary.totalLot)} <span className="text-xs text-slate-400">Lot</span></p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Avg. Price</p>
                <p className="text-lg font-bold text-emerald-600">{formatIDR(summary.finalAvg)}</p>
              </div>
            </div>

            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-xs md:text-sm text-right">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2 text-center">Lvl</th>
                    <th className="p-2 text-emerald-700">Harga</th>
                    <th className="p-2 hidden md:table-cell">Bobot</th>
                    <th className="p-2">Lot</th>
                    <th className="p-2">Value (Rp)</th>
                    <th className="p-2 text-blue-700">Avg Run</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-2 text-center font-bold text-slate-400">{r.level}</td>
                      <td className="p-2 font-mono font-bold text-emerald-700">{formatNum(r.price)}</td>
                      <td className="p-2 text-slate-500 hidden md:table-cell">{r.weightPct}%</td>
                      <td className="p-2 font-bold">{formatNum(r.lot)}</td>
                      <td className="p-2 text-slate-600">{formatIDR(r.value)}</td>
                      <td className="p-2 font-bold text-blue-600">{formatNum(r.avgPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}