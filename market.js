/* TUYUL Market module
   Chart ditampilkan melalui widget TradingView. Harga tidak dibuat sendiri.
   Ketersediaan real-time/delayed mengikuti instrumen dan lisensi data TradingView.
*/
const TUYUL_MARKETS = [
  { symbol: "EUR/USD", name: "Euro / US Dollar", tv: "FX:EURUSD", type: "forex", digits: 5 },
  { symbol: "GBP/USD", name: "British Pound / US Dollar", tv: "FX:GBPUSD", type: "forex", digits: 5 },
  { symbol: "USD/JPY", name: "US Dollar / Japanese Yen", tv: "FX:USDJPY", type: "forex", digits: 3 },
  { symbol: "AUD/USD", name: "Australian Dollar / US Dollar", tv: "FX:AUDUSD", type: "forex", digits: 5 },
  { symbol: "USD/CAD", name: "US Dollar / Canadian Dollar", tv: "FX:USDCAD", type: "forex", digits: 5 },
  { symbol: "USD/CHF", name: "US Dollar / Swiss Franc", tv: "FX:USDCHF", type: "forex", digits: 5 },
  { symbol: "NZD/USD", name: "New Zealand Dollar / US Dollar", tv: "FX:NZDUSD", type: "forex", digits: 5 },
  { symbol: "EUR/JPY", name: "Euro / Japanese Yen", tv: "FX:EURJPY", type: "forex", digits: 3 },
  { symbol: "GBP/JPY", name: "British Pound / Japanese Yen", tv: "FX:GBPJPY", type: "forex", digits: 3 },
  { symbol: "EUR/GBP", name: "Euro / British Pound", tv: "FX:EURGBP", type: "forex", digits: 5 },
  { symbol: "EUR/AUD", name: "Euro / Australian Dollar", tv: "FX:EURAUD", type: "forex", digits: 5 },
  { symbol: "EUR/CAD", name: "Euro / Canadian Dollar", tv: "FX:EURCAD", type: "forex", digits: 5 },
  { symbol: "EUR/CHF", name: "Euro / Swiss Franc", tv: "FX:EURCHF", type: "forex", digits: 5 },
  { symbol: "EUR/NZD", name: "Euro / New Zealand Dollar", tv: "FX:EURNZD", type: "forex", digits: 5 },
  { symbol: "GBP/AUD", name: "British Pound / Australian Dollar", tv: "FX:GBPAUD", type: "forex", digits: 5 },
  { symbol: "GBP/CAD", name: "British Pound / Canadian Dollar", tv: "FX:GBPCAD", type: "forex", digits: 5 },
  { symbol: "GBP/CHF", name: "British Pound / Swiss Franc", tv: "FX:GBPCHF", type: "forex", digits: 5 },
  { symbol: "GBP/NZD", name: "British Pound / New Zealand Dollar", tv: "FX:GBPNZD", type: "forex", digits: 5 },
  { symbol: "AUD/JPY", name: "Australian Dollar / Japanese Yen", tv: "FX:AUDJPY", type: "forex", digits: 3 },
  { symbol: "AUD/CAD", name: "Australian Dollar / Canadian Dollar", tv: "FX:AUDCAD", type: "forex", digits: 5 },
  { symbol: "AUD/NZD", name: "Australian Dollar / New Zealand Dollar", tv: "FX:AUDNZD", type: "forex", digits: 5 },
  { symbol: "CAD/JPY", name: "Canadian Dollar / Japanese Yen", tv: "FX:CADJPY", type: "forex", digits: 3 },
  { symbol: "CHF/JPY", name: "Swiss Franc / Japanese Yen", tv: "FX:CHFJPY", type: "forex", digits: 3 },
  { symbol: "NZD/JPY", name: "New Zealand Dollar / Japanese Yen", tv: "FX:NZDJPY", type: "forex", digits: 3 },
  { symbol: "NZD/CAD", name: "New Zealand Dollar / Canadian Dollar", tv: "FX:NZDCAD", type: "forex", digits: 5 },
  { symbol: "XAU/USD", name: "Gold / US Dollar", tv: "OANDA:XAUUSD", type: "metals", digits: 2 },
  { symbol: "XAG/USD", name: "Silver / US Dollar", tv: "OANDA:XAGUSD", type: "metals", digits: 3 },
  { symbol: "BTC/USD", name: "Bitcoin / US Dollar", tv: "BITSTAMP:BTCUSD", type: "crypto", digits: 2 },
  { symbol: "ETH/USD", name: "Ethereum / US Dollar", tv: "BITSTAMP:ETHUSD", type: "crypto", digits: 2 },
  { symbol: "DXY", name: "US Dollar Index", tv: "TVC:DXY", type: "index", digits: 2 }
];

let tuyulSelectedMarket = "FX:EURUSD";
let tuyulMarketCategory = "all";
let tuyulMarketQuery = "";
let tuyulChartInterval = "60";
let tuyulQuoteTimer = null;
let tuyulQuoteRequest = null;

function tuyulGetFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem("tuyul_market_favorites") || '["FX:EURUSD","FX:GBPUSD","FX:USDJPY","OANDA:XAUUSD"]');
    return Array.isArray(stored) ? stored : [];
  } catch (_) {
    return ["FX:EURUSD", "FX:GBPUSD", "FX:USDJPY", "OANDA:XAUUSD"];
  }
}

function tuyulSaveFavorites(items) {
  try { localStorage.setItem("tuyul_market_favorites", JSON.stringify(items)); } catch (_) {}
}

function tuyulSelectedInstrument() {
  return TUYUL_MARKETS.find(item => item.tv === tuyulSelectedMarket) || TUYUL_MARKETS[0];
}

function tuyulMarketRows() {
  const favorites = tuyulGetFavorites();
  return TUYUL_MARKETS.filter(item => {
    const matchesCategory = tuyulMarketCategory === "all" ||
      (tuyulMarketCategory === "favorites" ? favorites.includes(item.tv) : item.type === tuyulMarketCategory);
    const q = tuyulMarketQuery.trim().toLowerCase();
    const matchesQuery = !q || item.symbol.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });
}

function tuyulMarketListMarkup() {
  const rows = tuyulMarketRows();
  const favorites = tuyulGetFavorites();
  if (!rows.length) return '<div class="market-empty">Instrumen tidak ditemukan. Coba kata kunci lain.</div>';
  return rows.map(item => `
    <article class="market-row ${item.tv === tuyulSelectedMarket ? "selected" : ""}" data-market-select="${item.tv}" tabindex="0" role="button" aria-label="Pilih ${item.symbol}">
      <div class="market-instrument">
        <span class="market-symbol-icon ${item.type}">${item.type === "metals" ? (item.symbol.startsWith("XAU") ? "Au" : "Ag") : item.type === "crypto" ? "₿" : item.type === "index" ? "D" : item.symbol.slice(0,2)}</span>
        <span class="market-name-wrap"><strong>${item.symbol}</strong><small>${item.name}</small></span>
      </div>
      <span class="market-feed-label">Chart tersedia</span>
      <button class="favorite-button ${favorites.includes(item.tv) ? "is-favorite" : ""}" type="button" data-market-favorite="${item.tv}" aria-label="${favorites.includes(item.tv) ? "Hapus dari" : "Tambah ke"} favorit">${favorites.includes(item.tv) ? "★" : "☆"}</button>
    </article>
  `).join("");
}

function tuyulChartUrl(item) {
  const params = new URLSearchParams({
    symbol: item.tv,
    interval: tuyulChartInterval,
    theme: "dark",
    style: "1",
    timezone: "Asia/Jakarta",
    locale: "id",
    withdateranges: "1",
    hide_side_toolbar: "1",
    allow_symbol_change: "1",
    saveimage: "0",
    calendar: "0",
    details: "0",
    hotlist: "0",
    hideideas: "1"
  });
  return "https://www.tradingview.com/widgetembed/?" + params.toString();
}

function tuyulMarketPage() {
  const selected = tuyulSelectedInstrument();
  const intervalLabels = [
    ["1", "1m"], ["5", "5m"], ["15", "15m"], ["30", "30m"],
    ["60", "1H"], ["240", "4H"], ["D", "1D"], ["W", "1W"]
  ];
  return `
    <section class="welcome-row market-welcome">
      <div>
        <p class="eyebrow">GLOBAL MARKETS · LIVE CHART</p>
        <h2>Market Watchlist</h2>
        <p class="subheading">Pilih instrumen dan pantau grafiknya dalam satu tempat.</p>
      </div>
      <div class="market-data-note"><span class="session-dot"></span> Chart oleh TradingView</div>
    </section>

    <section class="market-summary-grid">
      <article class="panel market-summary-card"><span>INSTRUMEN TERSEDIA</span><strong>${TUYUL_MARKETS.length}</strong><small>Forex, metals, crypto & index</small></article>
      <article class="panel market-summary-card"><span>FAVORIT KAMU</span><strong>${tuyulGetFavorites().length}</strong><small>Tersimpan di perangkat ini</small></article>
      <article class="panel market-summary-card"><span>TIMEZONE</span><strong>WIB</strong><small>Asia/Jakarta</small></article>
    </section>

    <section class="market-workspace">
      <div class="panel market-list-panel">
        <div class="market-panel-heading"><div><p class="eyebrow">INSTRUMENTS</p><h3>Daftar Market</h3></div><span class="market-count">${tuyulMarketRows().length} aset</span></div>
        <label class="market-search"><span>⌕</span><input id="marketSearch" type="search" placeholder="Cari pair, contoh EUR/USD..." value="${tuyulMarketQuery.replace(/"/g, "&quot;")}" autocomplete="off"><kbd>/</kbd></label>
        <div class="market-filters" role="group" aria-label="Filter market">
          <button class="${tuyulMarketCategory === "all" ? "active" : ""}" data-market-category="all">Semua</button>
          <button class="${tuyulMarketCategory === "favorites" ? "active" : ""}" data-market-category="favorites">★ Favorit</button>
          <button class="${tuyulMarketCategory === "forex" ? "active" : ""}" data-market-category="forex">Forex</button>
          <button class="${tuyulMarketCategory === "metals" ? "active" : ""}" data-market-category="metals">Logam</button>
          <button class="${tuyulMarketCategory === "crypto" ? "active" : ""}" data-market-category="crypto">Crypto</button>
          <button class="${tuyulMarketCategory === "index" ? "active" : ""}" data-market-category="index">Index</button>
        </div>
        <div id="marketList" class="market-list">${tuyulMarketListMarkup()}</div>
        <p class="market-list-footnote">Watchlist menampilkan chart TradingView. Harga numerik dari Twelve Data dimuat hanya untuk instrumen terpilih agar kuota Basic 800 credits/hari lebih hemat.</p>
      </div>

      <div class="market-chart-column">
        <section class="panel selected-market-panel">
          <div class="selected-market-heading">
            <div><p class="eyebrow">INSTRUMEN TERPILIH</p><h3 id="selectedMarketName">${selected.symbol}</h3><p id="selectedMarketDesc">${selected.name}</p></div>
            <span class="feed-badge"><i></i> TradingView</span>
          </div>
          <div class="quote-strip" id="tuyulQuoteStrip">
            <div class="quote-main"><span>HARGA TERKINI</span><strong id="tuyulQuotePrice">—</strong><small id="tuyulQuoteChange">Menunggu koneksi data</small></div>
            <div class="quote-meta"><span class="quote-status" id="tuyulQuoteStatus">API BELUM TERHUBUNG</span><small id="tuyulQuoteUpdated">Harga numerik akan muncul setelah backend dikonfigurasi.</small></div>
            <button type="button" class="quote-refresh" id="tuyulQuoteRefresh">↻</button>
          </div>
          <div class="chart-timeframes">
            ${intervalLabels.map(([value, label]) => `<button type="button" data-chart-interval="${value}" class="${tuyulChartInterval === value ? "active" : ""}">${label}</button>`).join("")}
          </div>
          <div class="tradingview-frame-wrap">
            <iframe id="marketTradingView" title="Grafik ${selected.symbol}" src="${tuyulChartUrl(selected)}" loading="lazy" allowfullscreen></iframe>
          </div>
          <p class="chart-disclaimer">Grafik dan feed disediakan TradingView. Ketersediaan harga real-time atau tertunda bergantung pada instrumen, bursa, dan lisensi data. Ini bukan rekomendasi transaksi.</p>
        </section>
      </div>
    </section>
  `;
}

function tuyulUpdateMarketList() {
  const list = document.getElementById("marketList");
  if (list) list.innerHTML = tuyulMarketListMarkup();
  const count = document.querySelector(".market-count");
  if (count) count.textContent = `${tuyulMarketRows().length} aset`;
}

function tuyulSelectMarket(symbol) {
  const item = TUYUL_MARKETS.find(entry => entry.tv === symbol);
  if (!item) return;
  tuyulSelectedMarket = symbol;
  const name = document.getElementById("selectedMarketName");
  const desc = document.getElementById("selectedMarketDesc");
  const frame = document.getElementById("marketTradingView");
  if (name) name.textContent = item.symbol;
  if (desc) desc.textContent = item.name;
  if (frame) {
    frame.title = `Grafik ${item.symbol}`;
    frame.src = tuyulChartUrl(item);
  }
  tuyulUpdateMarketList();
  tuyulLoadQuote();
}

function tuyulToggleFavorite(symbol) {
  const favorites = tuyulGetFavorites();
  const next = favorites.includes(symbol) ? favorites.filter(value => value !== symbol) : [...favorites, symbol];
  tuyulSaveFavorites(next);
  tuyulUpdateMarketList();
  const favoriteCount = document.querySelector(".market-summary-card:nth-child(2) strong");
  if (favoriteCount) favoriteCount.textContent = next.length;
}


function tuyulFormatQuotePrice(value, digits=5) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: Math.min(digits, 5), maximumFractionDigits: Math.min(digits, 5) }).format(number);
}

async function tuyulLoadQuote() {
  const base = String(window.TUYUL_API_BASE || "").trim().replace(/\/$/, "");
  const priceEl = document.getElementById("tuyulQuotePrice");
  const changeEl = document.getElementById("tuyulQuoteChange");
  const statusEl = document.getElementById("tuyulQuoteStatus");
  const updatedEl = document.getElementById("tuyulQuoteUpdated");
  if (!priceEl || !statusEl || !updatedEl) return;
  if (!base) {
    statusEl.textContent = "API BELUM TERHUBUNG";
    updatedEl.textContent = "Atur TUYUL_API_BASE di config.js setelah backend aktif.";
    return;
  }
  if (tuyulQuoteRequest) tuyulQuoteRequest.abort();
  tuyulQuoteRequest = new AbortController();
  statusEl.textContent = "MENGAMBIL DATA…";
  try {
    const item = tuyulSelectedInstrument();
    const response = await fetch(`${base}/api/quote?symbol=${encodeURIComponent(item.symbol)}`, { signal: tuyulQuoteRequest.signal, cache: "no-store" });
    const data = await response.json();
    if (!response.ok || data.price === undefined || data.price === null || !Number.isFinite(Number(data.price))) throw new Error(data.error || "Data harga tidak tersedia");
    priceEl.textContent = tuyulFormatQuotePrice(data.price, item.digits);
    const change = Number(data.change);
    const pct = Number(data.percentChange);
    if (changeEl) {
      const validChange = Number.isFinite(change);
      changeEl.textContent = validChange ? `${change > 0 ? "+" : ""}${tuyulFormatQuotePrice(change, item.digits)} (${Number.isFinite(pct) ? `${pct > 0 ? "+" : ""}${pct.toFixed(2)}%` : "—"})` : "Perubahan harian tidak tersedia";
      changeEl.classList.toggle("positive", validChange && change > 0);
      changeEl.classList.toggle("negative", validChange && change < 0);
    }
    const cacheState = response.headers.get("X-TUYUL-Cache") || data.cache || "MISS";
    statusEl.textContent = cacheState === "HIT" ? "DATA TERSIMPAN · CACHE" : "DATA PROVIDER";
    updatedEl.textContent = `Sumber: ${data.source || "Twelve Data"} · ${data.datetime || data.fetchedAt || "Waktu provider tidak tersedia"}`;
  } catch (error) {
    if (error.name === "AbortError") return;
    statusEl.textContent = "DATA GAGAL DIMUAT";
    updatedEl.textContent = error.message || "Periksa koneksi backend.";
  }
}

function tuyulStartQuotePolling() {
  if (tuyulQuoteTimer) clearInterval(tuyulQuoteTimer);
  tuyulLoadQuote();
  tuyulQuoteTimer = setInterval(() => {
    if (document.getElementById("tuyulQuotePrice")) {
      if (!document.hidden) tuyulLoadQuote();
    } else {
      clearInterval(tuyulQuoteTimer);
      tuyulQuoteTimer = null;
    }
  }, 60000);
}
