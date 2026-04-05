/**
 * TradeOS Globalization Module (i18n)
 * Provides English and Spanish translations for the entire suite.
 * Technical trading terms remain in English as per user instruction.
 */

const translations = {
    en: {
        // Nav
        dashboard: "Dashboard",
        journal: "Journal",
        calendar: "Calendar",
        habits: "Habits",
        insights: "Insights",
        logout: "Logout",
        new_trade: "New Trade",

        // Dashboard
        system_protocol: "System Protocol",

        // Pricing
        pricing_title: "Cosmic Subscription",
        pricing_subtitle: "Choose your trajectory. Scale your edge with interstellar precision.",
        nebula_desc: "Essential tracking for the fundamental trader.",
        supernova_desc: "Enhanced intelligence for the consistent performer.",
        galactic_desc: "Full-spectrum command for the professional institution.",
        free: "Free",
        current_plan: "Current Plan",
        get_started: "Get Started",
        upgrade_now: "Upgrade Now",
        features_included: "Features Included",
        nebula_features: ["Basic Journaling", "Daily Calibration", "Standard Dashboard"],
        supernova_features: ["Nebula Intelligence (AI)", "Full History Access", "Calendar Synchronization"],
        galactic_features: ["Multi-Account Sentinel", "Priority Performance Sync", "Zero Latency Support"],
        system_performance: "System Performance",
        welcome_back: "Welcome back, Commander. Here's your current market standing.",
        total_profit: "Total Profit / Loss",
        win_rate: "Win Rate",
        daily_pl: "Daily P/L",
        avg_r: "Avg R",
        target: "Target",
        prop_firm_sentinel: "Prop Firm Sentinel",
        daily_buffer: "Daily Buffer",
        max_drawdown_buffer: "Max Drawdown Buffer",
        magic_import: "Magic Import",
        manual_override: "Manual Override",
        force_restricted: "Force restricted mode",
        operational: "OPERATIONAL",
        restricted: "RESTRICTED",
        recent_trades: "Recent Trades",
        asset: "Asset",
        type: "Type",
        entry: "Entry",
        result: "Result",

        // Modals
        account_settings: "Prop Firm Settings",
        balance: "Balance ($)",
        phase: "Phase",
        daily: "Daily (%)",
        max: "Max (%)",
        target_pct: "Target (%)",
        cancel: "Cancel",
        save_account: "Save Account",
        magic_importer: "Magic Importer",
        import_data: "Paste JSON here...",
        execute_import: "Execute Import",
        commander_profile: "Commander Profile",
        display_name: "Display Name",
        avatar_url: "Avatar URL",
        language: "Language",
        theme: "Theme",
        update_profile: "Update Profile",

        // Habits
        daily_calibration: "Daily Calibration",
        flow_state: "Calibrate your biological systems for peak interstellar performance.",
        live_calibration: "Live Calibration",
        hydration: "Hydration",
        hydration_target: "of 3.0L Target",
        exercise: "Exercise",
        daily_physical: "Daily physical activity logs.",
        log_completed: "Log completed",
        sleep: "Sleep Quality",
        sleep_subjective: "Subjective measurement of restorative depth (Hours).",
        reading: "Reading",
        daily_technical: "Daily technical reading",
        meditation: "Meditation",
        start_session: "Start session",
        mindset_calibration: "Mindset Calibration",
        focus: "Focus Level",
        stress: "Stress Level",
        notes: "Notes",
        habit_notes_placeholder: "Any specific market observations or biological feedback...",

        // Calendar
        critical_events: "Critical Events",
        macro_signals: "Real-time macro signals synchronized with your trading schedule.",
        high: "High",
        med: "Med",
        low: "Low",
        all: "All",
        today: "Today",
        nebula_intelligence: "Nebula Intelligence",
        market_sentiment: "Market Sentiment Engine",
        central_bank: "Central Bank Pulse",
        new_event: "New Event",
        add_personal: "Add Personal Session",
        save_event: "Save Event",

        // Insights
        intelligence: "Intelligence",
        synthetic_cognition: "Synthetic cognition mapping your behavioral patterns against market velocity.",
        analyzing_data: "Analyzing system data... Please ensure you have trades and habits logged.",

        // Journal
        detailed_history: "Detailed history of your market operations.",
        date: "Date",
        rr: "R:R",
        actions: "Actions",

        // Trade Entry
        execute_positions: "Execute positions within the cosmic flow.",
        buy: "BUY",
        sell: "SELL",
        select_asset: "Select Asset",
        entry_price: "Entry Price",
        stop_loss: "Stop Loss",
        take_profit: "Take Profit",
        result_pl: "Result (P/L)",
        save_trade: "SAVE TRADE",
        trade_summary: "Trade Summary",
        enter_trade_details: "Enter trade details to see projected metrics."
    },
    es: {
        // Nav
        dashboard: "Panel de Control",
        journal: "Diario",
        calendar: "Calendario",
        habits: "Hábitos",
        insights: "Análisis AI",
        logout: "Cerrar Sesión",
        new_trade: "Nuevo Trade",

        // Dashboard
        system_protocol: "Protocolo del Sistema",

        // Pricing
        pricing_title: "Suscripción Cósmica",
        pricing_subtitle: "Elija su trayectoria. Escale su ventaja con precisión interestelar.",
        nebula_desc: "Seguimiento esencial para el trader fundamental.",
        supernova_desc: "Inteligencia mejorada para el operador consistente.",
        galactic_desc: "Comando de espectro completo para la institución profesional.",
        free: "Gratis",
        current_plan: "Plan Actual",
        get_started: "Comenzar",
        upgrade_now: "Actualizar Ahora",
        features_included: "Funciones Incluidas",
        nebula_features: ["Diario Básico", "Calibración Diaria", "Panel Estándar"],
        supernova_features: ["Inteligencia Nebula (AI)", "Acceso a Historial Completo", "Sincronización de Calendario"],
        galactic_features: ["Centinela Multi-Cuenta", "Sincronización de Prioridad", "Soporte de Latencia Cero"],
        system_performance: "Rendimiento del Sistema",
        welcome_back: "Bienvenido, Comandante. Aquí está su estado actual en el mercado.",
        total_profit: "Pérdida / Ganancia Total",
        win_rate: "Win Rate",
        daily_pl: "P/L Diario",
        avg_r: "Promedio R",
        target: "Objetivo",
        prop_firm_sentinel: "Centinela de Prop Firm",
        daily_buffer: "Buffer Diario",
        max_drawdown_buffer: "Buffer de Max Drawdown",
        magic_import: "Importación Mágica",
        manual_override: "Anulación Manual",
        force_restricted: "Forzar modo restringido",
        operational: "OPERATIVO",
        restricted: "RESTRINGIDO",
        recent_trades: "Trades Recientes",
        asset: "Activo",
        type: "Tipo",
        entry: "Entrada",
        result: "Resultado",

        // Modals
        account_settings: "Ajustes de Cuenta Prop",
        balance: "Balance ($)",
        phase: "Fase",
        daily: "Diario (%)",
        max: "Máx (%)",
        target_pct: "Objetivo (%)",
        cancel: "Cancelar",
        save_account: "Guardar Cuenta",
        magic_importer: "Importador Mágico",
        import_data: "Pegue el JSON aquí...",
        execute_import: "Ejecutar Importación",
        commander_profile: "Perfil del Comandante",
        display_name: "Nombre de Pantalla",
        avatar_url: "URL del Avatar",
        language: "Idioma",
        theme: "Tema",
        update_profile: "Actualizar Perfil",

        // Habits
        daily_calibration: "Calibración Diaria",
        flow_state: "Calibración de sistemas biológicos para rendimiento interestelar.",
        live_calibration: "Calibración en Vivo",
        hydration: "Hidratación",
        hydration_target: "de 3.0L Objetivo",
        exercise: "Ejercicio",
        daily_physical: "Registros de actividad física diaria.",
        log_completed: "Registro completado",
        sleep: "Calidad del Sueño",
        sleep_subjective: "Medición subjetiva de la profundidad restauradora (Horas).",
        reading: "Lectura",
        daily_technical: "Lectura técnica diaria",
        meditation: "Meditación",
        start_session: "Iniciar sesión",
        mindset_calibration: "Calibración de Mentalidad",
        focus: "Nivel de Enfoque",
        stress: "Nivel de Estrés",
        notes: "Notas",
        habit_notes_placeholder: "Observaciones de mercado o retroalimentación biológica...",

        // Calendar
        critical_events: "Eventos Críticos",
        macro_signals: "Señales macro en tiempo real sincronizadas con su horario.",
        high: "Alto",
        med: "Med",
        low: "Bajo",
        all: "Todo",
        today: "Hoy",
        nebula_intelligence: "Inteligencia Nebula",
        market_sentiment: "Motor de Sentimiento de Mercado",
        central_bank: "Pulso del Banco Central",
        new_event: "Nuevo Evento",
        add_personal: "Añadir Sesión Personal",
        save_event: "Guardar Evento",

        // Insights
        intelligence: "Inteligencia",
        synthetic_cognition: "Cognición sintética mapeando sus patrones de comportamiento contra la velocidad del mercado.",
        analyzing_data: "Analizando datos del sistema... Asegúrese de tener trades y hábitos registrados.",

        // Journal
        detailed_history: "Historial detallado de sus operaciones de mercado.",
        date: "Fecha",
        rr: "R:R",
        actions: "Acciones",

        // Trade Entry
        execute_positions: "Ejecute posiciones dentro del flujo cósmico.",
        buy: "COMPRA",
        sell: "VENTA",
        select_asset: "Seleccionar Activo",
        entry_price: "Precio de Entrada",
        stop_loss: "Stop Loss",
        take_profit: "Take Profit",
        result_pl: "Resultado (P/L)",
        save_trade: "GUARDAR TRADE",
        trade_summary: "Resumen del Trade",
        enter_trade_details: "Ingrese los detalles para ver métricas proyectadas."
    }
};

export const i18n = {
    currentLocale: 'en',

    setLocale(locale) {
        if (translations[locale]) {
            this.currentLocale = locale;
            document.documentElement.lang = locale;
        }
    },

    t(key) {
        return translations[this.currentLocale][key] || key;
    },

    translatePage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[this.currentLocale][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    if (el.placeholder) el.placeholder = translations[this.currentLocale][key];
                    else el.value = translations[this.currentLocale][key];
                } else {
                    el.textContent = translations[this.currentLocale][key];
                }
            }
        });

        // Special case for placeholders or complex structures if needed
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[this.currentLocale][key]) {
                el.placeholder = translations[this.currentLocale][key];
            }
        });
    }
};
