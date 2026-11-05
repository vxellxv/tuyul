function berandaPage() {
  const today = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
  const watchlist = [
    { symbol: 'EUR/USD', name: 'Euro / US Dollar', tv: 'FX:EURUSD', mark: 'EU' },
    { symbol: 'GBP/USD', name: 'British Pound / US Dollar', tv: 'FX:GBPUSD', mark: 'GB' },
    { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', tv: 'FX:USDJPY', mark: 'JP' },
    { symbol: 'XAU/USD', name: 'Gold / US Dollar', tv: 'OANDA:XAUUSD', mark: 'Au' }
  ];

  return `
    <section class="welcome-row">
      <div>
        <p class="eyebrow">${today.toUpperCase()}</p>
        <h2>Market Overview</h2>
        <p class="subheading">Pantau pasar. Pahami pergerakan. Ambil keputusan lebih terukur.</p>
      </div>
      <div class="market-session"><span class="session-dot"></span> Siap memantau market</div>
    </section>

    <section class="overview-grid" aria-label="Ringkasan sistem">
      <article class="panel stat-panel">
        <div class="panel-heading"><span>MARKET WATCHLIST</span><span class="tiny-icon">⌁</span></div>
        <div class="stat-value gold-text">15 instrumen</div>
        <p class="stat-note">Forex, logam, crypto & index</p>
      </article>
      <article class="panel stat-panel">
        <div class="panel-heading"><span>AI ANALYST</span><span class="tiny-icon">✧</span></div>
        <div class="stat-value">Standby</div>
        <p class="stat-note">Menunggu koneksi AI backend</p>
      </article>
      <article class="panel stat-panel">
        <div class="panel-heading"><span>ECONOMIC NEWS</span><span class="tiny-icon">◷</span></div>
        <div class="stat-value">WIB</div>
        <p class="stat-note">Kalender ekonomi disiapkan</p>
      </article>
    </section>

    <section class="section-block">
      <div class="section-heading">
        <div><p class="eyebrow">INTELLIGENCE CENTER</p><h3>AI Market Intelligence</h3></div>
        <span class="status-pill"><i></i> Tahap pengembangan</span>
      </div>
      <article class="panel intelligence-panel">
        <div class="ai-orb"><span>✧</span></div>
        <div class="intelligence-copy">
          <h4>TUYUL sedang membangun radar market</h4>
          <p>Fondasi watchlist dan chart sudah disiapkan. Berikutnya kita sambungkan kalender ekonomi, data harga, lalu mesin analisis teknikal dan fundamental.</p>
          <div class="feature-chips"><span>Technical</span><span>Fundamental</span><span>News sentiment</span><span>Risk management</span></div>
        </div>
      </article>
    </section>

    <section class="section-block">
      <div class="section-heading">
        <div><p class="eyebrow">YOUR MARKETS</p><h3>Market Watchlist</h3></div>
        <button class="text-action" type="button" data-open-page="market">Buka market <span>→</span></button>
      </div>
      <div class="watchlist panel">
        <div class="watchlist-head"><span>INSTRUMENT</span><span>DATA</span><span>CHART</span></div>
        ${watchlist.map(item => `
          <button class="watch-row dashboard-watch-row" type="button" data-dashboard-market="${item.tv}">
            <div class="instrument"><span class="instrument-mark">${item.mark}</span><div><strong>${item.symbol}</strong><small>${item.name}</small></div></div>
            <span class="waiting-value">Feed chart</span>
            <span class="watch-open">Buka ↗</span>
          </button>
        `).join('')}
        <p class="data-disclaimer">Klik instrumen untuk membuka grafik TradingView. Harga numerik belum diambil langsung oleh TUYUL.</p>
      </div>
    </section>

    <section class="bottom-grid">
      <button class="panel shortcut-panel shortcut-button" type="button" data-open-page="news">
        <span class="shortcut-icon">▤</span><span class="shortcut-copy"><strong>Economic Calendar</strong><small>FOMC, CPI, NFP, dan agenda bank sentral.</small></span><span class="coming-soon">SEGERA</span>
      </button>
      <button class="panel shortcut-panel shortcut-button" type="button" data-open-page="ai">
        <span class="shortcut-icon">✧</span><span class="shortcut-copy"><strong>AI Analyst</strong><small>Analisis multi-timeframe dan skenario market.</small></span><span class="coming-soon">SEGERA</span>
      </button>
    </section>
  `;
}
