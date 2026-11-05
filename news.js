/* TUYUL News & Sentiment module
   UI foundation only. No event dates, forecasts, sentiment scores, or positioning
   values are fabricated. Connect trusted providers before showing live readings.
*/
let tuyulNewsActiveTab = "calendar";
let tuyulNewsImpactFilter = "all";

const TUYUL_EVENT_GROUPS = [
  { code: "FED", title: "Federal Reserve", events: "FOMC rate decision, statement, minutes, Powell speeches & press conferences", currencies: "USD", impact: "high" },
  { code: "INFLATION", title: "Inflation data", events: "CPI, Core CPI, PCE, Core PCE, PPI", currencies: "USD · EUR · GBP · JPY · lainnya", impact: "high" },
  { code: "JOBS", title: "Employment", events: "NFP, unemployment rate, average earnings, ADP, jobless claims", currencies: "USD · GBP · AUD · CAD", impact: "high" },
  { code: "CB", title: "Central banks", events: "ECB, BOJ, BOE, RBA, BOC, SNB, RBNZ policy decisions", currencies: "EUR · JPY · GBP · AUD · CAD · CHF · NZD", impact: "high" },
  { code: "GROWTH", title: "Growth & activity", events: "GDP, Retail Sales, PMI, ISM, Consumer Confidence, Trade Balance", currencies: "Multi-currency", impact: "medium" }
];

function tuyulNewsPage() {
  const isCalendar = tuyulNewsActiveTab === "calendar";
  return `
    <section class="welcome-row news-welcome">
      <div>
        <p class="eyebrow">EVENT RADAR · MARKET MOOD</p>
        <h2>News & Sentiment</h2>
        <p class="subheading">Pahami agenda ekonomi dan suasana pasar sebelum mengambil keputusan.</p>
      </div>
      <div class="market-data-note"><span class="session-dot"></span> Zona waktu: WIB</div>
    </section>

    <div class="news-tabs" role="tablist" aria-label="News dan sentimen">
      <button type="button" role="tab" aria-selected="${isCalendar}" class="${isCalendar ? "active" : ""}" data-news-tab="calendar">Economic Calendar</button>
      <button type="button" role="tab" aria-selected="${!isCalendar}" class="${!isCalendar ? "active" : ""}" data-news-tab="sentiment">Market Sentiment</button>
    </div>

    ${isCalendar ? tuyulCalendarMarkup() : tuyulSentimentMarkup()}
  `;
}

function tuyulCalendarMarkup() {
  const groups = TUYUL_EVENT_GROUPS.filter(group =>
    tuyulNewsImpactFilter === "all" || group.impact === tuyulNewsImpactFilter
  );
  return `
    <section class="calendar-intro-grid">
      <article class="panel calendar-intro-card">
        <span class="calendar-icon">◷</span><div><strong>Waktu lokal</strong><small>Asia/Jakarta · WIB (UTC+7)</small></div>
      </article>
      <article class="panel calendar-intro-card">
        <span class="calendar-icon">⚑</span><div><strong>Prioritas utama</strong><small>FOMC · CPI · NFP · PCE</small></div>
      </article>
      <article class="panel calendar-intro-card">
        <span class="calendar-icon">◎</span><div><strong>Data aktual</strong><small>Menunggu provider kalender</small></div>
      </article>
    </section>

    <section class="panel calendar-panel">
      <div class="calendar-panel-head">
        <div><p class="eyebrow">ECONOMIC EVENTS</p><h3>Agenda yang dipantau</h3></div>
        <span class="provider-pending"><i></i> Provider belum terhubung</span>
      </div>
      <div class="calendar-filter-row">
        <button type="button" data-news-filter="all" class="${tuyulNewsImpactFilter === "all" ? "active" : ""}">Semua dampak</button>
        <button type="button" data-news-filter="high" class="${tuyulNewsImpactFilter === "high" ? "active" : ""}">High impact</button>
        <button type="button" data-news-filter="medium" class="${tuyulNewsImpactFilter === "medium" ? "active" : ""}">Medium impact</button>
      </div>
      <div class="calendar-empty-state">
        <div class="empty-calendar-icon">▦</div>
        <strong>Jadwal aktual belum tersedia</strong>
        <p>TUYUL belum terhubung ke penyedia kalender ekonomi. Kami sengaja tidak menampilkan tanggal, jam, forecast, atau angka aktual palsu.</p>
      </div>
      <div class="event-watchlist">
        <div class="event-watchlist-heading"><strong>Event penting yang akan dipantau</strong><span>${groups.length} kategori</span></div>
        ${groups.map(group => `
          <article class="event-category-row">
            <div class="event-impact ${group.impact}"></div>
            <div class="event-category-copy">
              <strong>${group.title}</strong>
              <p>${group.events}</p>
              <small>${group.currencies}</small>
            </div>
            <span class="impact-label ${group.impact}">${group.impact === "high" ? "HIGH" : "MEDIUM"}</span>
          </article>
        `).join("")}
      </div>
    </section>
    <p class="news-footnote">Tahap integrasi berikutnya: sumber kalender terpercaya, konversi otomatis ke WIB termasuk perubahan daylight saving time, actual/forecast/previous, serta notifikasi sebelum rilis.</p>
  `;
}

function tuyulSentimentMarkup() {
  const signals = [
    ["USD", "US Dollar", "DXY, yield obligasi, data ekonomi & berita"],
    ["EUR", "Euro", "Data kawasan euro, ECB & kekuatan relatif"],
    ["GBP", "British Pound", "Data Inggris, BOE & risiko domestik"],
    ["JPY", "Japanese Yen", "BOJ, yield Jepang & intervensi"],
    ["GOLD", "Gold", "Real yield, USD, safe-haven demand & arus ETF"]
  ];
  return `
    <section class="sentiment-hero panel">
      <div class="sentiment-orbit"><span>◎</span></div>
      <div class="sentiment-hero-copy">
        <p class="eyebrow">MARKET MOOD ENGINE</p>
        <h3>Market sentiment sedang menunggu data</h3>
        <p>Belum ada skor bullish/bearish yang ditampilkan. TUYUL akan menggabungkan beberapa sumber supaya sentimen tidak disimpulkan dari satu indikator saja.</p>
        <span class="provider-pending"><i></i> Sentiment engine belum terhubung</span>
      </div>
    </section>

    <section class="sentiment-metrics-grid">
      <article class="panel sentiment-metric"><span>RISK APPETITE</span><strong>—</strong><small>Risk-on / Risk-off</small></article>
      <article class="panel sentiment-metric"><span>CURRENCY STRENGTH</span><strong>—</strong><small>Kekuatan relatif mata uang</small></article>
      <article class="panel sentiment-metric"><span>NEWS SENTIMENT</span><strong>—</strong><small>Analisis berita multi-sumber</small></article>
      <article class="panel sentiment-metric"><span>POSITIONING</span><strong>—</strong><small>COT & positioning provider</small></article>
    </section>

    <section class="panel sentiment-currency-panel">
      <div class="calendar-panel-head"><div><p class="eyebrow">SENTIMENT RADAR</p><h3>Instrumen & faktor penggerak</h3></div></div>
      ${signals.map(item => `
        <article class="sentiment-currency-row">
          <div class="sentiment-currency-code">${item[0]}</div>
          <div class="sentiment-currency-copy"><strong>${item[1]}</strong><small>${item[2]}</small></div>
          <span class="sentiment-pending-value">Belum ada data</span>
        </article>
      `).join("")}
    </section>

    <section class="panel sentiment-method-panel">
      <p class="eyebrow">HOW TUYUL WILL READ SENTIMENT</p>
      <h3>Sentimen tidak sama dengan sinyal entry</h3>
      <div class="sentiment-method-grid">
        <div><b>01</b><strong>News & macro</strong><p>Apakah berita dan data ekonomi mendukung atau menekan mata uang?</p></div>
        <div><b>02</b><strong>Positioning</strong><p>Bagaimana posisi pelaku pasar, termasuk data COT dan positioning yang tersedia?</p></div>
        <div><b>03</b><strong>Price confirmation</strong><p>Apakah pergerakan harga mengonfirmasi sentimen, atau justru menunjukkan divergensi?</p></div>
      </div>
    </section>
    <p class="news-footnote">Rencana sumber: CFTC COT untuk positioning mingguan, data harga untuk kekuatan relatif, serta penyedia berita/sentiment dengan lisensi yang sesuai. Setiap pembacaan nantinya diberi sumber, timestamp, cakupan, dan tingkat keyakinan.</p>
  `;
}
