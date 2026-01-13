import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 1. Ambil tanggal dari URL
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date'); 

  if (!date) {
    return NextResponse.json({ error: 'Tanggal kosong' }, { status: 400 });
  }

  // 2. URL Target IDX
  const idxUrl = `https://www.idx.co.id/primary/TradingSummary/GetStockSummary?length=10000&start=0&date=${date}`;

  try {
    // 3. Tembak ke IDX (Menyamar sebagai Browser Chrome)
    const res = await fetch(idxUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.idx.co.id/en-us/market-data/trading-summary/stock-summary/',
        'Host': 'www.idx.co.id',
        'Connection': 'keep-alive'
      },
      cache: 'no-store' // Wajib di Vercel agar data selalu fresh
    });

    if (!res.ok) {
      return NextResponse.json({ error: `IDX Error: ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}