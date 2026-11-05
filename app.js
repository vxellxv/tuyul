const app = document.getElementById('app');
const navigation = document.querySelector('.navigation');

const pageInfo = {
  news: { title: 'News & Economic Calendar', eyebrow: 'GLOBAL ECONOMY', description: 'Ikuti agenda ekonomi dan berita yang berpotensi menggerakkan pasar.', note: 'Kalender ekonomi, data aktual, perkiraan, dan penjelasan Bahasa Indonesia akan ditambahkan pada tahap integrasi data.' },
  ai: { title: 'AI Analyst', eyebrow: 'INTELLIGENCE ENGINE', description: 'Analisis teknikal dan fundamental dalam satu ruang kerja.', note: 'AI Analyst akan diaktifkan setelah backend dan penyedia AI terhubung. TUYUL tidak akan membuat sinyal atau harga fiktif.' },
  academy: { title: 'Trading Academy', eyebrow: 'LEARN & IMPROVE', description: 'Bangun pemahaman tentang market, analisis, dan manajemen risiko.', note: 'Materi belajar, glosarium, dan panduan membaca berita ekonomi akan disiapkan di sini.' }
};

let currentPage = 'home';

function render(page = 'home') {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(button => {
    button.classList.toggle('active', button.dataset.page === page);
  });

  if (page === 'home') {
    app.innerHTML = berandaPage();
    return;
  }

  if (page === 'market') {
    app.innerHTML = tuyulMarketPage();
    tuyulStartQuotePolling();
    return;
  }

  if (page === 'news') {
    app.innerHTML = tuyulNewsPage();
    return;
  }

  const info = pageInfo[page] || pageInfo.ai;
  app.innerHTML = `
    <section class="welcome-row page-welcome">
      <div><p class="eyebrow">${info.eyebrow}</p><h2>${info.title}</h2><p class="subheading">${info.description}</p></div>
    </section>
    <section class="panel placeholder-panel">
      <div class="placeholder-symbol">✧</div>
      <h3>Ruang ini sedang disiapkan</h3>
      <p>${info.note}</p>
      <button class="primary-button" type="button" data-open-page="home">Kembali ke Beranda</button>
    </section>
  `;
}

navigation.addEventListener('click', event => {
  const button = event.target.closest('[data-page]');
  if (button) render(button.dataset.page);
});

document.addEventListener('click', event => {
  if (event.target.closest('#tuyulQuoteRefresh')) { tuyulLoadQuote(); return; }

  const favoriteButton = event.target.closest('[data-market-favorite]');
  if (favoriteButton) {
    event.stopPropagation();
    tuyulToggleFavorite(favoriteButton.dataset.marketFavorite);
    return;
  }

  const marketRow = event.target.closest('[data-market-select]');
  if (marketRow) {
    tuyulSelectMarket(marketRow.dataset.marketSelect);
    return;
  }

  const newsTab = event.target.closest('[data-news-tab]');
  if (newsTab) {
    tuyulNewsActiveTab = newsTab.dataset.newsTab;
    app.innerHTML = tuyulNewsPage();
    return;
  }

  const newsFilter = event.target.closest('[data-news-filter]');
  if (newsFilter) {
    tuyulNewsImpactFilter = newsFilter.dataset.newsFilter;
    app.innerHTML = tuyulNewsPage();
    return;
  }

  const categoryButton = event.target.closest('[data-market-category]');
  if (categoryButton) {
    tuyulMarketCategory = categoryButton.dataset.marketCategory;
    document.querySelectorAll('[data-market-category]').forEach(button => {
      button.classList.toggle('active', button.dataset.marketCategory === tuyulMarketCategory);
    });
    tuyulUpdateMarketList();
    return;
  }

  const intervalButton = event.target.closest('[data-chart-interval]');
  if (intervalButton) {
    tuyulChartInterval = intervalButton.dataset.chartInterval;
    document.querySelectorAll('[data-chart-interval]').forEach(button => {
      button.classList.toggle('active', button.dataset.chartInterval === tuyulChartInterval);
    });
    const selected = tuyulSelectedInstrument();
    const frame = document.getElementById('marketTradingView');
    if (frame) frame.src = tuyulChartUrl(selected);
    return;
  }

  const dashboardSymbol = event.target.closest('[data-dashboard-market]');
  if (dashboardSymbol) {
    tuyulSelectedMarket = dashboardSymbol.dataset.dashboardMarket;
    tuyulMarketCategory = 'all';
    tuyulMarketQuery = '';
    render('market');
    return;
  }

  const button = event.target.closest('[data-open-page]');
  if (button) render(button.dataset.openPage);
});

document.addEventListener('input', event => {
  if (event.target.id === 'marketSearch') {
    tuyulMarketQuery = event.target.value;
    tuyulUpdateMarketList();
    const input = document.getElementById('marketSearch');
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }
});

document.addEventListener('keydown', event => {
  if (event.key === '/' && currentPage === 'market' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    event.preventDefault();
    document.getElementById('marketSearch')?.focus();
  }
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-market-select]')) {
    event.preventDefault();
    tuyulSelectMarket(event.target.dataset.marketSelect);
  }
});

render('home');
