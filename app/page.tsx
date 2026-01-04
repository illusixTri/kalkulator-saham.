"use client";
import { useState, useEffect, useRef } from "react";

// --- TIPE DATA ---
type Tab = "SCALE" | "RIGHT_ISSUE" | "GAME";
type Mode = "SCALE_IN" | "SCALE_OUT";
type Method = "NORMAL" | "MARTINGALE" | "FIBONACCI";
type GameMode = "ADD" | "SUB" | "MUL" | "DIV" | "RANDOM";
type GameState = "LOGIN" | "SETUP" | "PLAY" | "GAMEOVER" | "WIN";

export default function SuperStockApp() {
  const [activeTab, setActiveTab] = useState<Tab>("SCALE");

  // --- DOKUMENTASI PANDUAN (Hanya muncul di Tab Saham) ---
  const renderGuide = () => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-sm space-y-3 mb-24">
      <h3 className="font-bold text-slate-700 uppercase border-b pb-2">📖 Panduan Singkat</h3>
      <details className="group"><summary className="font-bold text-emerald-700 cursor-pointer list-none flex justify-between"><span>1. Scale In</span><span className="group-open:rotate-180 transition-transform">▼</span></summary><p className="text-slate-600 mt-2 text-xs leading-relaxed">Strategi cicil beli (piramida) saat harga turun.</p></details>
      <details className="group"><summary className="font-bold text-red-700 cursor-pointer list-none flex justify-between"><span>2. Scale Out</span><span className="group-open:rotate-180 transition-transform">▼</span></summary><p className="text-slate-600 mt-2 text-xs leading-relaxed">Strategi cicil jual (distribusi) saat harga naik.</p></details>
      <details className="group"><summary className="font-bold text-indigo-700 cursor-pointer list-none flex justify-between"><span>3. Right Issue</span><span className="group-open:rotate-180 transition-transform">▼</span></summary><p className="text-slate-600 mt-2 text-xs leading-relaxed">Hitung jual induk untuk tebus right (Tail Swallowing).</p></details>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-20">
      {/* --- MENU TAB ATAS --- */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex overflow-x-auto">
          <button onClick={() => setActiveTab("SCALE")} className={`flex-1 py-4 text-xs md:text-sm font-bold uppercase tracking-wider border-b-4 transition-colors shrink-0 ${activeTab === "SCALE" ? "border-emerald-600 text-emerald-700 bg-emerald-50" : "border-transparent text-slate-400"}`}>💰 Scale In/Out</button>
          <button onClick={() => setActiveTab("RIGHT_ISSUE")} className={`flex-1 py-4 text-xs md:text-sm font-bold uppercase tracking-wider border-b-4 transition-colors shrink-0 ${activeTab === "RIGHT_ISSUE" ? "border-indigo-600 text-indigo-700 bg-indigo-50" : "border-transparent text-slate-400"}`}>📉 Right Issue</button>
          <button onClick={() => setActiveTab("GAME")} className={`flex-1 py-4 text-xs md:text-sm font-bold uppercase tracking-wider border-b-4 transition-colors shrink-0 ${activeTab === "GAME" ? "border-orange-500 text-orange-600 bg-orange-50" : "border-transparent text-slate-400"}`}>🎮 Game Bapak2</button>
        </div>
      </div>

      {/* --- AREA KONTEN --- */}
      <div className="p-3 md:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {activeTab === "SCALE" && <ScaleCalculator />}
          {activeTab === "RIGHT_ISSUE" && <RightIssueCalculator />}
          {activeTab === "GAME" && <MathGame />}
          
          {activeTab !== "GAME" && renderGuide()}
        </div>
      </div>

      {/* --- STICKY CONTACT BAR (DUAL BUTTON) --- */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] flex shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <a href="https://t.me/+zrEOLwygGCBhZTQ1" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#0088cc] text-white p-3 flex items-center justify-center gap-2 hover:bg-[#0077b5] transition-colors border-r border-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-white stroke-none"><path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-8.609 3.33c-2.068.8-4.133 1.598-5.724 2.21a405.15 405.15 0 0 1-2.849 1.09c-.42.147-.99.332-1.473.901-.728.968.193 1.798.919 2.286 1.61.516 3.275 1.009 4.654 1.472.509 1.793.997 3.592 1.48 5.388.16.36.506.494.864.498l-.002.018s.281.028.555-.038a2.1 2.1 0 0 0 .933-.517c.345-.324 1.28-1.244 1.811-1.764l3.999 2.952.032.018s.442.311 1.09.355c.324.022.75-.04 1.116-.308.37-.27.613-.702.728-1.196.342-1.492 2.61-12.285 2.997-14.072l-.01.042c.27-1.006.17-1.928-.455-2.381a2.24 2.24 0 0 0-1.635-.499Z"/></svg>
          <div className="flex flex-col leading-none text-left"><span className="text-[9px] opacity-80 uppercase font-bold">Gabung</span><span className="font-bold text-sm">Grup RLA</span></div>
        </a>
        <a href="https://wa.me/6281299053961" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white p-3 flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-white stroke-none"><path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.303-.345.451-.523.151-.18.2-.3.301-.497.098-.196.05-.371-.025-.523-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.005-.372-.005-.572-.005-.201 0-.523.074-.797.372-.271.297-1.047 1.016-1.047 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.767-.721 2.016-1.418.25-.699.25-1.297.174-1.418-.075-.119-.272-.196-.572-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.07 0C5.537 0 .227 5.33.227 11.87c0 2.089.544 4.128 1.577 5.939L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          <div className="flex flex-col leading-none text-left"><span className="text-[9px] opacity-80 uppercase font-bold">Chat Admin</span><span className="font-bold text-sm">WhatsApp</span></div>
        </a>
      </div>
    </div>
  );
}

// ==========================================
// 3. GAME BAPAK-BAPAK
// ==========================================
function MathGame() {
  const [gameState, setGameState] = useState<GameState>("LOGIN");
  const [password, setPassword] = useState("");
  const [config, setConfig] = useState({ totalSoal: 20, timePerSoal: 5, mode: "RANDOM" as GameMode });
  const [currentQ, setCurrentQ] = useState({ q: "", a: 0 });
  const [inputAns, setInputAns] = useState("");
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- LOGIKA PASSWORD ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "bapak123") setGameState("SETUP");
    else alert("Password salah Pak! Coba lagi.");
  };

  // --- LOGIKA GAME ---
  const generateQuestion = () => {
    let m = config.mode;
    if (m === "RANDOM") {
      const modes: GameMode[] = ["ADD", "SUB", "MUL", "DIV"];
      m = modes[Math.floor(Math.random() * modes.length)];
    }

    let n1 = 0, n2 = 0, q = "", a = 0;
    
    if (m === "ADD") {
      n1 = Math.floor(Math.random() * 50) + 1;
      n2 = Math.floor(Math.random() * 50) + 1;
      q = `${n1} + ${n2}`; a = n1 + n2;
    } else if (m === "SUB") {
      n1 = Math.floor(Math.random() * 50) + 20; 
      n2 = Math.floor(Math.random() * n1); 
      q = `${n1} - ${n2}`; a = n1 - n2;
    } else if (m === "MUL") {
      n1 = Math.floor(Math.random() * 10) + 2; 
      n2 = Math.floor(Math.random() * 10) + 2;
      q = `${n1} × ${n2}`; a = n1 * n2;
    } else if (m === "DIV") {
      n2 = Math.floor(Math.random() * 9) + 2; 
      a = Math.floor(Math.random() * 10) + 1; 
      n1 = n2 * a; // Biar pembagian bulat
      q = `${n1} : ${n2}`;
    }

    setCurrentQ({ q, a });
    setInputAns("");
    setTimeLeft(config.timePerSoal);
    if(inputRef.current) inputRef.current.focus();
  };

  const startGame = () => {
    setProgress(1);
    setGameState("PLAY");
    generateQuestion();
  };

  // Timer logic
  useEffect(() => {
    if (gameState === "PLAY") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setGameState("GAMEOVER");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, currentQ]); // Reset timer setiap soal baru

  const checkAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputAns(val);
    
    if (parseInt(val) === currentQ.a) {
      // BENAR
      if (progress >= config.totalSoal) {
        setGameState("WIN");
      } else {
        setProgress(p => p + 1);
        generateQuestion();
      }
    }
  };

  // --- UI RENDER ---
  if (gameState === "LOGIN") return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-auto mt-10 text-center">
      <h2 className="text-2xl font-bold text-orange-600 mb-2">🔒 Area Terbatas</h2>
      <p className="text-sm text-slate-500 mb-4">Masukkan password khusus Bapak.</p>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="password" placeholder="Password..." className="w-full p-3 border rounded-lg text-center text-lg font-bold" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600">BUKA GAME</button>
      </form>
    </div>
  );

  if (gameState === "SETUP") return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto mt-4">
      <h2 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">⚙️ Setting Game</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mode Operasi</label>
          <div className="grid grid-cols-5 gap-1">
            {["ADD", "SUB", "MUL", "DIV", "RANDOM"].map((m) => (
              <button key={m} onClick={() => setConfig({...config, mode: m as GameMode})} className={`p-2 rounded text-xs font-bold ${config.mode === m ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                {m === "ADD" ? "+" : m === "SUB" ? "-" : m === "MUL" ? "×" : m === "DIV" ? ":" : "ACAK"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jumlah Soal</label>
            <input type="number" value={config.totalSoal} onChange={e => setConfig({...config, totalSoal: Number(e.target.value)})} className="w-full p-2 border rounded font-bold text-center" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Waktu (Detik)</label>
            <input type="number" value={config.timePerSoal} onChange={e => setConfig({...config, timePerSoal: Number(e.target.value)})} className="w-full p-2 border rounded font-bold text-center" />
          </div>
        </div>

        <button onClick={startGame} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:bg-emerald-700 transition-all mt-4">MULAI MAIN!</button>
      </div>
    </div>
  );

  if (gameState === "GAMEOVER") return (
    <div className="bg-red-50 rounded-xl shadow-lg p-8 max-w-sm mx-auto mt-10 text-center border-2 border-red-200">
      <div className="text-6xl mb-4">⏰</div>
      <h2 className="text-3xl font-bold text-red-600 mb-2">WAKTU HABIS!</h2>
      <p className="text-slate-600 mb-6">Jangan menyerah Pak, coba lagi lebih cepat!</p>
      <div className="text-lg font-bold bg-white p-3 rounded mb-4">Skor: {progress - 1} / {config.totalSoal}</div>
      <button onClick={() => setGameState("SETUP")} className="w-full bg-red-600 text-white py-3 rounded-lg font-bold">COBA LAGI</button>
    </div>
  );

  if (gameState === "WIN") return (
    <div className="bg-emerald-50 rounded-xl shadow-lg p-8 max-w-sm mx-auto mt-10 text-center border-2 border-emerald-200">
      <div className="text-6xl mb-4">🏆</div>
      <h2 className="text-3xl font-bold text-emerald-700 mb-2">LUAR BIASA!</h2>
      <p className="text-slate-600 mb-6">Otak Bapak sangat sehat & encer!</p>
      <button onClick={() => setGameState("SETUP")} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold">MAIN LAGI</button>
    </div>
  );

  // PLAY SCREEN
  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-md mx-auto border border-slate-200">
      {/* Header Progress */}
      <div className="bg-slate-100 p-3 flex justify-between items-center border-b">
        <span className="font-bold text-slate-600">Soal {progress} / {config.totalSoal}</span>
        <span className={`font-mono font-bold px-3 py-1 rounded ${timeLeft <= 3 ? "bg-red-100 text-red-600 animate-pulse" : "bg-blue-100 text-blue-600"}`}>⏱ {timeLeft}s</span>
      </div>

      {/* Soal Area */}
      <div className="p-8 text-center space-y-6">
        <div className="text-5xl font-extrabold text-slate-800 tracking-wider">
          {currentQ.q} = ?
        </div>

        <input 
          ref={inputRef}
          type="number" 
          value={inputAns} 
          onChange={checkAnswer} 
          placeholder="..." 
          autoFocus
          className="w-32 mx-auto block p-2 text-center text-4xl font-bold border-b-4 border-slate-300 focus:border-orange-500 outline-none bg-transparent"
        />

        <p className="text-xs text-slate-400 italic">Isi jawaban yang benar untuk lanjut...</p>
      </div>
    </div>
  );
}

// ==========================================
// 1. KOMPONEN KALKULATOR SCALE IN/OUT (UTUH)
// ==========================================
function ScaleCalculator() {
  const [mode, setMode] = useState<Mode>("SCALE_IN");
  const [emiten, setEmiten] = useState("ABCD");
  const [totalInput, setTotalInput] = useState(50000000); 
  const [startPrice, setStartPrice] = useState(605);
  const [targetPrice, setTargetPrice] = useState(505);
  const [method, setMethod] = useState<Method>("MARTINGALE");
  const [multiplier, setMultiplier] = useState(2.0);
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [autoSteps, setAutoSteps] = useState(0);
  const [spreadPct, setSpreadPct] = useState(0);
  const formatIDR = (num: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
  const formatNum = (num: number) => new Intl.NumberFormat("id-ID").format(num);
  const handleInputAmount = (e: React.ChangeEvent<HTMLInputElement>) => { const cleanValue = e.target.value.replace(/\D/g, ""); setTotalInput(Number(cleanValue)); };
  useEffect(() => { if (mode === "SCALE_IN") { if (emiten === "DCBA") { setEmiten("ABCD"); setTotalInput(50000000); } } else { if (emiten === "ABCD") { setEmiten("DCBA"); setTotalInput(1000); } } }, [mode]);
  const roundToTick = (price: number) => { let tick = 1; if (price < 200) tick = 1; else if (price >= 200 && price < 500) tick = 2; else if (price >= 500 && price < 2000) tick = 5; else if (price >= 2000 && price < 5000) tick = 10; else tick = 25; return Math.round(price / tick) * tick; };
  const isInvalidTicker = emiten === "ABCD" || emiten === "DCBA";
  const calculateStrategy = () => { if (isInvalidTicker) { setResults([]); return; } const spread = Math.abs(startPrice - targetPrice) / startPrice; setSpreadPct(spread * 100); let steps = 3; if (spread < 0.10) steps = 3; else if (spread < 0.25) steps = 5; else if (spread < 0.50) steps = 8; else steps = 13; setAutoSteps(steps); let weights: number[] = []; if (method === "NORMAL") weights = Array(steps).fill(1); else if (method === "MARTINGALE") for (let i = 0; i < steps; i++) weights.push(Math.pow(multiplier, i)); else if (method === "FIBONACCI") { let a = 1, b = 1; for (let i = 0; i < steps; i++) { weights.push(a); const temp = a + b; a = b; b = temp; } } if (mode === "SCALE_OUT") weights.sort((a, b) => b - a); const totalWeight = weights.reduce((a, b) => a + b, 0); let tempResults = []; let priceStep = (targetPrice - startPrice) / (steps - 1); let accumLot = 0; let accumValue = 0; let totalExecValue = 0; let totalExecLot = 0; for (let i = 0; i < steps; i++) { let rawPrice = startPrice + (i * priceStep); let executedPrice = roundToTick(rawPrice); let weightPct = weights[i] / totalWeight; let currentLot = 0; let currentValue = 0; if (mode === "SCALE_IN") { let allocationRp = totalInput * weightPct; currentLot = Math.floor(allocationRp / (executedPrice * 100)); currentValue = currentLot * 100 * executedPrice; } else { let allocationLot = totalInput * weightPct; currentLot = Math.round(allocationLot); currentValue = currentLot * 100 * executedPrice; } accumLot += currentLot; accumValue += currentValue; totalExecValue += currentValue; totalExecLot += currentLot; let avgPrice = accumValue / (accumLot * 100); tempResults.push({ level: i + 1, price: executedPrice, weightPct: (weightPct * 100).toFixed(1), lot: currentLot, value: currentValue, avgPrice: Math.round(avgPrice || 0) }); } setResults(tempResults); setSummary({ totalMoney: totalExecValue, totalLot: totalExecLot, finalAvg: accumValue / (accumLot * 100) || 0 }); };
  useEffect(() => { calculateStrategy(); }, [mode, totalInput, startPrice, targetPrice, method, multiplier, emiten]);

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
          <div><label className="text-[10px] font-bold text-slate-500 uppercase">Metode</label><select value={method} onChange={(e) => setMethod(e.target.value as Method)} className="w-full p-2 border rounded bg-white text-sm"><option value="NORMAL">Normal</option><option value="MARTINGALE">Martingale</option><option value="FIBONACCI">Fibonacci</option></select></div>
          <div className="flex gap-2 items-end">
            {method === "MARTINGALE" && (<div className="w-24 shrink-0"><label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Faktor (x)</label><input type="number" step="0.1" value={multiplier} onChange={(e) => setMultiplier(Number(e.target.value))} className="w-full p-2 border rounded text-center font-bold" /></div>)}
            <div className="flex-1 bg-blue-50 border border-blue-100 rounded p-2 h-[38px] flex flex-col justify-center text-[10px] text-blue-800 leading-tight"><div className="flex justify-between items-center"><span>Spread: <strong>{spreadPct.toFixed(1)}%</strong></span><span>Saran: <strong>{autoSteps} Lvl</strong></span></div></div>
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
// 2. KOMPONEN KALKULATOR RIGHT ISSUE (UTUH)
// ==========================================
function RightIssueCalculator() {
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
  useEffect(() => { if (lotAwal === 0 || hargaPasar === 0 || hargaTebus === 0) return; const R = ratioOld / ratioNew; const isWorthy = hargaPasar > hargaTebus; const recommendation = isWorthy ? "GAS TEBUS! (Diskon)" : "JANGAN TEBUS! (Mahal)"; const pembagi = hargaTebus + (R * hargaPasar); const lotJual = Math.round((hargaTebus / pembagi) * lotAwal); const danaMasuk = lotJual * 100 * hargaPasar; const sisaLotLama = lotAwal - lotJual; const hakTebus = Math.floor((sisaLotLama / ratioOld) * ratioNew); const danaTebus = hakTebus * 100 * hargaTebus; const selisihCash = danaMasuk - danaTebus; const totalLotBaru = sisaLotLama + hakTebus; const growth = ((totalLotBaru - lotAwal) / lotAwal) * 100; let totalWaran = 0; if (hasWaran) totalWaran = Math.floor((hakTebus * waranNew) / waranOld); const valSisaLama = sisaLotLama * 100 * hargaPasar; const valBaru = danaTebus; const avgPrice = Math.round((valSisaLama + valBaru) / (totalLotBaru * 100)); setResult({ recommendation, isWorthy, lotJual, danaMasuk, hakTebus, danaTebus, selisihCash, totalLotBaru, growth, totalWaran, avgPrice }); }, [emiten, lotAwal, hargaPasar, hargaTebus, ratioOld, ratioNew, hasWaran, waranOld, waranNew]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-indigo-700 p-4 text-white relative">
        <h2 className="text-lg font-bold">Kalkulator Right Issue - {emiten}</h2>
        <p className="opacity-80 text-xs">Strategi: "Tail Swallowing" (Tanpa Top Up)</p>
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
          <div className="bg-white p-2 border rounded"><div className="flex items-center gap-3"><div className="flex-1"><label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Rasio Lama (Kiri)</label><input type="number" value={ratioOld} onChange={(e) => setRatioOld(Number(e.target.value))} className="w-full p-2 border rounded text-center font-bold bg-slate-50" /></div><span className="font-bold text-slate-400 text-lg mt-4">:</span><div className="flex-1"><label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Rasio Baru (Kanan)</label><input type="number" value={ratioNew} onChange={(e) => setRatioNew(Number(e.target.value))} className="w-full p-2 border rounded text-center font-bold bg-slate-50" /></div></div></div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200"><div className="flex items-center justify-between mb-2"><label className="text-xs font-bold text-slate-600">Ada Waran?</label><input type="checkbox" checked={hasWaran} onChange={(e) => setHasWaran(e.target.checked)} className="w-5 h-5 accent-indigo-600" /></div>{hasWaran && (<div className="flex items-center gap-2 text-xs"><span className="text-slate-500">Tiap</span><input type="number" value={waranOld} onChange={(e) => setWaranOld(Number(e.target.value))} className="w-12 p-1 border rounded text-center bg-white" /><span className="text-slate-500">Dpt</span><input type="number" value={waranNew} onChange={(e) => setWaranNew(Number(e.target.value))} className="w-12 p-1 border rounded text-center bg-white" /><span className="text-slate-500">Waran</span></div>)}</div>
          {result && (<div className="p-2 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900 text-center leading-tight">Jual induk <strong>{formatNum(result.lotJual)}</strong> lot untuk menebus <strong>{formatNum(result.hakTebus)}</strong> lot.</div>)}
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
                <div className="bg-white p-3 rounded-lg border shadow-sm text-right"><p className="text-[10px] text-slate-500 font-bold uppercase">Harga Rata-rata (Est)</p><p className="text-lg font-bold text-emerald-600">{formatIDR(result.avgPrice)}</p><span className="text-[10px] text-slate-400">Harga Modal Baru</span></div>
              </div>
              {hasWaran && (<div className="bg-white p-3 rounded-lg border shadow-sm flex justify-between items-center"><div><p className="text-[10px] text-slate-500 font-bold uppercase">Bonus Waran</p><p className="text-xl font-bold text-orange-600">{formatNum(result.totalWaran)}</p></div><span className="text-xs text-slate-400">Lembar Gratis</span></div>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}