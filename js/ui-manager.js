/**
 * TradeOS UI Manager
 * Handles real-time Theme (Light/Dark) and Language (EN/ES) orchestration.
 * Integrates with Storage and i18n modules.
 */
import { Storage } from './storage.js';
import { i18n } from './i18n.js';

export const UIManager = {
    /**
     * Initialize UI settings from the user's profile.
     */
    init: async () => {
        try {
            const profile = await Storage.getProfile();
            
            // Apply Theme
            UIManager.setTheme(profile.theme || 'dark');
            
            // Apply Language
            UIManager.setLanguage(profile.language || 'en');
            
            // Apply Cosmic Effects
            document.body.classList.add('cosmic-bg');
            UIManager.initToastContainer();
            
            // All features are now unlocked by default in the unified TradeOS suite.
            return profile;
        } catch (e) {
            console.error("Dashboard Init Failure:", e);
            return { displayName: 'Admiral', theme: 'dark', language: 'en' };
        }
    },

    /**
     * Initialize the toast container for notifications.
     */
    initToastContainer: () => {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
    },

    /**
     * Show a cosmic toast notification.
     * @param {string} message - The message to display.
     * @param {string} type - 'success', 'error', or 'info'.
     */
    showToast: (message, type = 'info') => {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info';
        toast.innerHTML = `
            <span class="material-symbols-outlined">${icon}</span>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Remove after 4 seconds
        setTimeout(() => {
            toast.classList.add('out');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    },

    /**
     * Unified access check (always true since the suite is now open-access).
     * Maintained for compatibility with existing modules.
     */
    checkAccess: () => true,

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
        window.location.reload();
    }
};

window.UIManager = UIManager;
