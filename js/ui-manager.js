/**
 * TradeOS UI Manager
 * Handles real-time Theme (Light/Dark) and Language (EN/ES) orchestration.
 * Integrates with Storage and i18n modules.
 */
import { Storage } from './storage.js';
import { i18n } from './i18n.js';

export const UIManager = {
    /**
     * Initialize UI based on User Profile.
     */
    init: async () => {
        const profile = await Storage.getProfile();
        
        // Apply Theme
        UIManager.setTheme(profile.theme || 'dark');
        
        // Apply Language
        UIManager.setLanguage(profile.language || 'en');
        
        // Handle Feature Gating
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'insights.html') {
            UIManager.checkAccess(profile.plan, 'supernova');
        } else if (currentPage === 'calendar.html') {
            UIManager.checkAccess(profile.plan, 'supernova');
        }
        
        return profile;
    },

    /**
     * Check if the user's plan supports a specific feature.
     * Redirects to pricing.html if not.
     */
    checkAccess: (userPlan, requiredTier) => {
        const tiers = { nebula: 0, supernova: 1, galactic: 2 };
        if (tiers[userPlan] < tiers[requiredTier]) {
            console.warn(`Access Denied: ${userPlan} < ${requiredTier}. Redirecting to pricing...`);
            // Show a brief message before redirecting
            const overlay = document.createElement('div');
            overlay.className = 'fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8';
            overlay.innerHTML = `
                <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <span class="material-symbols-outlined text-4xl text-primary">lock</span>
                </div>
                <h2 class="text-3xl font-headline font-bold text-white mb-4">Command Restricted</h2>
                <p class="text-slate-400 max-w-md mb-8">The ${requiredTier.toUpperCase()} protocol is required to access this sector of the Nebula Intelligence suite.</p>
                <button onclick="window.location.href='pricing.html'" class="px-8 py-4 bg-primary text-slate-950 font-bold rounded-lg hover:shadow-[0_0_20px_#85adff] transition-all">
                    UPGRADE SUBSCRIPTION
                </button>
            `;
            document.body.appendChild(overlay);
            
            // Still return false for caller logic
            return false;
        }
        return true;
    },

    /**
     * Apply Theme to the document.
     * Uses CSS Variables for dynamic Tailwind mapping.
     */
    setTheme: (theme) => {
        const html = document.documentElement;
        if (theme === 'light') {
            html.classList.remove('dark');
            html.classList.add('light');
        } else {
            html.classList.remove('light');
            html.classList.add('dark');
        }
        
        // Update CSS Variables for Tailwind to pick up
        const root = document.querySelector(':root');
        if (theme === 'light') {
            root.style.setProperty('--background', '#f8fafc');
            root.style.setProperty('--on-surface', '#0f172a');
            root.style.setProperty('--surface-container-high', '#ffffff');
            root.style.setProperty('--surface-container-low', '#f1f5f9');
            root.style.setProperty('--outline-variant', '#cbd5e1');
        } else {
            root.style.setProperty('--background', '#0b0e15');
            root.style.setProperty('--on-surface', '#e7e7f1');
            root.style.setProperty('--surface-container-high', '#1c1f28');
            root.style.setProperty('--surface-container-low', '#10131b');
            root.style.setProperty('--outline-variant', '#454850');
        }
    },

    /**
     * Apply Language to the page.
     */
    setLanguage: (lang) => {
        i18n.setLocale(lang);
        i18n.translatePage();
    },

    /**
     * Toggle Theme and save to profile.
     */
    toggleTheme: async () => {
        const profile = await Storage.getProfile();
        const newTheme = profile.theme === 'dark' ? 'light' : 'dark';
        profile.theme = newTheme;
        
        UIManager.setTheme(newTheme);
        await Storage.saveProfile(profile);
    },

    /**
     * Change Language and save to profile.
     */
    changeLanguage: async (lang) => {
        const profile = await Storage.getProfile();
        profile.language = lang;
        
        UIManager.setLanguage(lang);
        await Storage.saveProfile(profile);
    }
};
