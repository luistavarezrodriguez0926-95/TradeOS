/**
 * News Intelligence Service for TradeOS
 * Fetches market news from Google News RSS via allorigins proxy.
 * Implements a 15-minute persistent cache.
 */

const PROXY_URL = "https://api.allorigins.win/get?url=";
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
                return data;
            }
        }

        try {
            // Build Google News RSS URL
            const query = lang === 'es' ? 'Mercado+Forex+Cripto' : 'Trading+Market+Forex';
            const hl = lang === 'es' ? 'es-419' : 'en-US';
            const gl = lang === 'es' ? 'MX' : 'US';
            const ceid = lang === 'es' ? 'MX:es-419' : 'US:en';
            
            const googleNewsUrl = `https://news.google.com/rss/search?q=${query}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
            const fetchUrl = `${PROXY_URL}${encodeURIComponent(googleNewsUrl)}`;

            const response = await fetch(fetchUrl);
            const json = await response.json();
            
            if (!json || !json.contents) {
                console.warn("News Intelligence: Orbital link weak (No contents).");
                return [];
            }

            // Parse XML String from allorigins
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(json.contents, "text/xml");
            const items = xmlDoc.querySelectorAll("item");
            
            const news = Array.from(items).slice(0, 8).map(item => ({
                title: item.querySelector("title")?.textContent || "Untitled Flux",
                link: item.querySelector("link")?.textContent || "#",
                pubDate: item.querySelector("pubDate")?.textContent || "",
                source: item.querySelector("source")?.textContent || "Global Intelligence"
            }));

            if (news.length > 0) {
                localStorage.setItem(`${CACHE_KEY}_${lang}`, JSON.stringify({
                    timestamp: now,
                    data: news
                }));
            }

            return news;
        } catch (error) {
            console.error("News Intelligence Connection Failure:", error);
            return [];
        }
    }
};
