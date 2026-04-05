/**
 * Firebase-First Storage Module for TradeOS
 * Handles persistent storage across sessions via Firestore.
 * Scopes all data under the user's unique ID.
 */

import { db, auth, doc, setDoc, getDoc, getDocs, collection, query, where, deleteDoc, onSnapshot } from './firebase-config.js';

/**
 * Helper to get the current user's UID.
 */
const getUid = () => {
    const user = auth.currentUser;
    return user ? user.uid : null;
};

export const Storage = {
    /**
     * Subscribe to real-time trade updates.
     */
    subscribeToTrades: (callback) => {
        const uid = getUid();
        if (!uid) { callback([]); return; }
        const q = collection(db, "users", uid, "trades");
        
        // Initial load from cache
        const cache = localStorage.getItem(`trades_${uid}`);
        if (cache) callback(JSON.parse(cache));

        return onSnapshot(q, (snapshot) => {
            const trades = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            localStorage.setItem(`trades_${uid}`, JSON.stringify(trades));
            callback(trades);
        });
    },

    /**
     * Subscribe to real-time account updates.
     */
    subscribeToAccount: (callback) => {
        const uid = getUid();
        if (!uid) return;
        const accountRef = doc(db, "users", uid, "settings", "account");

        // Initial load from cache
        const cache = localStorage.getItem(`account_${uid}`);
        if (cache) callback(JSON.parse(cache));

        return onSnapshot(accountRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                localStorage.setItem(`account_${uid}`, JSON.stringify(data));
                callback(data);
            } else {
                callback({
                    balance: 100000,
                    dailyLimit: 5,
                    maxDrawdown: 10,
                    target: 10,
                    phase: 'Evaluation',
                    manualStatus: null
                });
            }
        });
    },

    /**
     * Get all trades from Firestore (one-time fetch).
     */
    getTrades: async () => {
        try {
            const uid = getUid();
            if (!uid) return [];
            const q = collection(db, "users", uid, "trades");
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error("Error fetching trades:", e);
            return [];
        }
    },

    /**
     * Save/Update a trade in Firestore with Safety Lock check.
     */
    saveTrade: async (trade) => {
        const uid = getUid();
        if (!uid) throw new Error("Authentication required to save trades.");
        
        // Safety Lock check
        const metrics = await Storage.getPropFirmMetrics();
        if (metrics.dailyPL <= metrics.dailyLimitUSD) {
            throw new Error("SAFETY LOCK: Daily loss limit reached. Trading has been suspended for the day.");
        }

        if (!trade.id) {
            trade.id = Date.now().toString();
            trade.date = new Date().toISOString();
        }
        
        const tradeRef = doc(db, "users", uid, "trades", trade.id);
        await setDoc(tradeRef, trade, { merge: true });
        return trade;
    },

    /**
     * Delete a trade by ID from Firestore.
     */
    deleteTrade: async (id) => {
        const uid = getUid();
        const tradeRef = doc(db, "users", uid, "trades", id);
        await deleteDoc(tradeRef);
    },

    /**
     * Calculate global performance metrics.
     */
    getStats: async () => {
        const trades = await Storage.getTrades();
        const total = trades.length;
        if (total === 0) return { totalProfit: 0, winRate: 0, avgR: 0 };

        const totalProfit = trades.reduce((sum, trade) => sum + (parseFloat(trade.result) || 0), 0);
        const wins = trades.filter(t => parseFloat(t.result) > 0).length;
        const winRate = ((wins / total) * 100).toFixed(1);
        
        const validR = trades.filter(t => t.rRatio).map(t => parseFloat(t.rRatio));
        const avgR = validR.length > 0 
            ? (validR.reduce((a, b) => a + b, 0) / validR.length).toFixed(2)
            : 0;

        return { totalProfit, winRate, avgR };
    },

    /**
     * Calculate R Ratio for a trade.
     */
    calculateR: (type, entry, sl, tp) => {
        if (!entry || !sl || !tp) return 0;
        const e = parseFloat(entry);
        const s = parseFloat(sl);
        const t = parseFloat(tp);
        
        if (type === 'BUY') {
            return ((t - e) / (e - s)).toFixed(2);
        } else {
            return ((e - t) / (s - e)).toFixed(2);
        }
    },

    /**
     * Get habit data for a specific date from Firestore.
     */
    getHabit: async (date) => {
        try {
            const uid = getUid();
            if (!uid) return { exercise: false, water: 0, sleep: 7, meditation: false, reading: false, stress: 5, focus: 5, notes: '' };
            const habitRef = doc(db, "users", uid, "habits", date);
            const docSnap = await getDoc(habitRef);
            return docSnap.exists() ? docSnap.data() : { exercise: false, water: 0, sleep: 7, meditation: false, reading: false, stress: 5, focus: 5, notes: '' };
        } catch (e) {
            console.warn("Storage.getHabit: Access restricted.", e);
            return { exercise: false, water: 0, sleep: 7, meditation: false, reading: false, stress: 5, focus: 5, notes: '' };
        }
    },

    /**
     * Save habit data for a specific date to Firestore.
     */
    saveHabit: async (date, data) => {
        const uid = getUid();
        if (!uid) return;
        const habitRef = doc(db, "users", uid, "habits", date);
        await setDoc(habitRef, data, { merge: true });
    },

    calculateCalibration: (habit) => {
        let score = 0;
        if (habit.exercise) score += 20;
        if (habit.meditation) score += 20;
        if (habit.reading) score += 15;
        if (habit.water >= 3) score += 15;
        else score += (habit.water / 3) * 15;
        
        const focusContribution = (habit.focus / 10) * 20;
        const stressContribution = (1 - (habit.stress / 10)) * 10;
        score += focusContribution + stressContribution;

        return Math.min(100, Math.round(score));
    },

    /**
     * Analytical Engine: Correlates trading performance with habits.
     */
    getInsights: async () => {
        const trades = await Storage.getTrades();
        const uid = getUid();
        const habitsColl = collection(db, "users", uid, "habits");
        const habitsSnapshot = await getDocs(habitsColl);
        const habits = {};
        habitsSnapshot.forEach(doc => {
            habits[doc.id] = doc.data();
        });
        
        if (trades.length === 0) return null;

        const tradesByDate = {};
        trades.forEach(t => {
            const date = t.date ? t.date.split('T')[0] : new Date().toISOString().split('T')[0];
            if (!tradesByDate[date]) tradesByDate[date] = [];
            tradesByDate[date].push(t);
        });

        const weekdayPerf = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        Object.keys(tradesByDate).forEach(date => {
            const day = new Date(date).getDay() + 1;
            if (day >= 1 && day <= 5) {
                const dailyNet = tradesByDate[date].reduce((sum, t) => sum + (parseFloat(t.result) || 0), 0);
                weekdayPerf[day] += dailyNet;
            }
        });

        let poorSleepWins = 0, poorSleepTotal = 0;
        let goodSleepWins = 0, goodSleepTotal = 0;
        let highFocusRR = 0, highFocusCount = 0;
        let lowFocusRR = 0, lowFocusCount = 0;

        Object.keys(tradesByDate).forEach(date => {
            const habit = habits[date];
            const dailyTrades = tradesByDate[date];
            
            if (habit) {
                dailyTrades.forEach(t => {
                    const res = parseFloat(t.result) || 0;
                    const rr = parseFloat(t.rRatio) || 0;
                    
                    if (habit.sleep < 7) {
                        poorSleepTotal++;
                        if (res > 0) poorSleepWins++;
                    } else {
                        goodSleepTotal++;
                        if (res > 0) goodSleepWins++;
                    }

                    if (habit.focus >= 7) {
                        highFocusRR += rr;
                        highFocusCount++;
                    } else {
                        lowFocusRR += rr;
                        lowFocusCount++;
                    }
                });
            }
        });

        let poorWinRate = poorSleepTotal > 0 ? (poorSleepWins / poorSleepTotal) : 0;
        let goodWinRate = goodSleepTotal > 0 ? (goodSleepWins / goodSleepTotal) : 0;

        let leak = "Not enough data for cognitive analysis.";
        let leakSeverity = 'info';

        if (poorSleepTotal > 2 && poorWinRate < goodWinRate * 0.8) {
            leak = `Cognitive fatigue detected. Performance drops by ${Math.round((goodWinRate - poorWinRate) * 100)}% when sleep is under 7h.`;
            leakSeverity = 'critical';
        } else if (lowFocusCount > 2 && (lowFocusRR / lowFocusCount) < (highFocusRR / highFocusCount) * 0.7) {
            leak = "Low focus days correlate with poor Execution quality. Avoid high-stakes sessions.";
            leakSeverity = 'warning';
        }

        return {
            weekdayPerf,
            sleepCorrelation: {
                poor: Math.round(poorWinRate * 100),
                good: Math.round(goodWinRate * 100)
            },
            focusCorrelation: {
                low: lowFocusCount > 0 ? (lowFocusRR / lowFocusCount).toFixed(2) : 0,
                high: highFocusCount > 0 ? (highFocusRR / highFocusCount).toFixed(2) : 0
            },
            leak,
            leakSeverity
        };
    },

    getCalendarEvents: async (dateStr) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const dayOfMonth = date.getDate();
        
        let macroSeeds = [];
        if (dayOfMonth === 24 || dayOfMonth === 14) {
            macroSeeds = [
                { id: 'm1', time: '08:30', asset: 'USD', impact: 'high', title: 'Consumer Price Index (CPI) m/m', forecast: '0.3%', previous: '0.4%', tags: ['SPX', 'NDX'], type: 'macro' },
                { id: 'm2', time: '10:00', asset: 'USD', impact: 'medium', title: 'CB Consumer Confidence', forecast: '103.9', previous: '103.0', tags: [], type: 'macro' },
                { id: 'm3', time: '14:00', asset: 'USD', impact: 'high', title: 'FOMC Economic Projections', note: 'Expected: Aggressive Rate Stance', type: 'macro' },
                { id: 'm4', time: '16:30', asset: 'USD', impact: 'low', title: 'API Weekly Crude Oil Stock', actual: '-2.435M', type: 'macro' }
            ];
        } else if (dayOfMonth % 7 === 0) {
            macroSeeds = [
                { id: 'm5', time: '09:00', asset: 'EUR', impact: 'medium', title: 'Manufacturing PMI', forecast: '44.5', previous: '43.4', type: 'macro' },
                { id: 'm6', time: '14:30', asset: 'USD', impact: 'low', title: 'Beige Book', type: 'macro' }
            ];
        }

        const uid = getUid();
        if (!uid) return [...macroSeeds].sort((a, b) => a.time.localeCompare(b.time));
        const eventsColl = collection(db, "users", uid, "events");
        const q = query(eventsColl, where("date", "==", dateStr));
        const snapshot = await getDocs(q);
        const customEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return [...macroSeeds, ...customEvents].sort((a, b) => a.time.localeCompare(b.time));
    },

    saveEvent: async (event) => {
        const uid = getUid();
        if (!uid) return;
        if (!event.id) event.id = Date.now().toString();
        event.type = 'personal';
        
        const eventRef = doc(db, "users", uid, "events", event.id);
        await setDoc(eventRef, event, { merge: true });
        return event;
    },

    getNebulaSentiment: (events) => {
        const hasHigh = events.filter(e => e.impact === 'high').length;
        if (hasHigh >= 2) return "Volatility indices are clustering. Significant liquidity shifts expected.";
        if (hasHigh === 1) return "System detecting moderate delta expansion. Macro factors are stable.";
        return "Low liquidity variance. Optimal for technical precision.";
    },

    getAccount: async () => {
        try {
            const uid = getUid();
            if (!uid) return { balance: 100000, dailyLimit: 5, maxDrawdown: 10, target: 10, phase: 'Stage 1', manualStatus: null };
            const accountRef = doc(db, "users", uid, "settings", "account");
            const docSnap = await getDoc(accountRef);
            
            return docSnap.exists() ? docSnap.data() : {
                balance: 100000,
                dailyLimit: 5,
                maxDrawdown: 10,
                target: 10,
                phase: 'Evaluation',
                manualStatus: null
            };
        } catch (e) {
            console.warn("Storage.getAccount: Access restricted.", e);
            return { balance: 100000, dailyLimit: 5, maxDrawdown: 10, target: 10, phase: 'Stage 1', manualStatus: null };
        }
    },

    saveAccount: async (account) => {
        try {
            const uid = getUid();
            if (!uid) return;
            const accountRef = doc(db, "users", uid, "settings", "account");
            await setDoc(accountRef, account, { merge: true });
            return account;
        } catch (e) {
            console.error("Storage.saveAccount Error:", e);
        }
    },

    getPropFirmMetrics: async () => {
        const trades = await Storage.getTrades();
        const account = await Storage.getAccount();
        const today = new Date().toISOString().split('T')[0];

        const dailyTrades = trades.filter(t => t.date && t.date.split('T')[0] === today);
        const dailyPL = dailyTrades.reduce((sum, t) => sum + (parseFloat(t.result) || 0), 0);
        const totalPL = trades.reduce((sum, t) => sum + (parseFloat(t.result) || 0), 0);
        
        const dailyLimitUSD = (account.balance * (account.dailyLimit / 100)) * -1;
        const maxDrawdownUSD = (account.balance * (account.maxDrawdown / 100)) * -1;
        const targetUSD = (account.balance * (account.target / 100));

        return {
            balance: account.balance,
            currentBalance: account.balance + totalPL,
            dailyPL,
            dailyLimitUSD,
            dailyRemaining: Math.max(0, dailyPL - dailyLimitUSD),
            totalPL,
            maxDrawdownUSD,
            totalRemaining: Math.max(0, totalPL - maxDrawdownUSD),
            targetUSD,
            targetRemaining: Math.max(0, targetUSD - totalPL),
            status: account.manualStatus || (dailyPL <= dailyLimitUSD * 0.8 || totalPL <= maxDrawdownUSD * 0.8 ? 'bad' : totalPL >= targetUSD * 0.5 ? 'good' : 'neutral')
        };
    },

    getProfile: async () => {
        try {
            const uid = getUid();
            if (!uid) return { displayName: "Admiral", avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", language: "en", theme: "dark", plan: 'pro' };
            const profileRef = doc(db, "users", uid, "settings", "profile");
            const docSnap = await getDoc(profileRef);
            return docSnap.exists() ? docSnap.data() : { displayName: "Admiral", avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", language: "en", theme: "dark", plan: 'pro' };
        } catch (e) {
            console.warn("Storage.getProfile: Access restricted.", e);
            return { displayName: "Admiral", avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", language: "en", theme: "dark", plan: 'pro' };
        }
    },

    saveProfile: async (profile) => {
        try {
            const uid = getUid();
            if (!uid) return;
            const profileRef = doc(db, "users", uid, "settings", "profile");
            await setDoc(profileRef, profile, { merge: true });
            return profile;
        } catch (e) {
            console.error("Storage.saveProfile Error:", e);
        }
    },
};
