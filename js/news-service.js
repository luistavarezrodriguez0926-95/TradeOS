/**
 * News Intelligence Service for TradeOS
 * Fetches market news from Google News RSS via rss2json proxy.
 * Implements a 15-minute persistent cache.
 */

const RSS_PROXY_BASE = "https://api.rss2json.com/v1/api.json?rss_url=";
const CACHE_KEY = "tradeos_news_cache";
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export const NewsService = {
    /**
     * Fetch the latest market news headlines.
     * @param {string} lang - 'en' or 'es'
     * @returns {Promise<Array>} - Array of news items
     */
    getLatestNews: async (lang = 'en') => {
        const now = Date.now();
        const cached = localStorage.getItem(`${CACHE_KEY}_${lang}`);
        
        if (cached) {
            const { timestamp, data } = JSON.parse(cached);
            if (now - timestamp < CACHE_DURATION) {
                console.log("News Intelligence: Loaded from orbital cache.");
                return data;
            }
        }

        try {
            console.log(`News Intelligence: Fetching new market flux (${lang.toUpperCase()})...`);
            
            // Build Google News RSS URL
            const query = lang === 'es' ? 'trading+forex+cripto' : 'trading+forex+crypto';
            const hl = lang === 'es' ? 'es-419' : 'en-US';
            const gl = lang === 'es' ? 'MX' : 'US';
            const ceid = lang === 'es' ? 'MX:es-419' : 'US:en';
            
            const googleNewsUrl = `https://news.google.com/rss/search?q=${query}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
            const fetchUrl = `${RSS_PROXY_BASE}${encodeURIComponent(googleNewsUrl)}`;

            const response = await fetch(fetchUrl);
            const json = await response.json();

            if (json.status === 'ok' && json.items) {
                const news = json.items.slice(0, 8).map(item => ({
                    title: item.title,
                    link: item.link,
                    pubDate: item.pubDate,
                    source: item.author || "Global Intelligence"
                }));

                localStorage.setItem(`${CACHE_KEY}_${lang}`, JSON.stringify({
                    timestamp: now,
                    data: news
                }));

                return news;
            }
            return [];
        } catch (error) {
            console.error("News Intelligence Error:", error);
            return [];
        }
    }
};
